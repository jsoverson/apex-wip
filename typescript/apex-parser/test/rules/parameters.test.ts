import { expect } from 'chai';
import { ast } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'parameterDefinition';

const parser = genParser([rule], false);

describe(rule, function () {
  it('should parse basic parameters', () => {
    const tree = parser.parse(`this : string`);
    expect(tree).to.deep.equal(
      new ast.ParameterDefinition(
        new ast.Name('this'),
        new ast.Named(new ast.Name('string')),
        undefined,
        undefined,
        [],
      ),
    );
  });
  it('should parse param with annotation', () => {
    const tree = parser.parse(`this : string @hey`);
    expect(tree).to.deep.equal(
      new ast.ParameterDefinition(new ast.Name('this'), new ast.Named(new ast.Name('string')), undefined, undefined, [
        new ast.Annotation(new ast.Name('hey'), []),
      ]),
    );
  });
});
