import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
const TARGET_LINE = "//@ts-expect-error: External dependencies";

function processFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  if (lines[0].trim() === TARGET_LINE) {
    lines.shift(); // remove the first line
    writeFileSync(filePath, lines.join("\n"), "utf8");
    console.log(`✔ Linha removida de: ${filePath}`);
  }
}

function walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "fui") continue; // Skip "fui" folder
      walkDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith(".ts")) {
      processFile(fullPath);
    }
  }
}

// Change this path to the starting folder
const rootDir = resolve("./src");

walkDir(rootDir);
