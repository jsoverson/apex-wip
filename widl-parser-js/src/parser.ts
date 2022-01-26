import ast, { ImportDefinition, TypeDefinition } from 'widl-ast';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('./generated/generated');

export type Resolver = (name: string) => string;

function isImport(def: ast.Definition): def is ImportDefinition {
  return def.kind == 'ImportDefinition';
}

function isType(def: ast.Definition): def is TypeDefinition {
  return def.kind == 'TypeDefinition';
}

export function parse(widl: string, resolver?: Resolver): ast.Document {
  const cache = new Map();

  try {
    const tree = parser.parse(widl, { grammarSource: 'widl.pegjs' }) as ast.Document;
    for (const parentDefinition of tree.definitions) {
      if (isImport(parentDefinition) && resolver) {
        const importFrom = parentDefinition.from.value;
        const importSource = resolver(importFrom);

        const importTree = parse(importSource, resolver);
        if (parentDefinition.all) {
          tree.definitions.push(...importTree.definitions);
        } else {
          for (const importName of parentDefinition.names) {
            const imported = importTree.definitions.find(def => isType(def) && def.name.value == importName.name.value);
            if (imported) tree.definitions.push(imported);
          }
        }
      }
    }
    return tree;
  } catch (e: any) {
    if ('format' in e && typeof e.format === 'function') {
      console.error(e.format([{ text: widl, source: 'widl.pegjs' }]));
    } else if (e.location) {
      e.message += ` (Error at ${e.location.start.line}:${e.location.start.column} to ${e.location.end.line}:${e.location.end.column})`;
    }
    throw e;
  }
}
