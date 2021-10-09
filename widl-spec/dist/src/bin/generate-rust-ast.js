#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const consumer_1 = require("../consumer");
const rust_1 = require("../generators/rust");
const widlPath = process.argv[2];
if (!widlPath) {
    console.error(`Error: no path specified`);
    console.error(`Usage: ${path_1.default.basename(process.argv[0])} ${path_1.default.basename(process.argv[1])} widl.idl\n\n`);
    process.exit(1);
}
const src = fs_1.default.readFileSync(widlPath, 'utf-8');
const idl = consumer_1.parse(src);
const generatedSource = rust_1.codegen(idl);
console.log(generatedSource);
//# sourceMappingURL=generate-rust-ast.js.map