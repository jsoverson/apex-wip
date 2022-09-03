/* eslint-disable @typescript-eslint/no-inferrable-types */
export class ApexDocument {
  kind: string = "ApexDocument";
  imported: boolean = false;
  definitions: Definition[];
  constructor(definitions: Definition[]) {
    this.definitions = definitions;
  }
}
export class Annotation {
  kind: string = "Annotation";
  imported: boolean = false;
  name: Name;
  arguments?: Argument[];
  constructor(name: Name, _arguments?: Argument[]) {
    this.name = name;
    if (_arguments !== undefined && _arguments !== null)
      this.arguments = _arguments;
  }
}
export class Argument {
  kind: string = "Argument";
  imported: boolean = false;
  name: Name;
  value: Value;
  constructor(name: Name, value: Value) {
    this.name = name;
    this.value = value;
  }
}
export class ImportName {
  kind: string = "ImportName";
  imported: boolean = false;
  name: Name;
  alias?: Name;
  constructor(name: Name, alias?: Name) {
    this.name = name;
    if (alias !== undefined && alias !== null) this.alias = alias;
  }
}
export class NamespaceDefinition {
  kind: string = "NamespaceDefinition";
  imported: boolean = false;
  name: StringValue;
  description?: StringValue;
  annotations: Annotation[] = [];
  constructor(
    name: StringValue,
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.name = name;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class DirectiveRequire {
  kind: string = "DirectiveRequire";
  imported: boolean = false;
  directive: Name;
  constructor(directive: Name) {
    this.directive = directive;
  }
}
export class AliasDefinition {
  kind: string = "AliasDefinition";
  imported: boolean = false;
  name: Name;
  description?: StringValue;
  type: TypeReference;
  annotations: Annotation[] = [];
  constructor(
    name: Name,
    type: TypeReference,
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.name = name;
    this.type = type;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class ImportDefinition {
  kind: string = "ImportDefinition";
  imported: boolean = false;
  description?: StringValue;
  all: boolean;
  names: ImportName[];
  from: StringValue;
  annotations: Annotation[] = [];
  constructor(
    all: boolean,
    names: ImportName[],
    from: StringValue,
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.all = all;
    this.names = names;
    this.from = from;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class TypeDefinition {
  kind: string = "TypeDefinition";
  imported: boolean = false;
  name: Name;
  description?: StringValue;
  interfaces?: Named[];
  fields: FieldDefinition[];
  annotations: Annotation[] = [];
  constructor(
    name: Name,
    fields: FieldDefinition[],
    interfaces?: Named[],
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.name = name;
    this.fields = fields;
    if (interfaces !== undefined && interfaces !== null)
      this.interfaces = interfaces;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class OperationDefinition {
  kind: string = "OperationDefinition";
  imported: boolean = false;
  name: Name;
  description?: StringValue;
  parameters: FieldDefinition[];
  type: TypeReference;
  unary: boolean;
  annotations: Annotation[] = [];
  constructor(
    name: Name,
    parameters: FieldDefinition[],
    type: TypeReference,
    unary: boolean,
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.name = name;
    this.parameters = parameters;
    this.type = type;
    this.unary = unary;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class FieldDefinition {
  kind: string = "FieldDefinition";
  imported: boolean = false;
  name: Name;
  description?: StringValue;
  type: TypeReference;
  default?: Value;
  annotations: Annotation[] = [];
  constructor(
    name: Name,
    type: TypeReference,
    _default?: Value,
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.name = name;
    this.type = type;
    if (_default !== undefined && _default !== null) this.default = _default;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class InterfaceDefinition {
  kind: string = "InterfaceDefinition";
  imported: boolean = false;
  description?: StringValue;
  operations: OperationDefinition[];
  annotations: Annotation[] = [];
  constructor(
    operations: OperationDefinition[],
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.operations = operations;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class RoleDefinition {
  kind: string = "RoleDefinition";
  imported: boolean = false;
  name: Name;
  description?: StringValue;
  operations: OperationDefinition[];
  annotations: Annotation[] = [];
  constructor(
    name: Name,
    operations: OperationDefinition[],
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.name = name;
    this.operations = operations;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class UnionDefinition {
  kind: string = "UnionDefinition";
  imported: boolean = false;
  name: Name;
  description?: StringValue;
  types: Named[];
  annotations: Annotation[] = [];
  constructor(
    name: Name,
    types: Named[],
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.name = name;
    this.types = types;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class EnumDefinition {
  kind: string = "EnumDefinition";
  imported: boolean = false;
  name: Name;
  description?: StringValue;
  values: EnumValueDefinition[];
  annotations: Annotation[] = [];
  constructor(
    name: Name,
    values: EnumValueDefinition[],
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.name = name;
    this.values = values;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class EnumValueDefinition {
  kind: string = "EnumValueDefinition";
  imported: boolean = false;
  name: Name;
  description?: StringValue;
  index: IntValue;
  display?: StringValue;
  annotations: Annotation[] = [];
  constructor(
    name: Name,
    index: IntValue,
    display?: StringValue,
    description?: StringValue,
    annotations: Annotation[] = []
  ) {
    this.name = name;
    this.index = index;
    if (display !== undefined && display !== null) this.display = display;
    if (description !== undefined && description !== null)
      this.description = description;
    this.annotations = annotations;
  }
}
export class DirectiveDefinition {
  kind: string = "DirectiveDefinition";
  imported: boolean = false;
  name: Name;
  description?: StringValue;
  parameters: FieldDefinition[];
  locations: Name[];
  requires: DirectiveRequire[];
  constructor(
    name: Name,
    parameters: FieldDefinition[],
    locations: Name[],
    requires: DirectiveRequire[],
    description?: StringValue
  ) {
    this.name = name;
    this.parameters = parameters;
    this.locations = locations;
    this.requires = requires;
    if (description !== undefined && description !== null)
      this.description = description;
  }
}
export class Name {
  kind: string = "Name";
  imported: boolean = false;
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}
export class Named {
  kind: string = "Named";
  imported: boolean = false;
  name: Name;
  constructor(name: Name) {
    this.name = name;
  }
}
export class ListType {
  kind: string = "ListType";
  imported: boolean = false;
  type: TypeReference;
  constructor(type: TypeReference) {
    this.type = type;
  }
}
export class MapType {
  kind: string = "MapType";
  imported: boolean = false;
  keyType: TypeReference;
  valueType: TypeReference;
  constructor(keyType: TypeReference, valueType: TypeReference) {
    this.keyType = keyType;
    this.valueType = valueType;
  }
}
export class Optional {
  kind: string = "Optional";
  imported: boolean = false;
  type: TypeReference;
  constructor(type: TypeReference) {
    this.type = type;
  }
}
export class IntValue {
  kind: string = "IntValue";
  imported: boolean = false;
  value: number;
  constructor(value: number) {
    this.value = value;
  }
}
export class FloatValue {
  kind: string = "FloatValue";
  imported: boolean = false;
  value: number;
  constructor(value: number) {
    this.value = value;
  }
}
export class StringValue {
  kind: string = "StringValue";
  imported: boolean = false;
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}
export class BooleanValue {
  kind: string = "BooleanValue";
  imported: boolean = false;
  value: boolean;
  constructor(value: boolean) {
    this.value = value;
  }
}
export class EnumValue {
  kind: string = "EnumValue";
  imported: boolean = false;
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}
export class ListValue {
  kind: string = "ListValue";
  imported: boolean = false;
  value: Value[];
  constructor(value: Value[]) {
    this.value = value;
  }
}
export class ObjectValue {
  kind: string = "ObjectValue";
  imported: boolean = false;
  fields: ObjectField[];
  constructor(fields: ObjectField[]) {
    this.fields = fields;
  }
}
export class ObjectField {
  kind: string = "ObjectField";
  imported: boolean = false;
  name: Name;
  value: Value;
  constructor(name: Name, value: Value) {
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
export type Value =
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
