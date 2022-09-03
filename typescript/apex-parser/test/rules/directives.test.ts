import { expect } from 'chai';
import { ast, name } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'directiveDefinition';

const parser = genParser([rule], false);

describe(rule, function () {
  it(`should parse ${rule} with arguments`, () => {
    const tree = parser.parse(`directive @info(
      title: string
      termsOfService: string?
    ) on NAMESPACE`);
    expect(tree).to.deep.equal(
      new ast.DirectiveDefinition(
        name('info'),
        [
          new ast.FieldDefinition(name('title'), new ast.Named(name('string'))),
          new ast.FieldDefinition(name('termsOfService'), new ast.Optional(new ast.Named(name('string')))),
        ],
        [name('NAMESPACE')],
        [],
        undefined,
      ),
    );
  });
});
