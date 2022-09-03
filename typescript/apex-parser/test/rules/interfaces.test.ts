import { expect } from 'chai';
import { ast } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'interfaceDefinition';

const parser = genParser([rule], false);

describe(rule, function () {
  it('should parse an interface with an annotation', () => {
    const tree = parser.parse(`interface @iface {}`);
    expect(tree).to.deep.equal(
      new ast.InterfaceDefinition([], undefined, [new ast.Annotation(new ast.Name('iface'), [])]),
    );
  });

  it('should parse an interface with a description', () => {
    const tree = parser.parse(`"desc" interface {}`);
    expect(tree).to.deep.equal(new ast.InterfaceDefinition([], new ast.StringValue('desc')));
  });
});
