import { expect } from 'chai';
import { ast } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'enumDefinition';

const parser = genParser([rule], false);

describe(rule, function () {
  it('should parse an enum with an annotation', () => {
    const tree = parser.parse(`enum Empty @anno {}`);
    expect(tree).to.deep.equal(
      new ast.EnumDefinition(new ast.Name('Empty'), [], undefined, [new ast.Annotation(new ast.Name('anno'), [])]),
    );
  });
});
