import { AttributeMemberType, EnumType, IDLInterfaceMemberType, InterfaceType, TypedefType } from 'webidl2';
import { ConsumerType, Idl } from '../consumer';

function member(m: IDLInterfaceMemberType): AttributeMemberType {
  if (m.type === 'attribute') return m;
  throw new Error(`Unhandled type ${JSON.stringify(m)}`);
}

function stringify(str: string): string {
  return `"${str}"`;
}

function argToPropAssignmentExpression(member: AttributeMemberType) {
  return `this.${member.name} = ${sanitizeIdentifier(member.name)};`;
}

function tsType(type: ConsumerType | string): string {
  if (typeof type === 'string') {
    switch (type) {
      case 'double':
      case 'unsigned_long_long':
        return 'number';
      default:
        return type;
    }
  }
  if (type.type === 'list') {
    return `${tsType(type.def)}[]`;
  }
  if (type.type === 'union') return `(${type.def.map(tsType).join('|')})`;
  if (type.type === 'nullable') return `${tsType(type.def)}`;
  return `${tsType(type.def)}`;
}

function enumDef(e: EnumType): string {
  return `export type ${e.name} = ${e.values.map(v => stringify(v.value)).join('|')};`;
}

// As-needed sanitization of reserved identifiers
export function sanitizeIdentifier(name: string): string {
  switch (name) {
    case 'default':
    case 'arguments':
      return `_${name}`;
    default:
      return name;
  }
}

export function codegen(idl: Idl, attributeOrder: Record<string, string[]>): string {
  function getArgOrder(name: string): string[] {
    const order = attributeOrder[name];
    if (!order) throw new Error(`Could not find argument order for interface ${name}`);
    return order;
  }

  function superArguments(child: string, parent: string) {
    const order: string[] = getArgOrder(parent);
    return order.map(arg => (arg === 'kind' ? stringify(child) : sanitizeIdentifier(arg))).join(',');
  }

  function typeDef(e: TypedefType): string {
    return `export type ${e.name} = ${tsType(idl.idlTypeToType(e.idlType))};`;
  }

  function nameTypePair(member: AttributeMemberType) {
    const optionalToken = member.idlType.nullable ? '?' : '';
    const type = tsType(idl.idlTypeToType(member.idlType));

    return { name: member.name, optionalToken, type };
  }

  function classTemplate(def: InterfaceType) {
    const inheritance = def.inheritance ? ` extends ${def.inheritance}` : '';
    const abstract = inheritance ? '' : 'abstract';
    if (def.name == 'ValueDefiniton') console.log(def.members);
    const properties = def.members.map(m => propertyDeclaration(m as AttributeMemberType));
    const assignments = def.members.map(m => argToPropAssignmentExpression(m as AttributeMemberType));
    const superCall = def.inheritance ? `super(${superArguments(def.name, def.inheritance)});` : '';
    return `
export ${abstract} class ${def.name} ${inheritance} {
  ${properties.join('\n')}
  constructor(${constructorArguments(def)}) {
    ${superCall}
    this.kind = "${def.name}";
    ${assignments.join('\n')}
  }
}
  `;
  }
  function constructorArguments(def: InterfaceType): string[] {
    const order = getArgOrder(def.name);
    const members = Object.fromEntries(def.members.map(m => [member(m).name, argumentDefinition(member(m))]));
    const args = order.map(m => members[m]);
    if (def.inheritance) {
      const ctorArgs = constructorArguments(idl.interfaces[def.inheritance]).filter(arg => !arg.startsWith('kind'));
      args.unshift(...ctorArgs);
    }
    return args;
  }

  function propertyDeclaration(member: AttributeMemberType) {
    const { name, optionalToken, type } = nameTypePair(member);
    return `${name}${optionalToken}: ${type};`;
  }

  function argumentDefinition(member: AttributeMemberType) {
    const { name, optionalToken, type } = nameTypePair(member);
    return `${sanitizeIdentifier(name)}${optionalToken}: ${type}`;
  }

  const classes = Object.values(idl.interfaces).map(def => classTemplate(def));

  const moduleSrc = `
export const ALL_TYPES = [${idl.enums.PrimitiveType.values.map(v => stringify(v.value)).join(',')}];
export const ALL_NODES = [${Object.keys(idl.interfaces).map(stringify).join(',')}];

${Object.values(idl.enums).map(enumDef).join('\n')}
${Object.values(idl.namedTypes).map(typeDef).join('\n')}

${classes.join('\n')}

export class Location {
  start: number;
  end: number;
  source: Source;

  constructor(start: number, end: number, source: Source) {
    this.start = start || 0;
    this.end = end || 0;
    this.source = source || null;
  }
}

export class Source {
  body: string;
  name: string;

  constructor(name: string, body?: string) {
    this.name = name;
    this.body = body || "";
  }

  public setBody(str: string): void {
    this.body = str;
  }
}
`;

  return moduleSrc;
}
