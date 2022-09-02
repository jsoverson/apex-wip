{
  /* eslint-disable no-control-regex */
const {ast} = require('apex-ast');

function annotations() {
  //placeholder
  return undefined;
}

}

APEX
  = ws values:definition* ws { return new ast.ApexDocument(values); }

ws "whitespace" = [ \t\n\r]*
hws "horizontal whitespace" = [ \t]*
eol "end of line" = hws [\n\r]+

definition
  = ws def:(namespaceDefinition / typeDefinition / interfaceDefinition / enumDefinition / importDefinition) ws
  {
    return def;
  }

namespaceDefinition = description:description? ws namespaceKeyword ws name:literalString annotations:annotation* { return new ast.NamespaceDefinition(name, description || undefined, annotations || [] ); }

importDefinition =
  description:description? importKeyword ws imports:(@wildcardImport / beginObjectChar ws @importName* ws endObjectChar) ws
  fromKeyword ws from:literalString
  {
    const all = imports === '*';
    const names = all ? [] : imports;
    return new ast.ImportDefinition(all,names,from, description || undefined, annotations());
  }

importName = name:identifier ws alias:(renameKeyword ws @identifier)? listSeparator?
  {
    return new ast.ImportName(name, alias || undefined);
  }


typeDefinition =
  description:description? typeKeyword ws name:identifier annotations:annotation* ws beginObjectChar ws fields:(ws @fieldDefinition eol)* ws endObjectChar
  {
    return new ast.TypeDefinition(name, fields, /*interfaces?*/[], description || undefined, annotations || []);
  }

enumDefinition =
  description:description? enumKeyword  ws name:identifier ws annotations:annotation* ws beginObjectChar ws values:(ws @enumValue eol)* ws endObjectChar
  {
    return new ast.EnumDefinition(name, values, description || undefined, annotations || []);
  }

enumValue =
  description:description? name:identifier ws assignmentOperator ws index:literalInteger display:(ws renameKeyword ws @literalString)? annotations:annotation*
  {
    return new ast.EnumValueDefinition(name, index, display || undefined, description || undefined, annotations || []);
  }

interfaceDefinition =
  description:description? interfaceKeyword ws annotations:annotation* ws beginObjectChar ws operations:(ws @operation eol)* ws endObjectChar
  {
    return new ast.InterfaceDefinition(operations, description || undefined, annotations || []);
  }

operation = description:description? name:identifier ws beginArgumentsChar ws args:parameterDefinition* ws endArgumentsChar kvSeparator type:apexType annotations:annotation*
  {
    return new ast.OperationDefinition(name, args, type, false, description || undefined, annotations || []);
  }

parameterDefinition = description:description? pair:nameTypePair annotations:annotation* listSeparator? { return new ast.ParameterDefinition(pair.name, pair.type, undefined, description || undefined, annotations || []); }

fieldDefinition = description:description? pair:nameTypePair def:(ws assignmentOperator ws @literalValue)? annotations:annotation*  {return new ast.FieldDefinition(pair.name, pair.type, def || undefined, description || undefined, annotations || []);}

literalValue = value:(literalString / literalBoolean / literalFloat / literalInteger / literalObject / literalArray / literalEnumValue) {
  return value;
}

literalString = quotation_mark chars:char* quotation_mark { return new ast.StringValue(chars.join("")); }

literalBoolean = value:(trueKeyword / falseKeyword) {
  return new ast.BooleanValue(value === "true");
}

literalInteger = val:DIGIT+ {
  return new ast.IntValue(parseInt(val.join(""),10));
}

literalFloat = whole:DIGIT* "." frac:DIGIT+ {
  return new ast.FloatValue(parseFloat(`${whole.join("")}.${frac.join("")}`,10));
}

literalObject = beginObjectChar ws entries:literalObjectEntry* ws endObjectChar {
  return new ast.ObjectValue(entries);
}

literalObjectEntry = name:(identifier / literalString) kvSeparator value:literalValue listSeparator? {
  if (name.kind === 'StringValue') {
    name = new ast.Name(name.value);
  }
  return new ast.ObjectField(name, value);
}

literalArray = beginListChar values:(ws @literalValue listSeparator?)* ws endListChar {
  return new ast.ListValue(values);
}

literalEnumValue = name:identifier { return new ast.EnumValue(name.value); }

description  = description:literalString ws { return description; }

annotation = ws "@" name:identifier args:(ws beginArgumentsChar ws @annotationArgument* ws endArgumentsChar)? {
  return new ast.Annotation(name, args || []);
}

annotationArgument = arg:(namedAnnotationArgument / unnamedAnnotationArgument ) { return arg; }

unnamedAnnotationArgument = value:literalValue listSeparator? ws {
  return new ast.Argument(new ast.Name('value'), value);
}

namedAnnotationArgument = name:identifier ws kvSeparator ws value:literalValue listSeparator? ws {
  return new ast.Argument(name, value);
}

apexType "valid apex type" =
  type:(@mapType / @listType / @namedType)optional:optionalOperator? {
    if (!!optional) {
      return new ast.Optional(type);
    } else {
      return type;
    }
  }

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
  identifier) {
    if (typeof name === 'string') {
      return new ast.Named(new ast.Name(name))
    } else {
      return new ast.Named(name);
    }
  }

nameTypePair = name:identifier kvSeparator type:apexType {return { name, type };}

mapType = beginObjectChar ws keyType:apexType kvSeparator valueType:apexType ws endObjectChar { return new ast.MapType(keyType, valueType); }

listType = beginListChar ws type:apexType ws endListChar {return new ast.ListType(type);}

// Keywords

interfaceKeyword = "interface"
namespaceKeyword = "namespace"
typeKeyword = "type"
enumKeyword = "enum"
importKeyword = "import"
renameKeyword = "as"
fromKeyword = "from"
trueKeyword = "true"
falseKeyword = "false"

// Operators

wildcardImport = "*"
beginObjectChar = "{"
endObjectChar = "}"
beginListChar = "["
endListChar = "]"
beginArgumentsChar = "("
endArgumentsChar = ")"
listSeparator = hws ("," / "\n") hws
kvSeparator = ws ":" ws
optionalOperator = "?"
assignmentOperator = "="

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

/* ----- Core ABNF Rules ----- */

/* See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4627). */
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i
