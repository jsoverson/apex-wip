#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const peggy = require('peggy');
const fs = require('fs');
const path = require('path');

const grammarPath = path.join(__dirname, '..', 'apex.peggy');
const grammar = fs.readFileSync(grammarPath, 'utf-8');

const parser = peggy.generate(grammar, {
  trace: false,
  output: 'source',
  format: 'commonjs',
  allowedStartRules: ['APEX'],
  grammarSource: grammarPath,
  error(stage, message, location, notes) {
    console.log(error);
    console.log(stage);
    console.log(message);
    console.log(location);
    console.log(notes);
  },
});

console.log(parser);
