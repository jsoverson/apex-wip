import { expect } from 'chai';
import { ast } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'literalValue';

const parser = genParser([rule], false);

describe(rule, function () {
  it('should parse strings', () => {
    const tree = parser.parse(`"hello"`);
    expect(tree).to.deep.equal(new ast.StringValue('hello'));
  });
  it('should parse strings with escapes', () => {
    const tree = parser.parse(`"hello\\nworld"`);
    expect(tree).to.deep.equal(new ast.StringValue('hello\nworld'));
  });
  it('should parse integers', () => {
    const tree = parser.parse(`90210`);
    expect(tree).to.deep.equal(new ast.IntValue(90210));
  });
  it('should parse floats', () => {
    const tree = parser.parse(`3.14159`);
    expect(tree).to.deep.equal(new ast.FloatValue(3.14159));
  });
  it('should parse booleans', () => {
    let tree = parser.parse(`true`);
    expect(tree).to.deep.equal(new ast.BooleanValue(true));
    tree = parser.parse(`false`);
    expect(tree).to.deep.equal(new ast.BooleanValue(false));
  });
  it('should parse lists', () => {
    const tree = parser.parse(`["hello"]`);
    expect(tree).to.deep.equal(new ast.ListValue([new ast.StringValue('hello')]));
  });
  it('should parse objects', () => {
    const tree = parser.parse(`{this: "that"}`);
    expect(tree).to.deep.equal(
      new ast.ObjectValue([new ast.ObjectField(new ast.Name('this'), new ast.StringValue('that'))]),
    );
  });
  it('should parse multi-line objects', () => {
    const tree = parser.parse(`{
      name: "Apache 2.0"
      url: "https://www.apache.org/licenses/LICENSE-2.0"
    }`);
    expect(tree).to.deep.equal(
      new ast.ObjectValue([
        new ast.ObjectField(new ast.Name('name'), new ast.StringValue('Apache 2.0')),
        new ast.ObjectField(new ast.Name('url'), new ast.StringValue('https://www.apache.org/licenses/LICENSE-2.0')),
      ]),
    );
  });
  it('should parse objects with complex properties', () => {
    const tree = parser.parse(`{"one\\ntwo": "that"}`);
    expect(tree).to.deep.equal(
      new ast.ObjectValue([new ast.ObjectField(new ast.Name('one\ntwo'), new ast.StringValue('that'))]),
    );
  });
  it('should parse enum values/IDs', () => {
    const tree = parser.parse(`hello`);
    expect(tree).to.deep.equal(new ast.EnumValue('hello'));
  });
});
