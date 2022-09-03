{
/* eslint-disable no-control-regex */
const {ast} = require('apex-ast');

function list(head, tail) {
  if (tail) head.push(tail)
  return head;
}
}

APEX = values:(ws @definition ws)* { return new ast.ApexDocument(values); }

ws = [ \t\n\r]*
hws = [ \t]*
eol = hws [\n\r]+

definition
  =
  @(
    namespaceDefinition /
    typeDefinition /
    interfaceDefinition /
    directiveDefinition /
    unionDefinition /
    enumDefinition /
    importDefinition
  )

description = @literalString ws

namespaceDefinition =
  description:description?
  namespaceKeyword hws name:literalString
  annotations:annotation*
{
  return new ast.NamespaceDefinition(name, description || undefined, annotations );
}

importDefinition =
  description:description?
  importKeyword hws imports:(wildcardImport / importGroup) ws
  fromKeyword ws from:literalString
  annotations:annotation*
{
  const all = imports === '*';
  const names = all ? [] : imports;
  return new ast.ImportDefinition(all, names, from, description || undefined, annotations);
}

importGroup = beginObjectChar args:importNames? endObjectChar
{ return args || [] }

importNames = ws values:(@importName commaSeparator)* last:importName? ws
{ return list(values, last) }

importName = name:identifier ws alias:(renameKeyword ws @identifier)?
{
  return new ast.ImportName(name, alias || undefined);
}

directiveDefinition =
  description:description?
  directiveKeyword hws annotationPrefix name:identifier ws
  parameters:(beginArgumentsChar @parameters endArgumentsChar ws)?
  locations:(onKeyword @locations)?
{
  return new ast.DirectiveDefinition(name, parameters || [], locations || undefined, [], description || undefined);
}

typeDefinition =
  description:description?
  typeKeyword hws name:identifier
  annotations:annotation* ws
  fields:fieldGroup
{
  return new ast.TypeDefinition(name, fields, /*interfaces?*/[], description || undefined, annotations);
}

unionDefinition =
  description:description?
  unionKeyword hws name:identifier
  annotations:annotation*
  ws assignmentOperator ws
  types:typeUnion
{
  return new ast.UnionDefinition(name, types, description || undefined, annotations)
}

enumDefinition =
  description:description? enumKeyword  ws name:identifier ws annotations:annotation* ws beginObjectChar ws values:(ws @enumValue eol)* ws endObjectChar
{
  return new ast.EnumDefinition(name, values, description || undefined, annotations);
}

enumValue =
  description:description?
  name:identifier ws assignmentOperator ws index:literalInteger display:(ws renameKeyword ws @literalString)?
  annotations:annotation*
{
  return new ast.EnumValueDefinition(name, index, display || undefined, description || undefined, annotations);
}

interfaceDefinition =
  description:description? interfaceKeyword hws annotations:annotation* ws beginObjectChar ws operations:(ws @operation eol)* ws endObjectChar
{
  return new ast.InterfaceDefinition(operations, description || undefined, annotations);
}

operation =
  description:description?
  name:identifier ws args:parameterGroup ws colonSeparator type:apexType
  annotations:annotation*
{
  return new ast.OperationDefinition(name, args, type, false, description || undefined, annotations);
}

parameterDefinition =
  description:description?
  pair:nameTypePair
  annotations:annotation*
{
  return new ast.ParameterDefinition(pair.name, pair.type, undefined, description || undefined, annotations);
}

fieldDefinition =
  description:description?
  pair:nameTypePair defaultValue:(ws assignmentOperator ws @literalValue)?
  annotations:annotation*
{
  return new ast.FieldDefinition(pair.name, pair.type, defaultValue || undefined, description || undefined, annotations);
}

parameterGroup = beginArgumentsChar args:parameters? endArgumentsChar {
  return args || []
}

parameters = ws values:(@parameterDefinition commaSeparator)* last:parameterDefinition? ws
{ return list(values, last) }

fieldGroup = beginObjectChar list:fields? endObjectChar
{ return list || [] }

fields = ws values:(@fieldDefinition commaSeparator)* last:fieldDefinition? ws
{ return list(values, last) }

locations = ws values:(@locationKind ws pipeSeparator ws)* last:locationKind? ws
{ return list(values, last) }

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

annotation =
  ws
  annotationPrefix name:identifier
  args:(ws beginArgumentsChar @annotationArguments endArgumentsChar)?
{ return new ast.Annotation(name, args || []) }

annotationArguments = ws values:(@annotationArgument commaSeparator)* last:annotationArgument? ws
{ return list(values, last) }

annotationArgument = @(namedAnnotationArgument / unnamedAnnotationArgument)

unnamedAnnotationArgument = value:literalValue
{ return new ast.Argument(new ast.Name('value'), value) }

namedAnnotationArgument = name:identifier ws colonSeparator ws value:literalValue
{ return new ast.Argument(name, value) }

typeUnion = ws values:(@apexType ws pipeSeparator ws)* last:apexType? ws
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

literalObject = beginObjectChar ws entries:literalObjectEntry* ws endObjectChar
{ return new ast.ObjectValue(entries) }

literalObjectEntry = name:(identifier / literalString) colonSeparator value:literalValue commaSeparator?
{
  if (name.kind === 'StringValue') name = new ast.Name(name.value);
  return new ast.ObjectField(name, value);
}

literalArray = beginListChar values:(ws @literalValue commaSeparator?)* ws endListChar
{ return new ast.ListValue(values) }

literalEnumValue = name:identifier
{ return new ast.EnumValue(name.value) }

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
  beginObjectChar ws keyType:apexType colonSeparator valueType:apexType ws endObjectChar
{ return new ast.MapType(keyType, valueType) }

listType =
  beginListChar ws type:apexType ws endListChar
{ return new ast.ListType(type) }




// Keywords
interfaceKeyword = "interface"
namespaceKeyword = "namespace"
typeKeyword = "type"
enumKeyword = "enum"
importKeyword = "import"
unionKeyword = "union"
aliasKeyword = "alias"
renameKeyword = "as"
fromKeyword = "from"
trueKeyword = "true"
falseKeyword = "false"
directiveKeyword = "directive"
onKeyword = "on"

// Operators
wildcardImport = "*"
optionalOperator = "?"
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

// Separators
pipeSeparator = hws (pipeOperator / "\n") hws
colonSeparator = ws ":" ws
commaSeparator = hws (commaOperator / "\n") hws

identifier "identifier"
  = start:identifierStartChar rest:identifierOtherChar {
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
