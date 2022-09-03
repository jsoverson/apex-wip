import { expect } from 'chai';
import { ast, name } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'roleDefinition';

const parser = genParser([rule], false);

describe(rule, function () {
  it(`should parse ${rule} with an annotation`, () => {
    const tree = parser.parse(`role myRole @iface {}`);
    expect(tree).to.deep.equal(
      new ast.RoleDefinition(name('myRole'), [], undefined, [new ast.Annotation(new ast.Name('iface'), [])]),
    );
  });
  it(`should parse ${rule} with liberal whitespace`, () => {
    const tree = parser.parse(`role MyService {
      one(value: bytes): bytes

      two(value: string): MyType
    }`);
    expect(tree).to.deep.equal(
      new ast.RoleDefinition(name('MyService'), [
        new ast.OperationDefinition(
          name('one'),
          [new ast.FieldDefinition(name('value'), new ast.Named(name('bytes')))],
          new ast.Named(name('bytes')),
          false,
        ),
        new ast.OperationDefinition(
          name('two'),
          [new ast.FieldDefinition(name('value'), new ast.Named(name('string')))],
          new ast.Named(name('MyType')),
          false,
        ),
      ]),
    );
  });
});
