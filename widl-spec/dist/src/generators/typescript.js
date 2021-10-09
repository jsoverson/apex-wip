"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegen = exports.sanitizeIdentifier = void 0;
function member(m) {
    if (m.type === 'attribute')
        return m;
    throw new Error(`Unhandled type ${JSON.stringify(m)}`);
}
function stringify(str) {
    return `"${str}"`;
}
function argToPropAssignmentExpression(member) {
    return `this.${member.name} = ${sanitizeIdentifier(member.name)};`;
}
function tsType(type) {
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
    if (type.type === 'union')
        return `(${type.def.map(tsType).join('|')})`;
    if (type.type === 'nullable')
        return `${tsType(type.def)}`;
    return `${tsType(type.def)}`;
}
function enumDef(e) {
    return `type ${e.name} = ${e.values.map(v => stringify(v.value)).join('|')};`;
}
// As-needed sanitization of reserved identifiers
function sanitizeIdentifier(name) {
    switch (name) {
        case 'default':
        case 'arguments':
            return `_${name}`;
        default:
            return name;
    }
}
exports.sanitizeIdentifier = sanitizeIdentifier;
function codegen(idl, attributeOrder) {
    function getArgOrder(name) {
        const order = attributeOrder[name];
        if (!order)
            throw new Error(`Could not find argument order for interface ${name}`);
        return order;
    }
    function superArguments(child, parent) {
        const order = getArgOrder(parent);
        return order.map(arg => (arg === 'kind' ? stringify(child) : sanitizeIdentifier(arg))).join(',');
    }
    function typeDef(e) {
        return `type ${e.name} = ${tsType(idl.idlTypeToType(e.idlType))};`;
    }
    function nameTypePair(member) {
        const optionalToken = member.idlType.nullable ? '?' : '';
        const type = tsType(idl.idlTypeToType(member.idlType));
        console.error({ type });
        return { name: member.name, optionalToken, type };
    }
    function classTemplate(def) {
        const inheritance = def.inheritance ? ` extends ${def.inheritance}` : '';
        const abstract = inheritance ? '' : 'abstract';
        if (def.name == 'ValueDefiniton')
            console.log(def.members);
        const properties = def.members.map(m => propertyDeclaration(m));
        const assignments = def.members.map(m => argToPropAssignmentExpression(m));
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
    function constructorArguments(def) {
        const order = getArgOrder(def.name);
        const members = Object.fromEntries(def.members.map(m => [member(m).name, argumentDefinition(member(m))]));
        const args = order.map(m => members[m]);
        if (def.inheritance) {
            const ctorArgs = constructorArguments(idl.interfaces[def.inheritance]).filter(arg => !arg.startsWith('kind'));
            args.unshift(...ctorArgs);
        }
        return args;
    }
    function propertyDeclaration(member) {
        const { name, optionalToken, type } = nameTypePair(member);
        return `${name}${optionalToken}: ${type};`;
    }
    function argumentDefinition(member) {
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
exports.codegen = codegen;
//# sourceMappingURL=typescript.js.map