import { EnumType, IDLTypeDescription, InterfaceType, parse as parseWebIdl, TypedefType } from 'webidl2';

export class Idl {
  interfaces: Record<string, InterfaceType> = {};
  enums: Record<string, EnumType> = {};
  namedTypes: Record<string, TypedefType> = {};

  idlTypeToType(t: string | IDLTypeDescription | IDLTypeDescription[]): ConsumerType {
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
        if (t.idlType.length > 1) throw new Error(`Complex sequence type ${JSON.stringify(t, null, '  ')}`);
        const firstType = t.idlType[0];
        if (firstType.generic) throw new Error(`Complex sequence type ${JSON.stringify(t, null, '  ')}`);
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
      if (t.idlType.length > 1) throw new Error(`Complex sequence type ${JSON.stringify(t, null, '  ')}`);
      return List(this.idlTypeToType(t.idlType[0]));
    }

    if (isSimpleIdlType(t)) {
      return this.idlTypeToType(t.idlType);
    }

    throw new Error(`Unsupported IDL type ${JSON.stringify(t, null, '  ')}`);
  }
}
interface ConsumerTypeDef {
  type: ConsumerTypeKinds;
}

export interface SimpleType extends ConsumerTypeDef {
  type: Exclude<ConsumerTypeKinds, UnionType['type'] | NamedType['type']>;
  def: EitherType;
}
export interface UnionType extends ConsumerTypeDef {
  type: 'union';
  def: EitherType[];
}
export interface NamedType extends ConsumerTypeDef {
  type: 'interface' | 'webidl-primitive' | 'typedef' | 'enum';
  def: string;
}
export type ConsumerType = SimpleType | UnionType | NamedType;
type EitherType = ConsumerType;
type ConsumerTypeKinds =
  | 'nullable'
  | 'union'
  | 'list'
  | 'value'
  | 'interface'
  | 'typedef'
  | 'webidl-primitive'
  | 'enum';

function Nullable(t: ConsumerType): SimpleType {
  return { type: 'nullable', def: t };
}

function Union(t: EitherType[]): UnionType {
  return { type: 'union', def: t };
}

function List(t: EitherType): SimpleType {
  return { type: 'list', def: t };
}

function Interface(t: string): NamedType {
  return { type: 'interface', def: t };
}

function TypeDef(t: string): NamedType {
  return { type: 'typedef', def: t };
}

function WebIdlType(t: string): NamedType {
  return { type: 'webidl-primitive', def: t };
}

function Enum(t: string): NamedType {
  return { type: 'enum', def: t };
}

function isSimpleIdlType(type: IDLTypeDescription): type is IDLTypeDescription {
  return !type.generic && !type.nullable && !type.union && typeof type.idlType === 'string';
}

export function parse(src: string): Idl {
  const spec = parseWebIdl(src);
  const idl = new Idl();
  for (const def of spec) {
    if (def.type === 'interface') {
      idl.interfaces[def.name] = def;
    } else if (def.type === 'enum') {
      idl.enums[def.name] = def;
    } else if (def.type === 'typedef') {
      idl.namedTypes[def.name] = def;
    } else {
      throw new Error(`Unhandled type ${def.type}`);
    }
  }
  return idl;
}

export function toJson(src: string): string {
  const tree = parse(src);
  return JSON.stringify(
    tree,
    (key, value) => {
      if (key === 'idlType') return tree.idlTypeToType(value as IDLTypeDescription);
      else return value;
    },
    2,
  );
}
