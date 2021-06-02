use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "value")]

pub enum PrimitiveType {
    #[allow(non_camel_case_types)]
    i8,
    #[allow(non_camel_case_types)]
    u8,
    #[allow(non_camel_case_types)]
    i16,
    #[allow(non_camel_case_types)]
    u16,
    #[allow(non_camel_case_types)]
    i32,
    #[allow(non_camel_case_types)]
    u32,
    #[allow(non_camel_case_types)]
    i64,
    #[allow(non_camel_case_types)]
    u64,
    #[allow(non_camel_case_types)]
    f32,
    #[allow(non_camel_case_types)]
    f64,
    #[allow(non_camel_case_types)]
    bool,
    #[allow(non_camel_case_types)]
    string,
    #[allow(non_camel_case_types)]
    datetime,
    #[allow(non_camel_case_types)]
    bytes,
    #[allow(non_camel_case_types)]
    raw,
    #[allow(non_camel_case_types)]
    value,
}

impl From<&str> for PrimitiveType {
    fn from(s: &str) -> Self {
        match s {
            "i8" => PrimitiveType::i8,
            "u8" => PrimitiveType::u8,
            "i16" => PrimitiveType::i16,
            "u16" => PrimitiveType::u16,
            "i32" => PrimitiveType::i32,
            "u32" => PrimitiveType::u32,
            "i64" => PrimitiveType::i64,
            "u64" => PrimitiveType::u64,
            "f32" => PrimitiveType::f32,
            "f64" => PrimitiveType::f64,
            "bool" => PrimitiveType::bool,
            "string" => PrimitiveType::string,
            "datetime" => PrimitiveType::datetime,
            "bytes" => PrimitiveType::bytes,
            "raw" => PrimitiveType::raw,
            "value" => PrimitiveType::value,
            _ => unreachable!(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub enum TypeReference {
    PrimitiveType(Box<PrimitiveType>),
    Named(Box<Named>),
    ListType(Box<ListType>),
    MapType(Box<MapType>),
    Optional(Box<Optional>),
}

impl From<PrimitiveType> for TypeReference {
    fn from(t: PrimitiveType) -> Self {
        TypeReference::PrimitiveType(Box::new(t))
    }
}

impl From<Named> for TypeReference {
    fn from(t: Named) -> Self {
        TypeReference::Named(Box::new(t))
    }
}

impl From<ListType> for TypeReference {
    fn from(t: ListType) -> Self {
        TypeReference::ListType(Box::new(t))
    }
}

impl From<MapType> for TypeReference {
    fn from(t: MapType) -> Self {
        TypeReference::MapType(Box::new(t))
    }
}

impl From<Optional> for TypeReference {
    fn from(t: Optional) -> Self {
        TypeReference::Optional(Box::new(t))
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]
pub enum Definition {
    NamespaceDefinition {
        name: StringValue,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        description: Option<StringValue>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        annotations: Option<Vec<Annotation>>,
    },
    TypeDefinition {
        name: Name,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        description: Option<StringValue>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        interfaces: Option<Vec<Named>>,
        fields: Vec<FieldDefinition>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        annotations: Option<Vec<Annotation>>,
    },
    AliasDefinition {
        name: Name,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        description: Option<StringValue>,
        r#type: TypeReference,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        annotations: Option<Vec<Annotation>>,
    },
    ImportDefinition {
        #[serde(default, skip_serializing_if = "Option::is_none")]
        description: Option<StringValue>,
        all: bool,
        names: Vec<ImportName>,
        from: StringValue,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        annotations: Option<Vec<Annotation>>,
    },
    InterfaceDefinition {
        #[serde(default, skip_serializing_if = "Option::is_none")]
        description: Option<StringValue>,
        operations: Vec<OperationDefinition>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        annotations: Option<Vec<Annotation>>,
    },
    RoleDefinition {
        name: Name,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        description: Option<StringValue>,
        operations: Vec<OperationDefinition>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        annotations: Option<Vec<Annotation>>,
    },
    EnumDefinition {
        name: Name,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        description: Option<StringValue>,
        values: Vec<EnumValueDefinition>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        annotations: Option<Vec<Annotation>>,
    },
    DirectiveDefinition {
        name: Name,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        description: Option<StringValue>,
        parameters: Vec<ParameterDefinition>,
        locations: Vec<Name>,
        requires: Vec<DirectiveRequire>,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]
pub enum AstNode {
    Node(Node),
    Value(Value),
    Document(Document),
    Annotation(Annotation),
    Argument(Argument),
    DirectiveRequire(DirectiveRequire),
    ImportName(ImportName),
    NamespaceDefinition(NamespaceDefinition),
    AliasDefinition(AliasDefinition),
    ImportDefinition(ImportDefinition),
    TypeDefinition(TypeDefinition),
    OperationDefinition(OperationDefinition),
    FieldDefinition(FieldDefinition),
    ParameterDefinition(ParameterDefinition),
    InterfaceDefinition(InterfaceDefinition),
    RoleDefinition(RoleDefinition),
    UnionDefinition(UnionDefinition),
    EnumDefinition(EnumDefinition),
    EnumValueDefinition(EnumValueDefinition),
    DirectiveDefinition(DirectiveDefinition),
    Name(Name),
    Named(Named),
    ListType(ListType),
    MapType(MapType),
    Optional(Optional),
    IntValue(IntValue),
    FloatValue(FloatValue),
    StringValue(StringValue),
    BooleanValue(BooleanValue),
    EnumValue(EnumValue),
    ListValue(ListValue),
    ObjectValue(ObjectValue),
    ObjectField(ObjectField),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]
pub enum LiteralValue {
    Node(Node),
    Value(Value),
    Document(Document),
    Annotation(Annotation),
    Argument(Argument),
    DirectiveRequire(DirectiveRequire),
    ImportName(ImportName),
    NamespaceDefinition(NamespaceDefinition),
    AliasDefinition(AliasDefinition),
    ImportDefinition(ImportDefinition),
    TypeDefinition(TypeDefinition),
    OperationDefinition(OperationDefinition),
    FieldDefinition(FieldDefinition),
    ParameterDefinition(ParameterDefinition),
    InterfaceDefinition(InterfaceDefinition),
    RoleDefinition(RoleDefinition),
    UnionDefinition(UnionDefinition),
    EnumDefinition(EnumDefinition),
    EnumValueDefinition(EnumValueDefinition),
    DirectiveDefinition(DirectiveDefinition),
    Name(Name),
    Named(Named),
    ListType(ListType),
    MapType(MapType),
    Optional(Optional),
    IntValue(IntValue),
    FloatValue(FloatValue),
    StringValue(StringValue),
    BooleanValue(BooleanValue),
    EnumValue(EnumValue),
    ListValue(ListValue),
    ObjectValue(ObjectValue),
    ObjectField(ObjectField),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Node {
    pub kind: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Value {
    pub value: PrimitiveType,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Document {
    pub definitions: Vec<Definition>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Annotation {
    pub name: Name,
    pub arguments: Vec<Argument>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Argument {
    pub name: Name,
    pub value: Value,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct DirectiveRequire {
    pub directive: Name,
    pub locations: Vec<Location>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct ImportName {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alias: Option<Name>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct NamespaceDefinition {
    pub name: StringValue,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct AliasDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub r#type: TypeReference,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct ImportDefinition {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub all: bool,
    pub names: Vec<ImportName>,
    pub from: StringValue,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct TypeDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub interfaces: Option<Vec<Named>>,
    pub fields: Vec<FieldDefinition>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct OperationDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub parameters: Vec<ParameterDefinition>,
    pub r#type: TypeReference,
    pub unary: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct FieldDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub r#type: TypeReference,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default: Option<Value>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct ParameterDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub r#type: TypeReference,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default: Option<Value>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct InterfaceDefinition {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub operations: Vec<OperationDefinition>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct RoleDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub operations: Vec<OperationDefinition>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct UnionDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub types: Vec<Named>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct EnumDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub values: Vec<EnumValueDefinition>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct EnumValueDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub index: IntValue,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display: Option<StringValue>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub annotations: Option<Vec<Annotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct DirectiveDefinition {
    pub name: Name,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<StringValue>,
    pub parameters: Vec<ParameterDefinition>,
    pub locations: Vec<Name>,
    pub requires: Vec<DirectiveRequire>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Name {
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Named {
    pub name: Name,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct ListType {
    pub r#type: TypeReference,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct MapType {
    pub keytype: TypeReference,
    pub valuetype: TypeReference,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Optional {
    pub r#type: TypeReference,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct IntValue {
    pub value: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct FloatValue {
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct StringValue {
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct BooleanValue {
    pub value: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct EnumValue {
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct ListValue {
    pub value: Vec<Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct ObjectValue {
    pub fields: Vec<ObjectField>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct ObjectField {
    pub name: Name,
    pub value: Value,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Location {
    pub start: i32,
    pub end: i32,
    pub source: Source,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, PartialOrd)]
#[serde(tag = "kind")]

pub struct Source {
    pub body: String,
    pub name: String,
}
