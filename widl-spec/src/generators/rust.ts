import {
  AttributeMemberType,
  EnumType,
  IDLInterfaceMemberType,
  IDLTypeDescription,
  InterfaceType,
  TypedefType,
  UnionTypeDescription,
} from 'webidl2';
import { ConsumerType, Idl } from '../consumer';

function makeDerive(tag = 'kind') {
  return `
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "${tag}")]
`;
}

// As-needed sanitization of reserved identifiers
function sanitizeIdentifier(name: string): string {
  switch (name) {
    case 'type':
      return `r#${name}`;
    default:
      return name;
  }
}

function assertMember(m: IDLInterfaceMemberType): AttributeMemberType {
  if (m.type === 'attribute') return m;
  throw new Error(`Unhandled type ${JSON.stringify(m)}`);
}

function enumDef(e: EnumType): string {
  return `${makeDerive('value')}
pub enum ${e.name}{ ${e.values.map(v => `#[allow(non_camel_case_types)]\n${v.value}`).join(',')}}`;
}

function mapStringTypes(t: string): string {
  switch (t) {
    case 'string':
      return 'String';
    case 'double':
      return 'f64';
    case 'unsigned_long_long':
      return 'u64';
    case 'boolean':
      return 'bool';
    case 'PrimitiveType':
    case 'ComplexType':
      return t;
    default:
      return `${t}`;
  }
}
function rustType(type: ConsumerType | string): string {
  if (typeof type === 'string') {
    return mapStringTypes(type);
  }
  if (type.type === 'list') return `Vec<${rustType(type.def)}>`;
  if (type.type === 'union') throw new Error('Union types can not be automatically handled in rust');
  if (type.type === 'nullable') return `Option<${rustType(type.def)}>`;
  return `${rustType(type.def)}`;
}

function getUnion(def: TypedefType): UnionTypeDescription {
  const type = def.idlType;
  if (!Array.isArray(type.idlType) || type.union !== true) throw new Error(`Non-enumifiable typedef ${def.name}`);
  return type;
}

function getSerdeAttributes(m: AttributeMemberType) {
  return m.idlType.nullable ? '#[serde(default, skip_serializing_if="Option::is_none")]\n' : '';
}

export function codegen(idl: Idl): string {
  function propertyDeclaration(member: AttributeMemberType) {
    const { name, type } = nameTypePair(member);
    return `${sanitizeIdentifier(name)}:${type}`;
  }

  function nameTypePair(member: AttributeMemberType) {
    const type = rustType(idl.idlTypeToType(member.idlType));
    return { name: member.name, type };
  }

  function toFieldProperty(m: AttributeMemberType): string {
    return propertyDeclaration(m);
  }

  function toEnum(def: TypedefType) {
    const toNestedEnum = (def: InterfaceType) => `${def.name}(${def.name})`;
    const fields = Object.values(idl.interfaces).map(toNestedEnum).join(',\n');
    return `${makeDerive()} pub enum ${def.name} { ${fields} }`;
  }

  function toExpandedEnum(def: TypedefType) {
    const fields = getUnion(def).idlType.map(toExpandedEnumValue).join(',');
    return `${makeDerive()} pub enum ${def.name} { ${fields} }`;
  }

  function toExpandedEnumValue(t: IDLTypeDescription): string {
    const name = getName(t);
    const def = idl.interfaces[name];
    const fields = def.members.map(assertMember).map(m => `${getSerdeAttributes(m)}${toFieldProperty(m)}`);
    return `pub ${name} {${fields}}`;
  }

  function toBoxedEnum(def: TypedefType) {
    const type = getUnion(def);
    const fields = type.idlType.map(toBoxedEnumValue).join(',');
    const impls = type.idlType.map(addFromBoxedImpl).join('\n');
    return `
${makeDerive()}
pub enum ${def.name} { ${fields} }
${impls}
  `;
  }

  function getName(t: IDLTypeDescription): string {
    const name = t.idlType;
    if (typeof name !== 'string') throw new Error(`Can not convert ${name} to enum value`);
    return name;
  }

  function toBoxedEnumValue(t: IDLTypeDescription): string {
    const name = getName(t);
    return `pub ${name}(Box<${name}>)`;
  }

  function addFromBoxedImpl(t: IDLTypeDescription): string {
    const name = getName(t);
    return `
impl From<${name}> for TypeReference {
    fn from(t: ${name}) -> Self {
        TypeReference::${name}(Box::new(t))
    }
}
`;
  }

  function toStruct(def: InterfaceType) {
    return `
${makeDerive()}
pub struct ${def.name} {
  ${def.members
    .map(assertMember)
    .map(m => {
      const serde = m.idlType.nullable ? '#[serde(default, skip_serializing_if="Option::is_none")]\n' : '';
      return `${serde}pub ${toFieldProperty(m)}`;
    })
    .join(',')}
}
  `;
  }

  const moduleSrc = `
use serde::{Deserialize, Serialize};

${Object.values(idl.enums).map(enumDef).join('\n')}

impl From<&str> for PrimitiveType {
  fn from(s: &str) -> Self {
    match s {
      ${idl.enums.PrimitiveType.values.map(v => `"${v.value}" => PrimitiveType::${v.value},`).join('')}
      _ => unreachable!(),
    }
  }
}

${toBoxedEnum(idl.namedTypes.TypeReference)}

${toExpandedEnum(idl.namedTypes.Definition)}

${toEnum(idl.namedTypes.AstNode)}

${toEnum(idl.namedTypes.LiteralValue)}

${Object.values(idl.interfaces).map(toStruct).join('\n')}

${makeDerive()}
pub struct Location {
  pub start: i32,
  pub end: i32,
  pub source: Source,

}

${makeDerive()}
pub struct Source {
  pub body: String,
  pub name: String,
}
`;
  return moduleSrc;
}
