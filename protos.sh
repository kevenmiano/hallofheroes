#!/bin/bash

PROTO_DIR="./output"
OUT_DIR="./protos"

# Cria o diretório de saída, se não existir
mkdir -p $OUT_DIR

# Localiza o caminho do plugin protoc-gen-ts_proto
PROTOC_GEN_TS_PROTO_PATH=$(npx --no-install which protoc-gen-ts_proto)

# Verifica se o plugin foi encontrado
if [[ -z "$PROTOC_GEN_TS_PROTO_PATH" ]]; then
  echo "Erro: protoc-gen-ts_proto não encontrado. Certifique-se de que o pacote ts-proto está instalado."
  exit 1
fi

# Executa o comando protoc para gerar os tipos
protoc \
  --proto_path="$PROTO_DIR" \
  --plugin=protoc-gen-ts_proto="$PROTOC_GEN_TS_PROTO_PATH" \
  --ts_proto_out="$OUT_DIR" \
  --ts_proto_opt=esModuleInterop=true,forceLong=number,useOptionals=messages \
  $(find "$PROTO_DIR" -name "*.proto")

echo "Tipos gerados com sucesso em $OUT_DIR"
