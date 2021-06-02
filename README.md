# Work-in-progress WIDL spec and downstream libraries

## Files to note

- [widl spec](https://github.com/jsoverson/widl-wip/blob/master/widl-spec/widl.idl) (defined in [WebIDL](https://en.wikipedia.org/wiki/Web_IDL))
- [Generated TypeScript AST nodes](https://github.com/jsoverson/widl-wip/blob/master/widl-ast-js/src/generated.ts)
- [Generated Rust AST nodes](https://github.com/jsoverson/widl-wip/blob/master/widl-ast-rust/src/ast.rs)
- [TypeScript parser grammar (pegjs)](https://github.com/jsoverson/widl-wip/blob/master/widl-parser-js/widl.pegjs)
- [Rust parser grammar (pest)](https://github.com/jsoverson/widl-wip/blob/master/widl-parser-rust/src/widl.pest)
- tests in [js](https://github.com/jsoverson/widl-wip/tree/master/widl-parser-js/test) & [rust](https://github.com/jsoverson/widl-wip/blob/master/widl-parser-rust/src/lib.rs#L227-L464) to ensure consistency.

## Notes

These are experimental works in progress. The parsers only parse four top-level definitions right now: namespaces, interfaces, type definitions, and imports. The rest aren't difficult to add but there's only so much time in the day.

## Todo

- Finish parsers
- Add cross-parser serialization/deserialization tests
- (Wishlist) find a common PEG syntax that every language can use
- (Wishlist) Define WIDL's IDl in WIDL and parse WIDL with WIDL
