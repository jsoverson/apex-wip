import { expect } from 'chai';
import { describe } from 'mocha';
import fs from 'fs';
import path from 'path';

import { parse, Resolver } from '../src/parser';
import { Document } from 'widl-ast';

function assertParity(source: string, resolver?: Resolver): Document {
  const widl = fs.readFileSync(path.join(__dirname, 'examples', `${source}.widl`), 'utf-8');
  const result = parse(widl, resolver);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const oldTree = require(`./examples/${source}.widl.json`);
  const newTree = JSON.parse(JSON.stringify(result, (key: string, val: any) => (key === 'loc' ? undefined : val)));
  expect(newTree).to.deep.equal(oldTree);
  return result;
}

describe('parser', function () {
  it('should parse types', () => {
    const result = assertParity('alltypes');
    expect(result).to.be.instanceOf(Object);
  });
  it('should parse interfaces', () => {
    const result = assertParity('interfaces');
    expect(result).to.be.instanceOf(Object);
  });
  it('should parse enums', () => {
    const result = assertParity('enums');
    expect(result).to.be.instanceOf(Object);
  });
  it('should parse namespaces', () => {
    const result = assertParity('namespaces');
    expect(result).to.be.instanceOf(Object);
  });
  it('should parse imports', () => {
    const result = assertParity('imports');
    expect(result).to.be.instanceOf(Object);
  });

  it('should parse imports with a resolver', () => {
    const result = assertParity('imports-resolver', (name: string): string => {
      return fs.readFileSync(path.join(__dirname, 'examples', name), 'utf-8');
    });
    expect(result).to.be.instanceOf(Object);
  });
});
