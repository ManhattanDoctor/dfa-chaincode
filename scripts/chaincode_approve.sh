#!/bin/bash

CHAINCODE_NAME=$1
CHAINCODE_VERSION=$2
CHAINCODE_SEQUENCE=$3

CHANNEL_NAME=$4
ORDERER_VARS=$5

ENDORSEMENT_POLICY=$6

peer lifecycle chaincode queryinstalled &>installed.txt
PACKAGE_ID=$(sed -n "/${CC_NAME}_${CC_VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" installed.txt)

peer lifecycle chaincode approveformyorg \
  ${ORDERER_VARS} \
  --channelID "${CHANNEL_NAME}" \
  --name "${CHAINCODE_NAME}" \
  --version "${CHAINCODE_VERSION}" \
  --package-id "${PACKAGE_ID}" \
  --sequence "${CHAINCODE_SEQUENCE}" \
  --signature-policy "${ENDORSEMENT_POLICY}" \
  --init-required
