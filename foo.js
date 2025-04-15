import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const TARGET_IMPORT_PREFIX = "com.road.yishi.proto";
const EXPECT_ERROR_COMMENT = "//@ts-expect-error: External dependencies";

function processFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    console.log(`Processing line: ${trimmedLine}`);

    if (
      (trimmedLine.startsWith("import") &&
        trimmedLine.includes(`from "${TARGET_IMPORT_PREFIX}`)) ||
      trimmedLine.includes(`from '${TARGET_IMPORT_PREFIX}`)
    ) {
      const prevLine = newLines[newLines.length - 1]?.trim();

      if (prevLine !== EXPECT_ERROR_COMMENT) {
        newLines.push(EXPECT_ERROR_COMMENT);
      }
    }

    newLines.push(line);
  }

  if (newLines.join("\n") !== content) {
    writeFileSync(filePath, newLines.join("\n"), "utf8");
    console.log(`✔ Comentário adicionado em: ${filePath}`);
  }
}

function walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "fui") continue;
      walkDir(fullPath);
    } else if (entry.isFile() && fullPath.endsWith(".ts")) {
      processFile(fullPath);
    }
  }
}

const rootDir = resolve("./src");

walkDir(rootDir);
