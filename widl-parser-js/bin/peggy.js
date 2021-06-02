#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const peggy = require('peggy');
// const tspegjs = require('ts-pegjs');
const fs = require('fs');
const path = require('path');

const grammarPath = path.join(__dirname, '..', 'widl.pegjs');
const grammar = fs.readFileSync(grammarPath, 'utf-8');

const parser = peggy.generate(grammar, {
  trace: false,
  output: 'source',
  format: 'commonjs',
  grammarSource: 'widl.pegjs',
  // plugins: [tspegjs],
  tspegjs: {
    customHeader: '// peggy ',
  },
});

console.log(parser);
