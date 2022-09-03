#!/usr/bin/env node

async function main() {
  const { parse, ast } = await import("@apexlang/core");
  const fs = require("fs");
  const path = require("path");

  const apex = process.argv[2];
  const out = process.argv[3];

  for (const file of fs.readdirSync(apex)) {
    const fromPath = path.join(apex, file);
    const toPath = path.join(out, `${file}.json`);
    console.log(`serializing file ${fromPath} to ${toPath}`);
    const apexSrc = fs.readFileSync(fromPath, "utf-8");
    const doc = parse(apexSrc);

    // temporary translations from old -> new

    // Changed root Document type to ApexDocument
    doc.kind = "ApexDocument";

    // Changed namespace name to a StringValue
    doc.definitions.forEach((def) => {
      if (def.getKind() === "NamespaceDefinition") {
        def.name = new ast.StringValue(def.getLoc(), def.name.value);
      }
    });

    const json = JSON.stringify(
      doc,
      (k, v) => {
        // Remove "loc" from comparisons
        if (k === "loc") return undefined;
        // ParameterDefinitions are the same as FieldDefinitions, so removing ParameterDefinitions
        if (k === "kind" && v === "ParameterDefinition")
          return "FieldDefinition";
        return v;
      },
      2
    );

    // End changes

    fs.writeFileSync(toPath, json);
  }
}

main();
