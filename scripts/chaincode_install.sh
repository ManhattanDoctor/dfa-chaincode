#!/bin/bash

CHAINCODE_NAME=$1

CHAINCODE_PATH=/opt/gopath/src/github.com/chaincode/chaincode_compiled

PACKAGE_FILE_PATH="${CHAINCODE_PATH}/${CHAINCODE_NAME}.tgz"

peer lifecycle chaincode install "${PACKAGE_FILE_PATH}"
