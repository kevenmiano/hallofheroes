import fs from "node:fs";
import path from "path";

function addNoCheck(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      addNoCheck(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (!content.startsWith("// @ts-nocheck")) {
        const updated = `// @ts-nocheck\n${content}`;
        fs.writeFileSync(fullPath, updated, "utf-8");
        console.log(`Atualizado: ${fullPath}`);
      }
    }
  }
}

addNoCheck("./src");
