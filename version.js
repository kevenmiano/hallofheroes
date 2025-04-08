const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// 🔧 Defina aqui a URL base:
const BASE_URL = "https://sqh5hw-cdn.wan.com/7road/";

// 🔧 Caminho do JSON com os arquivos:
const JSON_PATH = "./version.json";

// 🔧 Diretório de saída:
const OUTPUT_DIR = "./public";

// 🔧 Tempo limite por requisição (em milissegundos)
const REQUEST_TIMEOUT = 10000;

// Função para baixar um único arquivo com timeout
function downloadFile(remotePath, localPath, redirectCount = 0) {
  const MAX_REDIRECTS = 5;
  const fileUrl = new URL(remotePath, BASE_URL).href;
  const client = fileUrl.startsWith("https") ? https : http;

  return new Promise((resolve, reject) => {
    const req = client.get(fileUrl, (res) => {
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        if (redirectCount >= MAX_REDIRECTS) {
          return reject(`🔁 Redirecionamento excedido para ${fileUrl}`);
        }
        console.log(`🔁 Redirecionado para ${res.headers.location}`);
        return resolve(
          downloadFile(res.headers.location, localPath, redirectCount + 1)
        );
      }

      if (res.statusCode !== 200) {
        return reject(`❌ Erro ${res.statusCode} ao baixar ${fileUrl}`);
      }

      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      const fileStream = fs.createWriteStream(localPath);

      res.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close((err) => {
          if (err) return reject(`Erro ao fechar ${localPath}: ${err.message}`);
          console.log(`✅ Baixado: ${localPath}`);
          resolve();
        });
      });

      fileStream.on("error", (err) => {
        fs.unlink(localPath, () => {});
        reject(`❌ Erro ao escrever ${localPath}: ${err.message}`);
      });
    });

    req.setTimeout(REQUEST_TIMEOUT, () => {
      req.abort();
      reject(`⏰ Timeout ao baixar ${fileUrl}`);
    });

    req.on("error", (err) => {
      reject(`🌐 Erro de rede ao baixar ${fileUrl}: ${err.message}`);
    });
  });
}
// Função principal
async function main() {
  const raw = fs.readFileSync(JSON_PATH, "utf-8");
  const assets = JSON.parse(raw);
  const downloads = Object.entries(assets).map(
    async ([logicalPath, realPath]) => {
      const outputPath = path.join(OUTPUT_DIR, logicalPath);
      try {
        console.log(`🔄 Baixando: ${realPath}`);
        await downloadFile(realPath, outputPath);
      } catch (err) {
        console.error(`❌ ${err}`);
      }
    }
  );

  await Promise.all(downloads);
  console.log("🏁 Todos os downloads finalizados!");
}

main().catch(console.error);
