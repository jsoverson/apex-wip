# Work-in-progress Apex spec along with generated parsers and libraries.

## Prerequisites

This repository uses the `task` task runner. Install it from [taskfile.dev](https://taskfile.dev/installation/).

## Running tests

```shell-session
user@host$ task test
```

This will:

- generate test data from the latest published version of `@apexlang/core`
- generate AST libraries in typescript
- generate TypeScript-based Apex parser
- build all TypeScript
- run tests

## Files to note:

- [Apex spec](https://github.com/jsoverson/apex-wip/blob/main/apex-ast-codegen/apexlang.apexlang) (defined in Apex)
- [Generated TypeScript AST nodes](https://github.com/jsoverson/apex-wip/blob/main/typescript/apex-ast/src/generated.ts)
- [TypeScript parser grammar (pegjs)](https://github.com/jsoverson/apex-wip/blob/main/typescript/apex-parser/apex.peggy)
- [test data](https://github.com/jsoverson/apex-wip/blob/main/test-data/apexlang/) serialized to [JSON](https://github.com/jsoverson/apex-wip/blob/main/test-data/json/) and unit tests in [js](https://github.com/jsoverson/apex-wip/tree/main/typescript/apex-parser/test/).
