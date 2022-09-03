import { expect } from 'chai';
import { describe } from 'mocha';
import fs from 'fs';
import path from 'path';

import { parse } from '../src/parser';

function assertParity(source: string): string {
  const expectedDir = path.join(__dirname, '..', '..', '..', 'test-data');
  const apexSourcePath = path.join(expectedDir, 'apexlang', `${source}.apexlang`);
  const apexSource = fs.readFileSync(apexSourcePath, 'utf-8');
  const actualDoc = parse(apexSource, apexSourcePath);
  const jsonFile = `${source}.apexlang.json`;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const expectedTree = require(path.join(expectedDir, `json`, jsonFile));
  const actualJson = JSON.stringify(actualDoc, (key: string, val: unknown) => (key === 'loc' ? undefined : val));
  const actualTree = JSON.parse(actualJson);
  const actualDir = path.join(__dirname, 'serialized');
  fs.mkdirSync(actualDir, { recursive: true });
  fs.writeFileSync(path.join(actualDir, jsonFile), actualJson);
  expect(actualTree).to.deep.equal(expectedTree);
  return actualDoc;
}

describe('apex document parser', function () {
  it('should parse alltypes', () => {
    assertParity('alltypes');
  });
  it('should parse interfaces', () => {
    assertParity('interfaces');
  });
  it('should parse enums', () => {
    assertParity('enums');
  });
  it('should parse namespaces', () => {
    assertParity('namespaces');
  });
  it('should parse imports', () => {
    assertParity('imports');
  });
  it('should parse descriptions', () => {
    assertParity('descriptions');
  });
  it('should parse annotations', () => {
    assertParity('annotations');
  });
  it('should parse default values on types', () => {
    assertParity('defaults');
  });
  it('should parse test spec from apex project', () => {
    assertParity('test-data-1');
  });
  it('should parse openapi spec', () => {
    assertParity('openapi');
  });
});
