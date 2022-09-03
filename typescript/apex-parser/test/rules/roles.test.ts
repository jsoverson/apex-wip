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
});
