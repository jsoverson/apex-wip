#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parse } from '../consumer';
import { codegen } from '../generators/json';

const widlPath = process.argv[2];

const attrOrderPath = process.argv[3];

if (!widlPath) {
  console.error(`Error: no path specified`);
  console.error(`Usage: ${path.basename(process.argv[0])} ${path.basename(process.argv[1])} widl.idl\n\n`);
  process.exit(1);
}

const src = fs.readFileSync(widlPath, 'utf-8');

const idl = parse(src);

const generatedSource = codegen(idl);

console.log(generatedSource);
