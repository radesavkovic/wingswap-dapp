#!/bin/bash

# Path to this plugin
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

# Path to this plugin
PROTO_DIR="../backend/proto"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./src/services/proto"

rm -r "${OUT_DIR}"/*

# protoc \
#     --proto_path=${PROTO_DIR} \
#     --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
#     --js_out="import_style=commonjs,binary:${OUT_DIR}" \
#     --ts_out="service=grpc-web:${OUT_DIR}" \
#     "${PROTO_DIR}"/*.proto

protoc \
  --proto_path=${PROTO_DIR} \
  --js_out=import_style=commonjs,binary:$OUT_DIR \
  --grpc-web_out=import_style=typescript,mode=grpcweb:$OUT_DIR \
  "${PROTO_DIR}"/*.proto