
export const ALL_TYPES = ["i8","u8","i16","u16","i32","u32","i64","u64","f32","f64","bool","string","datetime","bytes","raw","value"];
export const ALL_NODES = ["Node","Value","Document","Annotation","Argument","DirectiveRequire","ImportName","NamespaceDefinition","AliasDefinition","ImportDefinition","TypeDefinition","OperationDefinition","ValueDefinition","FieldDefinition","ParameterDefinition","InterfaceDefinition","RoleDefinition","UnionDefinition","EnumDefinition","EnumValueDefinition","DirectiveDefinition","Name","Named","ListType","MapType","Optional","IntValue","FloatValue","StringValue","BooleanValue","EnumValue","ListValue","ObjectValue","ObjectField"];

type PrimitiveType = "i8"|"u8"|"i16"|"u16"|"i32"|"u32"|"i64"|"u64"|"f32"|"f64"|"bool"|"string"|"datetime"|"bytes"|"raw"|"value";
type ComplexType = "Named"|"ListType"|"MapType"|"Optional";
type Definition = (NamespaceDefinition|TypeDefinition|AliasDefinition|ImportDefinition|InterfaceDefinition|RoleDefinition|EnumDefinition|DirectiveDefinition);
type Type = (PrimitiveType|ComplexType);


export abstract class Node  {
  kind: string;
  constructor(kind: string) {
    
    this.kind = "Node";
    this.kind = kind;
  }
}
  

export  class Value  extends Node {
  value: PrimitiveType;
  constructor(value: PrimitiveType) {
    super("Value");
    this.kind = "Value";
    this.value = value;
  }
}
  

export  class Document  extends Node {
  definitions: Definition[];
  constructor(definitions: Definition[]) {
    super("Document");
    this.kind = "Document";
    this.definitions = definitions;
  }
}
  

export  class Annotation  extends Node {
  name: Name;
arguments: Argument[];
  constructor(name: Name,_arguments: Argument[]) {
    super("Annotation");
    this.kind = "Annotation";
    this.name = name;
this.arguments = _arguments;
  }
}
  

export  class Argument  extends Node {
  name: Name;
value: Value;
  constructor(name: Name,value: Value) {
    super("Argument");
    this.kind = "Argument";
    this.name = name;
this.value = value;
  }
}
  

export  class DirectiveRequire  extends Node {
  directive: Name;
locations: Location[];
  constructor(directive: Name,locations: Location[]) {
    super("DirectiveRequire");
    this.kind = "DirectiveRequire";
    this.directive = directive;
this.locations = locations;
  }
}
  

export  class ImportName  extends Node {
  name: Name;
alias?: Name;
  constructor(name: Name,alias?: Name) {
    super("ImportName");
    this.kind = "ImportName";
    this.name = name;
this.alias = alias;
  }
}
  

export  class NamespaceDefinition  extends Node {
  name: Name;
description?: StringValue;
annotations?: Annotation[];
  constructor(name: Name,description?: StringValue,annotations?: Annotation[]) {
    super("NamespaceDefinition");
    this.kind = "NamespaceDefinition";
    this.name = name;
this.description = description;
this.annotations = annotations;
  }
}
  

export  class AliasDefinition  extends Node {
  name: Name;
description?: StringValue;
type: Type;
annotations?: Annotation[];
  constructor(name: Name,type: Type,description?: StringValue,annotations?: Annotation[]) {
    super("AliasDefinition");
    this.kind = "AliasDefinition";
    this.name = name;
this.description = description;
this.type = type;
this.annotations = annotations;
  }
}
  

export  class ImportDefinition  extends Node {
  description?: StringValue;
all: boolean;
names: ImportName[];
from: StringValue;
annotations?: Annotation[];
  constructor(all: boolean,names: ImportName[],from: StringValue,description?: StringValue,annotations?: Annotation[]) {
    super("ImportDefinition");
    this.kind = "ImportDefinition";
    this.description = description;
this.all = all;
this.names = names;
this.from = from;
this.annotations = annotations;
  }
}
  

export  class TypeDefinition  extends Node {
  name: Name;
description?: StringValue;
interfaces?: Named[];
fields: FieldDefinition[];
annotations?: Annotation[];
  constructor(name: Name,fields: FieldDefinition[],interfaces?: Named[],description?: StringValue,annotations?: Annotation[]) {
    super("TypeDefinition");
    this.kind = "TypeDefinition";
    this.name = name;
this.description = description;
this.interfaces = interfaces;
this.fields = fields;
this.annotations = annotations;
  }
}
  

export  class OperationDefinition  extends Node {
  name: Name;
description?: StringValue;
parameters: ParameterDefinition[];
type: Type;
unary: boolean;
annotations?: Annotation[];
  constructor(name: Name,parameters: ParameterDefinition[],type: Type,unary: boolean,description?: StringValue,annotations?: Annotation[]) {
    super("OperationDefinition");
    this.kind = "OperationDefinition";
    this.name = name;
this.description = description;
this.parameters = parameters;
this.type = type;
this.unary = unary;
this.annotations = annotations;
  }
}
  

export  class ValueDefinition  extends Node {
  name: Name;
description?: StringValue;
type: Type;
default?: Value;
annotations?: Annotation[];
  constructor(name: Name,type: Type,_default?: Value,description?: StringValue,annotations?: Annotation[]) {
    super("ValueDefinition");
    this.kind = "ValueDefinition";
    this.name = name;
this.description = description;
this.type = type;
this.default = _default;
this.annotations = annotations;
  }
}
  

export  class FieldDefinition  extends ValueDefinition {
  
  constructor(name: Name,type: Type,_default?: Value,description?: StringValue,annotations?: Annotation[]) {
    super(name,type,_default,description,annotations);
    this.kind = "FieldDefinition";
    
  }
}
  

export  class ParameterDefinition  extends ValueDefinition {
  
  constructor(name: Name,type: Type,_default?: Value,description?: StringValue,annotations?: Annotation[]) {
    super(name,type,_default,description,annotations);
    this.kind = "ParameterDefinition";
    
  }
}
  

export  class InterfaceDefinition  extends Node {
  description?: StringValue;
operations: OperationDefinition[];
annotations?: Annotation[];
  constructor(operations: OperationDefinition[],description?: StringValue,annotations?: Annotation[]) {
    super("InterfaceDefinition");
    this.kind = "InterfaceDefinition";
    this.description = description;
this.operations = operations;
this.annotations = annotations;
  }
}
  

export  class RoleDefinition  extends Node {
  name: Name;
description?: StringValue;
operations: OperationDefinition[];
annotations?: Annotation[];
  constructor(name: Name,operations: OperationDefinition[],description?: StringValue,annotations?: Annotation[]) {
    super("RoleDefinition");
    this.kind = "RoleDefinition";
    this.name = name;
this.description = description;
this.operations = operations;
this.annotations = annotations;
  }
}
  

export  class UnionDefinition  extends Node {
  name: Name;
description?: StringValue;
types: Named[];
annotations?: Annotation[];
  constructor(name: Name,types: Named[],description?: StringValue,annotations?: Annotation[]) {
    super("UnionDefinition");
    this.kind = "UnionDefinition";
    this.name = name;
this.description = description;
this.types = types;
this.annotations = annotations;
  }
}
  

export  class EnumDefinition  extends Node {
  name: Name;
description?: StringValue;
values: EnumValueDefinition[];
annotations?: Annotation[];
  constructor(name: Name,values: EnumValueDefinition[],description?: StringValue,annotations?: Annotation[]) {
    super("EnumDefinition");
    this.kind = "EnumDefinition";
    this.name = name;
this.description = description;
this.values = values;
this.annotations = annotations;
  }
}
  

export  class EnumValueDefinition  extends Node {
  name: Name;
description?: StringValue;
index: IntValue;
display?: StringValue;
annotations?: Annotation[];
  constructor(name: Name,index: IntValue,display?: StringValue,description?: StringValue,annotations?: Annotation[]) {
    super("EnumValueDefinition");
    this.kind = "EnumValueDefinition";
    this.name = name;
this.description = description;
this.index = index;
this.display = display;
this.annotations = annotations;
  }
}
  

export  class DirectiveDefinition  extends Node {
  name: Name;
description?: StringValue;
parameters: ParameterDefinition[];
locations: Name[];
requires: DirectiveRequire[];
  constructor(name: Name,parameters: ParameterDefinition[],locations: Name[],requires: DirectiveRequire[],description?: StringValue) {
    super("DirectiveDefinition");
    this.kind = "DirectiveDefinition";
    this.name = name;
this.description = description;
this.parameters = parameters;
this.locations = locations;
this.requires = requires;
  }
}
  

export  class Name  extends Node {
  value: string;
  constructor(value: string) {
    super("Name");
    this.kind = "Name";
    this.value = value;
  }
}
  

export  class Named  extends Node {
  name: Name;
  constructor(name: Name) {
    super("Named");
    this.kind = "Named";
    this.name = name;
  }
}
  

export  class ListType  extends Node {
  type: Type;
  constructor(type: Type) {
    super("ListType");
    this.kind = "ListType";
    this.type = type;
  }
}
  

export  class MapType  extends Node {
  keyType: Type;
valueType: Type;
  constructor(keyType: Type,valueType: Type) {
    super("MapType");
    this.kind = "MapType";
    this.keyType = keyType;
this.valueType = valueType;
  }
}
  

export  class Optional  extends Node {
  type: Type;
  constructor(type: Type) {
    super("Optional");
    this.kind = "Optional";
    this.type = type;
  }
}
  

export  class IntValue  extends Node {
  value: number;
  constructor(value: number) {
    super("IntValue");
    this.kind = "IntValue";
    this.value = value;
  }
}
  

export  class FloatValue  extends Node {
  value: number;
  constructor(value: number) {
    super("FloatValue");
    this.kind = "FloatValue";
    this.value = value;
  }
}
  

export  class StringValue  extends Node {
  value: string;
  constructor(value: string) {
    super("StringValue");
    this.kind = "StringValue";
    this.value = value;
  }
}
  

export  class BooleanValue  extends Node {
  value: boolean;
  constructor(value: boolean) {
    super("BooleanValue");
    this.kind = "BooleanValue";
    this.value = value;
  }
}
  

export  class EnumValue  extends Node {
  value: string;
  constructor(value: string) {
    super("EnumValue");
    this.kind = "EnumValue";
    this.value = value;
  }
}
  

export  class ListValue  extends Node {
  value: Value[];
  constructor(value: Value[]) {
    super("ListValue");
    this.kind = "ListValue";
    this.value = value;
  }
}
  

export  class ObjectValue  extends Node {
  fields: ObjectField[];
  constructor(fields: ObjectField[]) {
    super("ObjectValue");
    this.kind = "ObjectValue";
    this.fields = fields;
  }
}
  

export  class ObjectField  extends Node {
  name: Name;
value: Value;
  constructor(name: Name,value: Value) {
    super("ObjectField");
    this.kind = "ObjectField";
    this.name = name;
this.value = value;
  }
}
  

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

