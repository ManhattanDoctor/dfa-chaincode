#!/bin/bash

CHAINCODE_NAME=$1
CHAINCODE_VERSION=$2
CHAINCODE_LANG=$3
CHAINCODE_PATH=/opt/gopath/src/github.com/chaincode/chaincode_compiled

PACKAGE_FILE_NAME=${CHAINCODE_PATH}/${CHAINCODE_NAME}.tgz
CHAINCODE_LABEL="${CHAINCODE_NAME}_${CHAINCODE_VERSION}"

cd ${CHAINCODE_PATH} || exit

if [ -f metadata.json ]; then
  rm metadata.json
fi

jq <<< "{\"type\": \"${CHAINCODE_LANG}\", \"label\": \"${CHAINCODE_LABEL}\"}" > metadata.json

if [ -f code.tar.gz ]; then
  rm code.tar.gz
fi

rm -rf /opt/gopath/src/github.com/chaincode/chaincode_compiled/src/src || true
mkdir -p /opt/gopath/src/github.com/chaincode/chaincode_compiled/src/src || true
mv /opt/gopath/src/github.com/chaincode/chaincode_compiled/package.json /opt/gopath/src/github.com/chaincode/chaincode_compiled/src
mv /opt/gopath/src/github.com/chaincode/chaincode_compiled/src/packages /opt/gopath/src/github.com/chaincode/chaincode_compiled/src/src
mv /opt/gopath/src/github.com/chaincode/chaincode_compiled/src/node_modules /opt/gopath/src/github.com/chaincode/chaincode_compiled/src/src

tar cfz code.tar.gz src

if [ -f "${PACKAGE_FILE_NAME}" ]; then
  rm "${PACKAGE_FILE_NAME}"
fi
tar cfz "${PACKAGE_FILE_NAME}" metadata.json code.tar.gz
