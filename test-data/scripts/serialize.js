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

    /// temporary translations from old -> new

    doc.kind = "ApexDocument";
    doc.definitions.forEach((def) => {
      if (def.getKind() === "NamespaceDefinition") {
        def.name = new ast.StringValue(def.getLoc(), def.name.value);
      }
    });

    ///

    const json = JSON.stringify(
      doc,
      (k, v) => (k === "loc" ? undefined : v),
      2
    );
    fs.writeFileSync(toPath, json);
  }
}

main();

// console.log(JSON.stringify(parse(process.args[1])));
