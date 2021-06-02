#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parse } from '../consumer';
import { codegen } from '../generators/typescript';

const widlPath = process.argv[2];

const attrOrderPath = process.argv[3];

if (!widlPath || !attrOrderPath) {
  console.error(`Error: no path specified`);
  console.error(
    `Usage: ${path.basename(process.argv[0])} ${path.basename(process.argv[1])} widl.idl attribute-order.json\n\n`,
  );
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const attributeOrder = JSON.parse(fs.readFileSync(attrOrderPath, 'utf-8'));

const src = fs.readFileSync(widlPath, 'utf-8');

const idl = parse(src);

const generatedSource = codegen(idl, attributeOrder);

console.log(generatedSource);
