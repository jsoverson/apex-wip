use pest_consume::{match_nodes, Parser};
use widl_ast as ast;

#[macro_use]
extern crate log;

#[derive(Parser)]
#[grammar = "./widl.pest"]
pub struct WidlParser;

use pest_consume::Error;
pub type Result<T> = std::result::Result<T, Error<Rule>>;
pub type Node<'i> = pest_consume::Node<'i, Rule, ()>;

#[pest_consume::parser]
impl WidlParser {
    fn document(input: Node) -> Result<ast::Document> {
        trace!("document: {:?}", input);
        match_nodes!(input.into_children();
          [definition(chunks)..]=> {
            Ok(ast::Document {
              definitions:chunks.collect()
            })
          },
        )
    }
    fn definition(input: Node) -> Result<ast::Definition> {
        Ok(match_nodes!(input.into_children();
          [namespaceDefinition(def)]=> def,
          [interfaceDefinition(def)]=> def,
          [typeDefinition(def)]=> def,
          [enumDefinition(def)]=> def,
        ))
    }
    fn namespaceDefinition(input: Node) -> Result<ast::Definition> {
        trace!("ns definition {:?}", input);
        Ok(ast::Definition::NamespaceDefinition {
            annotations: None,
            description: None,
            name: match_nodes!(input.into_children();
                [string(fds)] => fds,
            ),
        })
    }
    fn enumDefinition(input: Node) -> Result<ast::Definition> {
        trace!("interface definition {:?}", input);
        match_nodes!(input.clone().into_children();
            [identifier(name),enumValue(v)..] => {
                Ok(ast::Definition::EnumDefinition {
                  name:name,
                  values:v.collect(),
                  annotations: None,
                  description: None,
                })
            },
        )
    }
    fn interfaceDefinition(input: Node) -> Result<ast::Definition> {
        trace!("interface definition {:?}", input);
        Ok(ast::Definition::InterfaceDefinition {
            operations: match_nodes!(input.into_children();
              [operationDefinition(chunks)..]=> {
                chunks.collect()
              }
            ),
            annotations: None,
            description: None,
        })
    }
    fn typeDefinition(input: Node) -> Result<ast::Definition> {
        trace!("type definition {:?}", input);
        Ok(match_nodes!(input.into_children();
          [identifier(name),typeFieldDefinition(chunks)..]=> {
            ast::Definition::TypeDefinition {
              name:name,
              annotations:None,
              description: None,
              interfaces: None,
              fields:chunks.collect()
            }
          }
        ))
    }
    fn identifier(input: Node) -> Result<ast::Name> {
        Ok(ast::Name {
            value: input.as_str().to_string(),
        })
    }
    fn string(input: Node) -> Result<ast::StringValue> {
        trace!("string {:#?}", input);
        Ok(ast::StringValue {
            value: input.as_str().to_string(),
        })
    }
    fn operationDefinition(input: Node) -> Result<ast::OperationDefinition> {
        trace!("operation {:#?}", input);
        Ok(match_nodes!(input.clone().into_children();
            [identifier(name),parameterDefinition(params)..,typeReference(t)] => {
                ast::OperationDefinition {
                    annotations: None,
                    description: None,
                    name: name,
                    parameters: params.collect(),
                    unary: false,
                    r#type: t,
                }
            },
        ))
    }
    fn parameterDefinition(input: Node) -> Result<ast::ParameterDefinition> {
        trace!("parameter {:#?}", input);
        Ok(match_nodes!(input.clone().into_children();
            [identifier(name),typeReference(t)] => {
                ast::ParameterDefinition {
                    annotations: None,
                    description: None,
                    default: None,
                    name: name,
                    r#type: t,
                }
            },
        ))
    }
    fn typeFieldDefinition(input: Node) -> Result<ast::FieldDefinition> {
        trace!("parameter {:#?}", input);
        Ok(match_nodes!(input.clone().into_children();
            [identifier(name),typeReference(t)] => {
                ast::FieldDefinition {
                    annotations: None,
                    description: None,
                    default: None,
                    name: name,
                    r#type: t,
                }
            },
        ))
    }
    fn enumValue(input: Node) -> Result<ast::EnumValueDefinition> {
        trace!("parameter {:#?}", input);
        Ok(match_nodes!(input.clone().into_children();
            [identifier(name),integer(i)] => {
                ast::EnumValueDefinition {
                    annotations: None,
                    description: None,
                    name: name,
                    display: None,
                    index: i
                }
            },
            [identifier(name),integer(i),string(val)] => {
                ast::EnumValueDefinition {
                    annotations: None,
                    description: None,
                    name: name,
                    display: Some(val),
                    index: i
                }
            },
        ))
    }
    fn integer(input: Node) -> Result<ast::IntValue> {
        trace!("parameter {:#?}", input);
        Ok(ast::IntValue {
            value: input
                .as_str()
                .parse::<u64>()
                .map_err(|e| input.error(format!("{}", e)))?,
        })
    }
    fn typeReference(input: Node) -> Result<ast::TypeReference> {
        trace!("typeref {:#?}", input);
        Ok(match_nodes!(input.clone().into_children();
            [namedType(t)] => t.into(),
            [namedType(t),optionalOperator(o)] => ast::Optional{r#type:t.into()}.into(),
            [primitiveType(t)] => t.into(),
            [primitiveType(t),optionalOperator(o)] => ast::Optional{r#type:t.into()}.into(),
            [mapType(t)] => t.into(),
            [mapType(t),optionalOperator(o)] => ast::Optional{r#type:t.into()}.into(),
            [listType(t)] => t.into(),
            [listType(t),optionalOperator(o)] => ast::Optional{r#type:t.into()}.into(),
        ))
    }
    fn namedType(input: Node) -> Result<ast::Named> {
        Ok(ast::Named {
            name: match_nodes!(input.into_children();
                [identifier(id)] => id,
            ),
        })
    }
    fn mapType(input: Node) -> Result<ast::MapType> {
        trace!("maptype {:#?}", input);
        match_nodes!(input.clone().into_children();
            [typeReference(k),typeReference(v)] => {
                Ok(ast::MapType {
                  keytype: k.into(),
                  valuetype: v.into()
                })
            },
        )
    }
    fn listType(input: Node) -> Result<ast::ListType> {
        trace!("maptype {:#?}", input);
        match_nodes!(input.clone().into_children();
            [typeReference(t)] => {
                Ok(ast::ListType {
                  r#type: t.into(),
                })
            },
        )
    }
    fn optionalOperator(input: Node) -> Result<bool> {
        Ok(true)
    }
    fn primitiveType(input: Node) -> Result<ast::PrimitiveType> {
        trace!("{:#?}", input);

        Ok(input.as_str().into())
    }
}

pub fn parse_widl_src(src: &str) -> Result<ast::Document> {
    let inputs = WidlParser::parse(Rule::document, src)?;
    let input = inputs.single()?;
    WidlParser::document(input)
}

#[cfg(test)]
mod tests {
    use assert_json_diff::assert_json_include;
    use ast::PrimitiveType;

    use super::*;

    #[test_env_log::test]
    fn parse_namespaces() {
        let doc = parse_widl_src(include_str!("examples/namespaces.widl"))
            .unwrap_or_else(|e| panic!("{}", e));
        println!("{:#?}", doc);
        assert_eq!(
            doc,
            ast::Document {
                definitions: vec![ast::Definition::NamespaceDefinition {
                    name: ast::StringValue {
                        value: "example:widl".to_string()
                    },
                    annotations: None,
                    description: None
                }]
            }
        );
    }

    #[test_env_log::test]
    fn parse_interfaces() {
        let doc = parse_widl_src(include_str!("examples/interfaces.widl"))
            .unwrap_or_else(|e| panic!("{}", e));
        println!("{:#?}", doc);

        assert_eq!(
            doc,
            ast::Document {
                definitions: vec![ast::Definition::InterfaceDefinition {
                    operations: vec![ast::OperationDefinition {
                        name: ast::Name {
                            value: "sayHello".to_string()
                        },
                        annotations: None,
                        description: None,
                        parameters: vec![ast::ParameterDefinition {
                            name: ast::Name {
                                value: "message".to_string(),
                            },
                            description: None,
                            annotations: None,
                            default: None,
                            r#type: ast::TypeReference::PrimitiveType(Box::new(
                                PrimitiveType::string
                            ))
                        }],
                        unary: false,
                        r#type: ast::TypeReference::PrimitiveType(Box::new(PrimitiveType::string))
                    }],
                    annotations: None,
                    description: None
                }]
            }
        );
    }

    #[test_env_log::test]
    fn parse_types() {
        let doc = parse_widl_src(include_str!("examples/alltypes.widl"))
            .unwrap_or_else(|e| panic!("{}", e));
        println!("{:#?}", doc);
        fn make_primitive_field(name: &str, t: &str) -> ast::FieldDefinition {
            ast::FieldDefinition {
                annotations: None,
                description: None,
                default: None,
                name: ast::Name {
                    value: name.to_string(),
                },
                r#type: ast::TypeReference::PrimitiveType(Box::new(t.into())),
            }
        }
        fn make_field(name: &str, t: ast::TypeReference) -> ast::FieldDefinition {
            ast::FieldDefinition {
                annotations: None,
                description: None,
                default: None,
                name: ast::Name {
                    value: name.to_string(),
                },
                r#type: t,
            }
        }
        assert_json_include!(
            actual:doc,
            expected:ast::Document {
                definitions: vec![ast::Definition::TypeDefinition {
                    fields: vec![
                        make_primitive_field("i8", "i8"),
                        make_primitive_field("u8", "u8"),
                        make_primitive_field("i16", "i16"),
                        make_primitive_field("u16", "u16"),
                        make_primitive_field("i32", "i32"),
                        make_primitive_field("u32", "u32"),
                        make_primitive_field("i64", "i64"),
                        make_primitive_field("u64", "u64"),
                        make_primitive_field("f32", "f32"),
                        make_primitive_field("f64", "f64"),
                        make_primitive_field("bool", "bool"),
                        make_primitive_field("string", "string"),
                        make_primitive_field("datetime", "datetime"),
                        make_primitive_field("bytes", "bytes"),
                        make_primitive_field("raw", "raw"),
                        make_primitive_field("value", "value"),
                        make_field(
                            "optional",
                            ast::Optional {
                                r#type: ast::PrimitiveType::bool.into()
                            }
                            .into()
                        ),
                        make_field(
                            "map",
                            ast::MapType {
                                keytype: ast::PrimitiveType::from("string").into(),
                                valuetype: ast::PrimitiveType::from("string").into(),
                            }
                            .into()
                        ),
                        make_field(
                            "array",
                            ast::ListType {
                                r#type: ast::PrimitiveType::string.into()
                            }
                            .into()
                        ),
                        make_field(
                            "richtype",
                            ast::Named {
                                name: ast::Name {
                                    value: "OtherType".to_string()
                                }
                            }
                            .into()
                        ),
                    ],
                    interfaces: None,
                    name: ast::Name {
                        value: "AllTypes".to_string()
                    },
                    annotations: None,
                    description: None
                }]
            }
        );
    }

    #[test_env_log::test]
    fn parse_enums() {
        let doc =
            parse_widl_src(include_str!("examples/enums.widl")).unwrap_or_else(|e| panic!("{}", e));
        println!("{:#?}", doc);

        let expected = ast::Document {
            definitions: vec![
                ast::Definition::EnumDefinition {
                    values: vec![
                        ast::EnumValueDefinition {
                            annotations: None,
                            description: None,
                            display: Some(ast::StringValue {
                                value: "bar".to_string(),
                            }),
                            index: ast::IntValue { value: 1 },
                            name: ast::Name {
                                value: "FOO".to_string(),
                            },
                        },
                        ast::EnumValueDefinition {
                            annotations: None,
                            description: None,
                            display: None,
                            index: ast::IntValue { value: 2 },
                            name: ast::Name {
                                value: "BAR".to_string(),
                            },
                        },
                    ],
                    name: ast::Name {
                        value: "One".to_string(),
                    },
                    annotations: None,
                    description: None,
                },
                ast::Definition::EnumDefinition {
                    values: vec![
                        ast::EnumValueDefinition {
                            annotations: None,
                            description: None,
                            display: Some(ast::StringValue {
                                value: "First".to_string(),
                            }),
                            index: ast::IntValue { value: 0 },
                            name: ast::Name {
                                value: "first".to_string(),
                            },
                        },
                        ast::EnumValueDefinition {
                            annotations: None,
                            description: None,
                            display: Some(ast::StringValue {
                                value: "Second".to_string(),
                            }),
                            index: ast::IntValue { value: 1 },
                            name: ast::Name {
                                value: "second".to_string(),
                            },
                        },
                        ast::EnumValueDefinition {
                            annotations: None,
                            description: None,
                            display: Some(ast::StringValue {
                                value: "Third".to_string(),
                            }),
                            index: ast::IntValue { value: 2 },
                            name: ast::Name {
                                value: "third".to_string(),
                            },
                        },
                    ],
                    name: ast::Name {
                        value: "Two".to_string(),
                    },
                    annotations: None,
                    description: None,
                },
            ],
        };
        assert_json_include!(actual: doc, expected: expected);
    }
}
