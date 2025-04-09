const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "src");

function getAllFiles(dir, files = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (
      file.endsWith(".js") ||
      file.endsWith(".ts") ||
      file.endsWith(".tsx")
    ) {
      files.push(fullPath);
    }
  });
  return files;
}

function hasTsNoCheck(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return content.trimStart().startsWith("// @ts-nocheck");
}

function testAndTagEslint(filePath) {
  const originalContent = fs.readFileSync(filePath, "utf8");

  const contentWithoutNoCheck = originalContent.replace(
    /^\/\/\s*@ts-nocheck\s*\n?/,
    ""
  );

  // Escreve temporariamente sem o ts-nocheck
  fs.writeFileSync(filePath, contentWithoutNoCheck);

  let hasErrors = false;

  try {
    console.log(`\n🔍 Testando: ${filePath}`);
    const output = execSync(`npx eslint "${filePath}" -f json`, {
      encoding: "utf8",
    });
    const results = JSON.parse(output);

    if (results.length > 0 && results[0].errorCount > 0) {
      hasErrors = true;
    }
  } catch (err) {
    // Se ESLint falhar completamente (ex: parse error), tratamos como erro
    hasErrors = true;
  }

  if (hasErrors) {
    const fixedContent = `// TODO FIX\n${contentWithoutNoCheck}`;
    fs.writeFileSync(filePath, fixedContent);
  } else {
    // Volta ao conteúdo original se não teve erro (removendo ts-nocheck)
    fs.writeFileSync(filePath, contentWithoutNoCheck);
  }

  return hasErrors;
}

function main() {
  const allFiles = getAllFiles(ROOT_DIR);
  const filesWithTsNoCheck = allFiles.filter(hasTsNoCheck);
  const filesWithErrors = [];

  for (const file of filesWithTsNoCheck) {
    const errored = testAndTagEslint(file);
    if (errored) {
      filesWithErrors.push(file);
    }
  }

  console.log(`\n📋 Arquivos modificados com // TODO FIX:\n`);
  filesWithErrors.forEach((file) => console.log(`- ${file}`));
}

main();
