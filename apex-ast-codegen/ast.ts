export class Value {
  kind: string;
  value: PrimitiveType;
  constructor(kind: string, value: PrimitiveType) {
    this.kind = kind;
    this.value = value;
  }
}
export class ApexDocument {
  kind: string;
  definitions: Definition[];
  constructor(kind: string, definitions: Definition[]) {
    this.kind = kind;
    this.definitions = definitions;
  }
}
export class Annotation {
  kind: string;
  name: Name;
  arguments: Argument[];
  constructor(kind: string, name: Name, _arguments: Argument[]) {
    this.kind = kind;
    this.name = name;
    this.arguments = _arguments;
  }
}
export class Argument {
  kind: string;
  name: Name;
  value: Value;
  constructor(kind: string, name: Name, value: Value) {
    this.kind = kind;
    this.name = name;
    this.value = value;
  }
}
export class DirectiveRequire {
  kind: string;
  directive: Name;
  constructor(kind: string, directive: Name) {
    this.kind = kind;
    this.directive = directive;
  }
}
export class ImportName {
  kind: string;
  name: Name;
  alias: Name | undefined;
  constructor(kind: string, name: Name, alias: Name | undefined) {
    this.kind = kind;
    this.name = name;
    this.alias = alias;
  }
}
export class NamespaceDefinition {
  kind: string;
  name: StringValue;
  description: StringValue | undefined;
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: StringValue,
    description: StringValue | undefined,
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.annotations = annotations;
  }
}
export class AliasDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  type: TypeReference;
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    type: TypeReference,
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.type = type;
    this.annotations = annotations;
  }
}
export class ImportDefinition {
  kind: string;
  description: StringValue | undefined;
  all: boolean;
  names: ImportName[];
  from: StringValue;
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    description: StringValue | undefined,
    all: boolean,
    names: ImportName[],
    from: StringValue,
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.description = description;
    this.all = all;
    this.names = names;
    this.from = from;
    this.annotations = annotations;
  }
}
export class TypeDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  interfaces: Named[] | undefined;
  fields: FieldDefinition[];
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    interfaces: Named[] | undefined,
    fields: FieldDefinition[],
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.interfaces = interfaces;
    this.fields = fields;
    this.annotations = annotations;
  }
}
export class OperationDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  parameters: ParameterDefinition[];
  type: TypeReference;
  unary: boolean;
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    parameters: ParameterDefinition[],
    type: TypeReference,
    unary: boolean,
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.parameters = parameters;
    this.type = type;
    this.unary = unary;
    this.annotations = annotations;
  }
}
export class FieldDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  type: TypeReference;
  default: Value | undefined;
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    type: TypeReference,
    _default: Value | undefined,
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.type = type;
    this.default = _default;
    this.annotations = annotations;
  }
}
export class ParameterDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  type: TypeReference;
  default: Value | undefined;
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    type: TypeReference,
    _default: Value | undefined,
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.type = type;
    this.default = _default;
    this.annotations = annotations;
  }
}
export class InterfaceDefinition {
  kind: string;
  description: StringValue | undefined;
  operations: OperationDefinition[];
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    description: StringValue | undefined,
    operations: OperationDefinition[],
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.description = description;
    this.operations = operations;
    this.annotations = annotations;
  }
}
export class RoleDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  operations: OperationDefinition[];
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    operations: OperationDefinition[],
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.operations = operations;
    this.annotations = annotations;
  }
}
export class UnionDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  types: Named[];
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    types: Named[],
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.types = types;
    this.annotations = annotations;
  }
}
export class EnumDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  values: EnumValueDefinition[];
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    values: EnumValueDefinition[],
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.values = values;
    this.annotations = annotations;
  }
}
export class EnumValueDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  index: IntValue;
  display: StringValue | undefined;
  annotations: Annotation[] | undefined;
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    index: IntValue,
    display: StringValue | undefined,
    annotations: Annotation[] | undefined
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.index = index;
    this.display = display;
    this.annotations = annotations;
  }
}
export class DirectiveDefinition {
  kind: string;
  name: Name;
  description: StringValue | undefined;
  parameters: ParameterDefinition[];
  locations: Name[];
  requires: DirectiveRequire[];
  constructor(
    kind: string,
    name: Name,
    description: StringValue | undefined,
    parameters: ParameterDefinition[],
    locations: Name[],
    requires: DirectiveRequire[]
  ) {
    this.kind = kind;
    this.name = name;
    this.description = description;
    this.parameters = parameters;
    this.locations = locations;
    this.requires = requires;
  }
}
export class Name {
  kind: string;
  value: string;
  constructor(kind: string, value: string) {
    this.kind = kind;
    this.value = value;
  }
}
export class Named {
  kind: string;
  name: Name;
  constructor(kind: string, name: Name) {
    this.kind = kind;
    this.name = name;
  }
}
export class ListType {
  kind: string;
  type: TypeReference;
  constructor(kind: string, type: TypeReference) {
    this.kind = kind;
    this.type = type;
  }
}
export class MapType {
  kind: string;
  keytype: TypeReference;
  valuetype: TypeReference;
  constructor(kind: string, keytype: TypeReference, valuetype: TypeReference) {
    this.kind = kind;
    this.keytype = keytype;
    this.valuetype = valuetype;
  }
}
export class Optional {
  kind: string;
  type: TypeReference;
  constructor(kind: string, type: TypeReference) {
    this.kind = kind;
    this.type = type;
  }
}
export class IntValue {
  kind: string;
  value: number;
  constructor(kind: string, value: number) {
    this.kind = kind;
    this.value = value;
  }
}
export class FloatValue {
  kind: string;
  value: number;
  constructor(kind: string, value: number) {
    this.kind = kind;
    this.value = value;
  }
}
export class StringValue {
  kind: string;
  value: string;
  constructor(kind: string, value: string) {
    this.kind = kind;
    this.value = value;
  }
}
export class BooleanValue {
  kind: string;
  value: boolean;
  constructor(kind: string, value: boolean) {
    this.kind = kind;
    this.value = value;
  }
}
export class EnumValue {
  kind: string;
  value: string;
  constructor(kind: string, value: string) {
    this.kind = kind;
    this.value = value;
  }
}
export class ListValue {
  kind: string;
  value: Value[];
  constructor(kind: string, value: Value[]) {
    this.kind = kind;
    this.value = value;
  }
}
export class ObjectValue {
  kind: string;
  fields: ObjectField[];
  constructor(kind: string, fields: ObjectField[]) {
    this.kind = kind;
    this.fields = fields;
  }
}
export class ObjectField {
  kind: string;
  name: Name;
  value: Value;
  constructor(kind: string, name: Name, value: Value) {
    this.kind = kind;
    this.name = name;
    this.value = value;
  }
}
export type Definition =
  | NamespaceDefinition
  | TypeDefinition
  | AliasDefinition
  | ImportDefinition
  | InterfaceDefinition
  | RoleDefinition
  | EnumDefinition
  | DirectiveDefinition;
export type LiteralValue =
  | IntValue
  | FloatValue
  | StringValue
  | BooleanValue
  | EnumValue
  | ListValue
  | ObjectValue;
export type TypeReference =
  | PrimitiveType
  | Named
  | ListType
  | MapType
  | Optional;
export type AstNode =
  | Value
  | ApexDocument
  | Annotation
  | Argument
  | DirectiveRequire
  | ImportName
  | AliasDefinition
  | ImportDefinition
  | TypeDefinition
  | OperationDefinition
  | FieldDefinition
  | ParameterDefinition
  | InterfaceDefinition
  | RoleDefinition
  | UnionDefinition
  | EnumDefinition
  | EnumValueDefinition
  | DirectiveDefinition
  | ListType
  | MapType
  | Optional
  | IntValue
  | FloatValue
  | StringValue
  | BooleanValue
  | EnumValue
  | ListValue
  | ObjectValue
  | ObjectField;
export enum PrimitiveType {
  i8,
  u8,
  i16,
  u16,
  i32,
  u32,
  i64,
  u64,
  f32,
  f64,
  bool,
  string,
  datetime,
  bytes,
  raw,
  value,
  any,
}
