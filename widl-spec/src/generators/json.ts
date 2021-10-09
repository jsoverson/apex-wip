import { AttributeMemberType, EnumType, IDLInterfaceMemberType, InterfaceType, TypedefType } from 'webidl2';
import { Idl } from '../consumer';

function enumDef(e: EnumType) {
  return {
    name: e.name,
    values: e.values.map(v => v.value),
  };
}

export function codegen(idl: Idl): string {
  function typeDef(e: TypedefType) {
    return {
      name: e.name,
      type: idl.idlTypeToType(e.idlType),
    };
  }

  function nameTypePair(member: AttributeMemberType) {
    const optional = member.idlType.nullable;
    const type = idl.idlTypeToType(member.idlType);
    return { name: member.name, optional, type };
  }

  function reduceInterface(def: InterfaceType) {
    const inherits = def.inheritance;
    const properties = def.members.map(m => propertyDeclaration(m as AttributeMemberType));
    return {
      name: def.name,
      inherits,
      properties,
    };
  }

  function propertyDeclaration(member: AttributeMemberType) {
    return nameTypePair(member);
  }

  const obj = {
    all_nodes: Object.keys(idl.interfaces),
    enums: Object.values(idl.enums).map(enumDef),
    typedefs: Object.values(idl.namedTypes).map(typeDef),
    interfaces: Object.values(idl.interfaces).map(def => reduceInterface(def)),
  };

  return JSON.stringify(obj, null, 2);
}
