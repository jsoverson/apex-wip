/* eslint-disable no-console */
import {
  AnyType,
  BaseVisitor,
  Context,
  Kind,
  Map,
  List,
  Writer,
  Type,
  Primitive,
  PrimitiveName,
  Optional,
  Enum,
  Union,
  Field,
  Annotation,
} from "@apexlang/core/model";
import ts from "typescript";
// eslint-disable no-console

// This is run in apex via esbuild which gives us the import below.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import attributes from "../attribute-order.json.txt";

const attributeOrder = JSON.parse(attributes);

function inspect(node: unknown): void {
  console.log(JSON.stringify(node, (k, v) => (k === "loc" ? undefined : v), 2));
}

export class TypeScriptVisitor extends BaseVisitor {
  protected statements: ts.Node[] = [];

  constructor(writer: Writer) {
    super(writer);
  }

  visitContextAfter(): void {
    this.write("/* eslint-disable @typescript-eslint/no-inferrable-types */\n");
    this.write(generateTypeScript(this.statements));
  }

  visitType(context: Context): void {
    const visitor = new TypeVisitor(this.writer);
    context.type.accept(context, visitor);

    const order = attributeOrder[context.type.name];

    const fields = visitor.fields
      .filter(outImplicit)
      .sort(byAttributeOrder(order));

    const params = fields.map((field) =>
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        sanitize(field.name),
        questionToken(field.type),
        convertType(field.type),
        expandDefault(field.node.default)
      )
    );

    const assignments = fields.map((field) => {
      if (isOptional(field.type)) {
        return parseStatement(
          `if (${sanitize(field.name)} !== undefined) this.${
            field.name
          } = ${sanitize(field.name)}`
        );
      } else {
        return parseStatement(`this.${field.name} = ${sanitize(field.name)}`);
      }
    });

    const initializerBody = ts.factory.createBlock(assignments);

    const initializer = ts.factory.createConstructorDeclaration(
      undefined,
      params,
      initializerBody
    );

    const node = ts.factory.createClassDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      context.type.name,
      [],
      undefined,
      visitor.elements.concat(initializer)
    );
    this.statements.push(node);
  }

  visitEnum(context: Context): void {
    const visitor = new EnumVisitor(this.writer);
    context.enum.accept(context, visitor);
    const node = ts.factory.createEnumDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      context.enum.name,
      visitor.elements
    );
    this.statements.push(node);
  }

  visitUnion(context: Context): void {
    const types = context.union.types.map(convertType);
    const node = ts.factory.createUnionTypeNode(types);
    const typeAlias = ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      context.union.name,
      undefined,
      node
    );
    this.statements.push(typeAlias);
  }
}

class TypeVisitor extends BaseVisitor {
  elements: ts.ClassElement[] = [];
  fields: Field[] = [];

  constructor(writer: Writer) {
    super(writer);
  }

  visitTypeField(context: Context): void {
    const element = ts.factory.createPropertyDeclaration(
      undefined,
      context.field.name,
      questionToken(context.field.type),
      convertType(context.field.type),
      expandDefault(context.field.node.default)
    );
    this.elements.push(element);
    this.fields.push(context.field);
  }
}

class EnumVisitor extends BaseVisitor {
  elements: ts.EnumMember[] = [];

  constructor(writer: Writer) {
    super(writer);
  }
  visitEnumValue(context: Context): void {
    const element = ts.factory.createEnumMember(context.enumValue.name);
    this.elements.push(element);
  }
}

function isOptional(typ: AnyType): boolean {
  return typ.kind === Kind.Optional;
}

function questionToken(typ: AnyType): ts.QuestionToken | undefined {
  return isOptional(typ)
    ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
    : undefined;
}

function convertType(typ: AnyType): ts.TypeNode {
  switch (typ.kind) {
    case Kind.List: {
      const t = typ as List;
      const itemType = convertType(t.type);
      return ts.factory.createArrayTypeNode(itemType);
    }
    case Kind.Map: {
      const t = typ as Map;

      const keyType = convertType(t.keyType);
      const valueType = convertType(t.valueType);

      return ts.factory.createTypeReferenceNode(`Record`, [keyType, valueType]);
    }
    case Kind.Optional: {
      const t = typ as Optional;
      const innerType = convertType(t.type);
      return innerType;
    }
    case Kind.Union: {
      const t = typ as Union;
      return ts.factory.createTypeReferenceNode(t.name);
    }
    case Kind.Enum: {
      const t = typ as Enum;
      return ts.factory.createTypeReferenceNode(t.name);
    }
    case Kind.Type: {
      const t = typ as Type;
      return ts.factory.createTypeReferenceNode(t.name);
    }
    case Kind.Primitive: {
      const t = typ as Primitive;
      switch (t.name) {
        case PrimitiveName.Bool:
          return ts.factory.createTypeReferenceNode("boolean");
        case PrimitiveName.Bytes:
          return ts.factory.createTypeReferenceNode("number[]");
        case PrimitiveName.DateTime:
          return ts.factory.createTypeReferenceNode("Date");
        case PrimitiveName.F32:
        case PrimitiveName.F64:
        case PrimitiveName.U64:
        case PrimitiveName.U32:
        case PrimitiveName.U16:
        case PrimitiveName.U8:
          return ts.factory.createTypeReferenceNode("number");
        case PrimitiveName.String:
          return ts.factory.createTypeReferenceNode("string");
        default:
          // Todo: handle the rest of the primitives.
          throw new Error(
            `Unhandled primitive type conversion for type: ${t.name}`
          );
      }
    }
    default: {
      // Todo: handle any other types that need to be converted for this codegen
      inspect(typ);
      throw new Error(`Unhandled type conversion for type: ${typ.kind}`);
    }
  }
}

function sanitize(str: string): string {
  if (str.match(/default|arguments/)) {
    return `_${str}`;
  } else {
    return str;
  }
}

function getAnnotation(
  name: string,
  annotations: Annotation[]
): Annotation | undefined {
  return annotations.find((a) => a.name === name);
}

// Have to disable no-explicit-any here because using the current AST nodes directly causes TS type problems.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function expandDefault(node: any): any {
  if (!node) return undefined;
  switch (node.getKind()) {
    case "StringValue":
      return ts.factory.createStringLiteral(node.getValue());
    case "ListValue":
      return ts.factory.createArrayLiteralExpression();
    case "BooleanValue":
      return node.getValue()
        ? ts.factory.createTrue()
        : ts.factory.createFalse();
  }
  console.log(JSON.stringify(node, (k, v) => (k === "loc" ? undefined : v), 2));
  throw new Error("Can not expand default value");
}

function parseStatement(source: string): ts.Statement {
  const node = ts.createSourceFile("x.ts", source, ts.ScriptTarget.Latest);
  return node.statements[0];
}

function outImplicit(field: Field): boolean {
  return field.name !== "kind" && field.name !== "imported";
}

function byAttributeOrder(order: string[]): (a: Field, b: Field) => number {
  return (a, b) => {
    if (order.indexOf(a.name) < order.indexOf(b.name)) return -1;
    if (order.indexOf(a.name) > order.indexOf(b.name)) return 1;
    return 0;
  };
}

function generateTypeScript(statements: ts.Node[]): string {
  const file = ts.createSourceFile(
    "generated.ts",
    "",
    ts.ScriptTarget.ESNext,
    false,
    ts.ScriptKind.TS
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const result = statements
    .map((node) => printer.printNode(ts.EmitHint.Unspecified, node, file))
    .join("\n");

  return result;
}
