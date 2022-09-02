import { expect } from 'chai';
import { ast } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'annotation';

const parser = genParser([rule], false);

describe(rule, function () {
  it('should parse annotation with no arguments', () => {
    const tree = parser.parse(`@hello`);
    expect(tree).to.deep.equal(new ast.Annotation(new ast.Name('hello'), []));
  });
  it('should parse annotation with arguments', () => {
    const tree = parser.parse(`@hello(this: "that")`);
    expect(tree).to.deep.equal(
      new ast.Annotation(new ast.Name('hello'), [new ast.Argument(new ast.Name('this'), new ast.StringValue('that'))]),
    );
  });
  it('should parse annotation with complex arguments', () => {
    const tree = parser.parse(`@info(
      license: {
        name: "Apache 2.0"
        url: "https://www.apache.org/licenses/LICENSE-2.0"
      }
    )`);
    expect(tree).to.deep.equal(
      new ast.Annotation(new ast.Name('info'), [
        new ast.Argument(
          new ast.Name('license'),
          new ast.ObjectValue([
            new ast.ObjectField(new ast.Name('name'), new ast.StringValue('Apache 2.0')),
            new ast.ObjectField(
              new ast.Name('url'),
              new ast.StringValue('https://www.apache.org/licenses/LICENSE-2.0'),
            ),
          ]),
        ),
      ]),
    );
  });
});
