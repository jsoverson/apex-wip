import { expect } from 'chai';
import { ast, name, str } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'annotationArgument';

const parser = genParser([rule], false);

describe(rule, function () {
  it('should parse unnamed arg', () => {
    const tree = parser.parse(`"test"`);
    expect(tree).to.deep.equal(new ast.Argument(name('value'), str('test')));
  });
  it('should parse named arg with annotation', () => {
    const tree = parser.parse(`this : "that"`);
    expect(tree).to.deep.equal(new ast.Argument(new ast.Name('this'), str('that')));
  });
});
