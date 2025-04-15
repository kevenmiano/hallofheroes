const { ESLint } = require("eslint");
const fs = require("fs");
const path = require("path");

// Função recursiva para listar todos os arquivos de uma pasta
function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (
      fullPath.endsWith(".js") ||
      fullPath.endsWith(".jsx") ||
      fullPath.endsWith(".ts") ||
      fullPath.endsWith(".tsx")
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

async function lintFiles() {
  const eslint = new ESLint();
  const targetDir = "./src"; // altere aqui para a pasta que deseja verificar
  const files = getAllFiles(targetDir);

  const results = await eslint.lintFiles(files);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  const hasErrors = results.some(
    (result) => result.errorCount > 0 || result.warningCount > 0,
  );

  if (hasErrors) {
    console.log(resultText);
    process.exit(1); // retorna erro no processo
  } else {
    console.log("✅ Nenhum problema encontrado com ESLint.");
  }
}

lintFiles().catch((err) => {
  console.error("Erro ao rodar ESLint:", err);
  process.exit(1);
});
