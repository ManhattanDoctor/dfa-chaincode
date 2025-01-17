#!/bin/bash

CHAINCODE_NAME=$1
CHAINCODE_VERSION=$2
CHAINCODE_SEQUENCE=$3

CHANNEL_NAME=$4

PEER_CONN_PARAMS=$5
ORDERER_VARS=$6
ENDORSEMENT_POLICY=$7


peer lifecycle chaincode commit \
  ${ORDERER_VARS} \
  --channelID "${CHANNEL_NAME}" \
  --name "${CHAINCODE_NAME}" \
  --version "${CHAINCODE_VERSION}" \
  --sequence "${CHAINCODE_SEQUENCE}" \
  --signature-policy "${ENDORSEMENT_POLICY}" \
  --init-required \
  ${PEER_CONN_PARAMS}
