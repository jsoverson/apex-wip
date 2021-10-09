import ast from 'widl-ast';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('./generated/generated');

export type Resolver = (name: string, location: string) => string;

export interface WidlAst {
  imports: Record<string, ast.Document>;
  document: ast.Document;
}

export function parse(widl: string, resolver?: Resolver): WidlAst {
  const cache = new Map();

  try {
    const tree = parser.parse(widl, { grammarSource: 'widl.pegjs' }) as ast.Document;
    const imports = {};
    for (const definition of tree.definitions) {
      // if (definition.kind == 'ImportDefinition') {
      //   let importedSrc = definition.
      // }
    }

    return {
      imports,
      document: tree,
    };
  } catch (e: any) {
    if ('format' in e && typeof e.format === 'function') {
      console.error(e.format([{ text: widl, source: 'widl.pegjs' }]));
    } else if (e.location) {
      e.message += ` (Error at ${e.location.start.line}:${e.location.start.column} to ${e.location.end.line}:${e.location.end.column})`;
    }
    throw e;
  }
}
