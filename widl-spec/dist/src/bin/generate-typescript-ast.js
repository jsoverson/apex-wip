#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const consumer_1 = require("../consumer");
const typescript_1 = require("../generators/typescript");
const widlPath = process.argv[2];
const attrOrderPath = process.argv[3];
if (!widlPath || !attrOrderPath) {
    console.error(`Error: no path specified`);
    console.error(`Usage: ${path_1.default.basename(process.argv[0])} ${path_1.default.basename(process.argv[1])} widl.idl attribute-order.json\n\n`);
    process.exit(1);
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const attributeOrder = JSON.parse(fs_1.default.readFileSync(attrOrderPath, 'utf-8'));
const src = fs_1.default.readFileSync(widlPath, 'utf-8');
const idl = consumer_1.parse(src);
const generatedSource = typescript_1.codegen(idl, attributeOrder);
console.log(generatedSource);
//# sourceMappingURL=generate-typescript-ast.js.map