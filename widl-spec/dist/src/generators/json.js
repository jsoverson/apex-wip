"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegen = void 0;
function enumDef(e) {
    return {
        name: e.name,
        values: e.values.map(v => v.value),
    };
}
function codegen(idl) {
    function typeDef(e) {
        return {
            name: e.name,
            type: idl.idlTypeToType(e.idlType),
        };
    }
    function nameTypePair(member) {
        const optional = member.idlType.nullable;
        const type = idl.idlTypeToType(member.idlType);
        return { name: member.name, optional, type };
    }
    function reduceInterface(def) {
        const inherits = def.inheritance;
        const properties = def.members.map(m => propertyDeclaration(m));
        return {
            name: def.name,
            inherits,
            properties,
        };
    }
    function propertyDeclaration(member) {
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
exports.codegen = codegen;
//# sourceMappingURL=json.js.map