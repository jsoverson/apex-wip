"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJson = exports.parse = exports.Idl = void 0;
const webidl2_1 = require("webidl2");
class Idl {
    constructor() {
        this.interfaces = {};
        this.enums = {};
        this.namedTypes = {};
    }
    idlTypeToType(t) {
        // converts a type as returned by the parser to a type as defined above
        if (typeof t === 'string') {
            if (this.interfaces[t]) {
                return Interface(t);
            }
            if (this.namedTypes[t]) {
                return TypeDef(t);
            }
            if (this.enums[t]) {
                return Enum(t);
            }
            return WebIdlType(t);
        }
        if (Array.isArray(t)) {
            throw new Error('not yet');
        }
        if (t.nullable) {
            if (t.union) {
                if (t.generic || !Array.isArray(t.idlType)) {
                    throw new Error(`Complex nullable-union type ${JSON.stringify(t, null, '  ')}`);
                }
                return Nullable(Union(t.idlType.map(t => this.idlTypeToType(t))));
            }
            if (t.generic === 'sequence' && Array.isArray(t.idlType)) {
                if (t.idlType.length > 1)
                    throw new Error(`Complex sequence type ${JSON.stringify(t, null, '  ')}`);
                const firstType = t.idlType[0];
                if (firstType.generic)
                    throw new Error(`Complex sequence type ${JSON.stringify(t, null, '  ')}`);
                return Nullable(List(this.idlTypeToType(firstType.idlType)));
            }
            return Nullable(this.idlTypeToType(t.idlType));
        }
        if (t.union) {
            if (t.generic || !Array.isArray(t.idlType)) {
                throw new Error(`Complex nullable-union type ${JSON.stringify(t, null, '  ')}`);
            }
            return Union(t.idlType.map(t => this.idlTypeToType(t)));
        }
        if (t.generic === 'sequence' && Array.isArray(t.idlType)) {
            if (t.idlType.length > 1)
                throw new Error(`Complex sequence type ${JSON.stringify(t, null, '  ')}`);
            return List(this.idlTypeToType(t.idlType[0]));
        }
        if (isSimpleIdlType(t)) {
            return this.idlTypeToType(t.idlType);
        }
        throw new Error(`Unsupported IDL type ${JSON.stringify(t, null, '  ')}`);
    }
}
exports.Idl = Idl;
function Nullable(t) {
    return { type: 'nullable', def: t };
}
function Union(t) {
    return { type: 'union', def: t };
}
function List(t) {
    return { type: 'list', def: t };
}
function Interface(t) {
    return { type: 'interface', def: t };
}
function TypeDef(t) {
    return { type: 'typedef', def: t };
}
function WebIdlType(t) {
    return { type: 'webidl-primitive', def: t };
}
function Enum(t) {
    return { type: 'enum', def: t };
}
function isSimpleIdlType(type) {
    return !type.generic && !type.nullable && !type.union && typeof type.idlType === 'string';
}
function parse(src) {
    const spec = webidl2_1.parse(src);
    const idl = new Idl();
    for (const def of spec) {
        if (def.type === 'interface') {
            idl.interfaces[def.name] = def;
        }
        else if (def.type === 'enum') {
            idl.enums[def.name] = def;
        }
        else if (def.type === 'typedef') {
            idl.namedTypes[def.name] = def;
        }
        else {
            throw new Error(`Unhandled type ${def.type}`);
        }
    }
    return idl;
}
exports.parse = parse;
function toJson(src) {
    const tree = parse(src);
    return JSON.stringify(tree, (key, value) => {
        if (key === 'idlType')
            return tree.idlTypeToType(value);
        else
            return value;
    }, 2);
}
exports.toJson = toJson;
//# sourceMappingURL=consumer.js.map