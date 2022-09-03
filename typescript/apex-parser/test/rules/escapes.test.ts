import { expect } from 'chai';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'escaped';

const parser = genParser([rule], false);

describe(rule, function () {
  it('should parse \\n', () => {
    const tree = parser.parse(`\\n`);
    expect(tree).to.deep.equal('\n');
  });
});
