{
/* eslint-disable no-control-regex */
const {ast} = require('apex-ast');

function list(head, tail) {
  if (tail) head.push(tail)
  return head;
}
const reservedWords = [
  "interface",
  "role",
  "namespace",
  "type",
  "enum",
  "import",
  "union",
  "alias",
  "as",
  "from",
  "true",
  "false",
  "directive",
  "on",
]
}

APEX = values:(ws @definition ws)* { return new ast.ApexDocument(values); }

ws = ([ \t\n\r] / comment)*
hws = ([ \t] / comment)*
eol = hws [\n\r]+

comment = commentOperator (!eol .)*

definition
  =
  @(
    namespaceDefinition /
    typeDefinition /
    interfaceDefinition /
    roleDefinition /
    directiveDefinition /
    unionDefinition /
    aliasDefinition /
    enumDefinition /
    importDefinition
  )

description = @literalString ws

namespaceDefinition =
  description:description?
  namespaceKeyword ws name:literalString
  annotations:annotation*
{
  return new ast.NamespaceDefinition(name, description, annotations );
}

importDefinition =
  description:description?
  importKeyword ws
  imports:(splatOperator / importGroup) ws
  fromKeyword ws from:literalString
  annotations:annotation*
{
  const all = imports === '*';
  const names = all ? [] : imports;
  return new ast.ImportDefinition(all, names, from, description, annotations);
}

importGroup = beginGroup args:importNames? endGroup
{ return args || [] }

importNames = values:(@importName commaSeparator)* last:importName?
{ return list(values, last) }

importName = name:identifier ws alias:(asKeyword ws @identifier)?
{ return new ast.ImportName(name, alias || undefined); }

directiveDefinition =
  description:description?
  directiveKeyword ws annotationPrefix name:identifier ws
  parameters:(beginArgumentList @fields endArgumentList ws)?
  locations:(onKeyword ws @locations)?
{
  return new ast.DirectiveDefinition(name, parameters || [], locations, /* requires? */[], description);
}

typeDefinition =
  description:description?
  typeKeyword ws name:identifier
  annotations:annotation*
  fields:fieldGroup
{
  return new ast.TypeDefinition(name, fields, /*interfaces?*/[], description, annotations);
}

unionDefinition =
  description:description?
  unionKeyword ws name:identifier ws
  annotations:annotation*
  equals
  types:typeUnion
{
  return new ast.UnionDefinition(name, types, description, annotations)
}

aliasDefinition =
  description:description?
  aliasKeyword ws name:identifier equals type:apexType
  annotations:annotation*
{
  return new ast.AliasDefinition(name, type, description, annotations)
}

enumDefinition =
  description:description?
  enumKeyword ws name:identifier
  annotations:annotation*
  beginGroup values:enumValues? endGroup
{
  return new ast.EnumDefinition(name, values || [], description, annotations);
}

enumValues = values:(@enumValue commaSeparator)* last:enumValue?
{ return list(values, last) }

enumValue =
  description:description?
  name:identifier equals index:literalInteger display:(ws asKeyword ws @literalString)?
  annotations:annotation*
{
  return new ast.EnumValueDefinition(name, index, display, description, annotations);
}

interfaceDefinition =
  description:description?
  interfaceKeyword ws
  annotations:annotation*
  beginGroup operations:operations? endGroup
{
  return new ast.InterfaceDefinition(operations || [], description, annotations);
}

roleDefinition =
  description:description?
  roleKeyword ws name:identifier
  annotations:annotation*
  beginGroup operations:operations? endGroup
{
  return new ast.RoleDefinition(name, operations || [], description, annotations);
}

operations = values:(@operation commaSeparator)* last:operation?
{ return list(values, last) }

operation =
  description:description?
  name:identifier args:(parameterGroup / unaryParameter) colonSeparator type:apexType
  annotations:annotation*
{
  return new ast.OperationDefinition(name, args.args, type, args.unary, description, annotations);
}

fieldDefinition =
  description:description?
  pair:nameTypePair defaultValue:(equals @literalValue)?
  annotations:annotation*
{
  return new ast.FieldDefinition(pair.name, pair.type, defaultValue || undefined, description, annotations);
}

parameterGroup = beginArgumentList args:fields? endArgumentList {
  return {unary: false, args: args || []}
}

unaryParameter = beginGroup arg:fieldDefinition endGroup {
  return {unary: true, args: [arg]}
}

fieldGroup = beginGroup list:fields? endGroup
{ return list || [] }

fields = values:(@fieldDefinition commaSeparator)* last:fieldDefinition?
{ return list(values, last) }

locations = values:(@locationKind pipeSeparator)* last:locationKind?
{ return list(values, last) }

annotation =
  ws annotationPrefix name:identifier
  args:(beginArgumentList @annotationArguments endArgumentList)?
{ return new ast.Annotation(name, args || []) }

annotationArguments = values:(@annotationArgument commaSeparator)* last:annotationArgument?
{ return list(values, last) }

annotationArgument = @(namedAnnotationArgument / unnamedAnnotationArgument)

unnamedAnnotationArgument = value:literalValue
{ return new ast.Argument(new ast.Name('value'), value) }

namedAnnotationArgument = name:identifier colonSeparator value:literalValue
{ return new ast.Argument(name, value) }

typeUnion = values:(@apexType pipeSeparator)* last:apexType?
{ return list(values, last) }

apexType =
  type:(mapType / listType / namedType)
  optional:optionalOperator?
{
  return !!optional ? new ast.Optional(type) : type;
}

literalValue = @(literalString / literalBoolean / literalFloat / literalInteger / literalObject / literalArray / literalEnumValue)

literalString = quotation_mark chars:char* quotation_mark
{ return new ast.StringValue(chars.join("")) }

literalBoolean = value:(trueKeyword / falseKeyword)
{ return new ast.BooleanValue(value === "true") }

literalInteger = val:DIGIT+
{ return new ast.IntValue(parseInt(val.join(""),10)) }

literalFloat = whole:DIGIT* "." frac:DIGIT+
{ return new ast.FloatValue(parseFloat(`${whole.join("")}.${frac.join("")}`,10)) }

literalObject = beginGroup entries:literalObjectEntry* endGroup
{ return new ast.ObjectValue(entries) }

literalObjectEntry = name:(identifier / literalString) colonSeparator value:literalValue commaSeparator?
{
  if (name.kind === 'StringValue') name = new ast.Name(name.value);
  return new ast.ObjectField(name, value);
}

literalArray = beginList values:(@literalValue commaSeparator?)* endList
{ return new ast.ListValue(values) }

literalEnumValue = name:identifier
{ return new ast.EnumValue(name.value) }

locationKind =
  loc:("NAMESPACE" /
  "INTERFACE" /
  "ROLE" /
  "OPERATION" /
  "PARAMETER" /
  "TYPE" /
  "FIELD" /
  "ENUM" /
  "ENUM_VALUE" /
  "UNION" /
  "ALIAS")
{ return new ast.Name(loc) }

namedType =
   name:( "i8" /
  "u8" /
  "i16" /
  "u16" /
  "i32" /
  "u32" /
  "i64" /
  "u64" /
  "f32" /
  "f64" /
  "bool" /
  "string" /
  "datetime" /
  "bytes" /
  "raw" /
  "value" /
  identifier)
{
  return typeof name === 'string' ? new ast.Named(new ast.Name(name)) : new ast.Named(name);
}

nameTypePair = name:identifier colonSeparator type:apexType
{ return { name, type } }

mapType =
  beginGroup keyType:apexType colonSeparator valueType:apexType endGroup
{ return new ast.MapType(keyType, valueType) }

listType = beginList type:apexType endList
{ return new ast.ListType(type) }

// Keywords
interfaceKeyword = "interface"
roleKeyword = "role"
namespaceKeyword = "namespace"
typeKeyword = "type"
enumKeyword = "enum"
importKeyword = "import"
unionKeyword = "union"
aliasKeyword = "alias"
asKeyword = "as"
fromKeyword = "from"
trueKeyword = "true"
falseKeyword = "false"
directiveKeyword = "directive"
onKeyword = "on"

reservedWords =
  interfaceKeyword /
  roleKeyword
  namespaceKeyword /
  typeKeyword /
  enumKeyword /
  importKeyword /
  unionKeyword /
  aliasKeyword /
  asKeyword /
  fromKeyword /
  trueKeyword /
  falseKeyword /
  directiveKeyword /
  onKeyword

// Operators
splatOperator = "*"
optionalOperator = "?"
commentOperator = "#"
assignmentOperator = "="
pipeOperator = "|"
commaOperator = ","
annotationPrefix = "@"

beginObjectChar = "{"
endObjectChar = "}"
beginListChar = "["
endListChar = "]"
beginArgumentsChar = "("
endArgumentsChar = ")"

equals = ws assignmentOperator ws

beginGroup = ws beginObjectChar ws
endGroup = ws endObjectChar
beginList = ws beginListChar ws
endList = ws endListChar
beginArgumentList = ws beginArgumentsChar ws
endArgumentList = ws endArgumentsChar

// Separators
pipeSeparator = ws pipeOperator ws
colonSeparator = ws ":" ws
commaSeparator = hws (commaOperator / "\n") ws

identifier "identifier"
  = start:identifierStartChar rest:identifierOtherChar
// !{
//   const id = start + rest.join("");
//   if (reservedWords.includes(id)) {
//     return error(`Expected identifier, not reserved word '${id}'`, location());
//   }
//   return reservedWords.includes(id)
// }
{
  return new ast.Name(start + rest.join(""));
}

identifierStartChar = [a-zA-Z_]
identifierOtherChar = [0-9a-zA-Z_]*

char
  = char:(unescaped / escaped)
    { return char; }

escape         = "\\"
quotation_mark = '"'
unescaped      = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]
escaped        =
    escape
    char:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    ) {
return char
}

DIGIT  = [0-9]
HEXDIG = [0-9a-f]i
