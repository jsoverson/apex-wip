
# Enforce bash as the shell for consistency
SHELL := bash
# Use bash strict mode
.SHELLFLAGS := -eu -o pipefail -c
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --no-print-directory

AST_TS_SPEC:=widl-spec/generated/ast-nodes.ts
AST_TS:=widl-ast-js/src/generated.ts
PARSER_TS:=widl-parser-js/src/generated/generated.js

CLEANFILES=$(AST_TS) $(AST_TS_SPEC)

.PHONY: all
all: build

.PHONY: codegen
codegen: typescript

.PHONY: typescript
typescript: $(AST_TS) $(PARSER_TS)

$(PARSER_TS): widl-parser-js/widl.pegjs
	cd widl-parser-js && npm run codegen
	cd widl-parser-js && npm run build

$(AST_TS): $(AST_TS_SPEC)
	cp $< $@
	cd widl-ast-js && npm run build

$(AST_TS_SPEC): $(wildcard widl-spec/src/*.ts) widl-spec/widl.idl
	cd widl-spec && npm run build && npm run codegen:typescript

.PHONY: clean
clean:
	@rm $(CLEANFILES)

.PHONY: test
test: codegen
	cd widl-spec && npm test
	cd widl-ast-js && npm test
	cd widl-parser-js && npm test
