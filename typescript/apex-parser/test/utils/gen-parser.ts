import path from 'path';
import fs from 'fs';
import peggy from 'peggy';
import { Module } from 'module';

export function genParser(startRules = ['APEX'], trace = false): peggy.Parser {
  const grammarPath = path.join(__dirname, '..', '..', 'apex.peggy');
  const grammar = fs.readFileSync(grammarPath, 'utf-8');
  const source = peggy.generate(grammar, {
    trace,
    format: 'commonjs',
    output: 'source',
    allowedStartRules: startRules,
    grammarSource: grammarPath,
  });
  // Need to dynamically load module because we
  // require the local project's AST dependency.

  const mod = new Module(startRules.join('-'), module) as any;
  mod.paths = module.paths;
  mod._compile(source, ''); // eslint-disable-line

  return mod.exports;
}
