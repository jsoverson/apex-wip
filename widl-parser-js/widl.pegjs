{

const ast = require('widl-ast');

function widlLocation() {
  const loc = location();
  return new ast.Location(loc.start.offset, loc.end.offset, "");
}

function annotations() {
  //placeholder
  return undefined;
}

}

WIDL
  = ws values:definition* ws { return new ast.Document(values); }

ws "whitespace" = [ \t\n\r]*
hws "horizontal whitespace" = [ \t]*
eol "end of line" = hws [\n\r]+


definition "definition"
  = ws def:(namespaceDefinition / typeDefinition / interfaceDefinition / enumDefinition / importDefinition) ws
  {
    return def;
  }

namespaceDefinition "namespace definition" = namespaceKeyword ws name:string  { return new ast.NamespaceDefinition(name, undefined, annotations() ); }

importDefinition "import definition" =
  importKeyword ws imports:(@wildcardImport / beginObjectChar ws @importName* ws endObjectChar) ws
  fromKeyword ws from:string
  {
    const all = imports === '*';
    const names = all ? [] : imports;
    return new ast.ImportDefinition(all,names,from,undefined, annotations());
  }

importName = name:identifier ws alias:(renameKeyword ws @identifier)? argumentSeparator?
  {
    return new ast.ImportName(name, alias || undefined);
  }


typeDefinition "type definition" =
  typeKeyword ws name:identifier ws beginObjectChar ws fields:(ws @typeField eol)* ws endObjectChar
  {
    return new ast.TypeDefinition(name, fields, undefined, annotations());
  }

enumDefinition "enum definition" =
  enumKeyword ws name:identifier ws beginObjectChar ws values:(ws @enumValue eol)* ws endObjectChar
  {
    return new ast.EnumDefinition(name, values, undefined, annotations());
  }

enumValue "enum value" =
  name:identifier ws assignmentOperator index:(ws @integer)? display:(ws @string)?
  {
    return new ast.EnumValueDefinition(name, index, display || undefined, undefined, annotations());
  }

interfaceDefinition "interface definition" =
  interfaceKeyword ws beginObjectChar ws operations:(ws @operation eol)* ws endObjectChar
  {
    return new ast.InterfaceDefinition(operations, undefined, annotations());
  }

operation "operation" = name:identifier ws beginArgumentsChar args:argument* endArgumentsChar ws kvSeparator type:widlType
  {
    return new ast.OperationDefinition(name, args, type, false, undefined, annotations());
  }

argument "argument" = pair:nameTypePair argumentSeparator? { return new ast.ParameterDefinition(pair.name, pair.type, undefined, undefined, annotations()); }

typeField "type field" = pair:nameTypePair {return new ast.FieldDefinition(pair.name, pair.type, undefined, undefined, annotations());}

widlType "valid widl type" =
  type:(@mapType / @listType / @primitiveType / @namedType )optional:optionalOperator? {
    if (!!optional) {
      return new ast.Optional(type);
    } else {
      return type;
    }
  }

primitiveType =
type:( "i8" /
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
  "value" ) {
    return new ast.Primitive(type);
  }

namedType =
   name:(identifier) {
    if (typeof name === 'string') {
      return new ast.Named(new ast.Name(name))
    } else {
      return new ast.Named(name);
    }
  }

nameTypePair = name:identifier kvSeparator type:widlType {return { name, type };}

mapType "map" = beginObjectChar ws keyType:widlType kvSeparator valueType:widlType ws endObjectChar { return new ast.MapType(keyType, valueType); }

listType "list" = beginListChar ws type:widlType ws endListChar {return new ast.ListType(type);}

string "string"
  = quotation_mark chars:char* quotation_mark { return new ast.StringValue(chars.join("")); }

// Keywords

interfaceKeyword = "interface"
namespaceKeyword = "namespace"
typeKeyword = "type"
enumKeyword = "enum"
importKeyword = "import"
renameKeyword = "as"
fromKeyword = "from"

// Operators

wildcardImport = "*"
beginObjectChar = "{"
endObjectChar = "}"
beginListChar = "["
endListChar = "]"
beginArgumentsChar = "("
endArgumentsChar = ")"
argumentSeparator = ws "," ws
kvSeparator = ws ":" ws
optionalOperator = "?"
assignmentOperator = "="

identifier "identifier"
  = start:identifierStartChar rest:identifierOtherChar {
  return new ast.Name(start + rest.join(""));
}

identifierStartChar = [a-zA-Z_]
identifierOtherChar = [0-9a-zA-Z_]*

integer "integer" = val:DIGIT+ {
  return new ast.IntValue(parseInt(val.join(""),10))
}

char
  = unescaped
  / escape
    sequence:(
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
    )
    { return sequence; }

escape         = "\\"
quotation_mark = '"'
unescaped      = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]

/* ----- Core ABNF Rules ----- */

/* See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4627). */
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i
