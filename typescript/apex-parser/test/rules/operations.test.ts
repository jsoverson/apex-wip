import { expect } from 'chai';
import { ast } from 'apex-ast';
import { describe } from 'mocha';

import { genParser } from '../utils/gen-parser';

const rule = 'operation';

const parser = genParser([rule], false);

describe(rule, function () {
  it('should parse an operation with no params', () => {
    const tree = parser.parse(`opName():any`);
    expect(tree).to.deep.equal(
      new ast.OperationDefinition(new ast.Name('opName'), [], new ast.Named(new ast.Name('any')), false),
    );
  });

  it('should parse an operation with arguments', () => {
    const tree = parser.parse(`opName ( msg : string ) : string`);
    expect(tree).to.deep.equal(
      new ast.OperationDefinition(
        new ast.Name('opName'),
        [new ast.FieldDefinition(new ast.Name('msg'), new ast.Named(new ast.Name('string')))],
        new ast.Named(new ast.Name('string')),
        false,
      ),
    );
  });

  it('should parse an operation with an annotation', () => {
    const tree = parser.parse(`opName():any @anno`);
    expect(tree).to.deep.equal(
      new ast.OperationDefinition(new ast.Name('opName'), [], new ast.Named(new ast.Name('any')), false, undefined, [
        new ast.Annotation(new ast.Name('anno'), []),
      ]),
    );
  });
});
