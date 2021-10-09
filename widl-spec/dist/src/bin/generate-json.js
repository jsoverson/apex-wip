#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const consumer_1 = require("../consumer");
const json_1 = require("../generators/json");
const widlPath = process.argv[2];
const attrOrderPath = process.argv[3];
if (!widlPath) {
    console.error(`Error: no path specified`);
    console.error(`Usage: ${path_1.default.basename(process.argv[0])} ${path_1.default.basename(process.argv[1])} widl.idl\n\n`);
    process.exit(1);
}
const src = fs_1.default.readFileSync(widlPath, 'utf-8');
const idl = consumer_1.parse(src);
const generatedSource = json_1.codegen(idl);
console.log(generatedSource);
//# sourceMappingURL=generate-json.js.map