import { EnumType, IDLTypeDescription, InterfaceType, TypedefType } from 'webidl2';
export declare class Idl {
    interfaces: Record<string, InterfaceType>;
    enums: Record<string, EnumType>;
    namedTypes: Record<string, TypedefType>;
    idlTypeToType(t: string | IDLTypeDescription | IDLTypeDescription[]): ConsumerType;
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
export declare type ConsumerType = SimpleType | UnionType | NamedType;
declare type EitherType = ConsumerType;
declare type ConsumerTypeKinds = 'nullable' | 'union' | 'list' | 'value' | 'interface' | 'typedef' | 'webidl-primitive' | 'enum';
export declare function parse(src: string): Idl;
export declare function toJson(src: string): string;
export {};
