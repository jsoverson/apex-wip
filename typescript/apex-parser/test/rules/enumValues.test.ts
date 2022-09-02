import { expect } from 'chai';
import { ast } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'enumValue';

const parser = genParser([rule], false);

describe(rule, function () {
  it('should parse a full enum value', () => {
    const tree = parser.parse(`"desc" variant = 0 as "Variant" @anno`);
    expect(tree).to.deep.equal(
      new ast.EnumValueDefinition(
        new ast.Name('variant'),
        new ast.IntValue(0),
        new ast.StringValue('Variant'),
        new ast.StringValue('desc'),
        [new ast.Annotation(new ast.Name('anno'), [])],
      ),
    );
  });
});
