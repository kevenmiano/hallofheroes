const fs = require("fs");
const path = require("path");

const mapPath = "./js/bundle_release-b77fb68ca6.js.map";
const outputDir = "./sources";

const rawMap = fs.readFileSync(mapPath, "utf8");
const sourceMap = JSON.parse(rawMap);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

sourceMap.sources.forEach((source, i) => {
  const sourceContent = sourceMap.sourcesContent[i];
  if (!sourceContent) {
    console.warn(`Sem conteúdo para: ${source}`);
    return;
  }

  // Remove prefixos tipo "webpack:///" ou "src/"
  const cleanName = source.replace(/^.*?\/(src\/)?/, "");

  const outputPath = path.join(outputDir, cleanName);

  // Cria subpastas se necessário
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  fs.writeFileSync(outputPath, sourceContent, "utf8");
  console.log(`✅ Extraído: ${outputPath}`);
});
