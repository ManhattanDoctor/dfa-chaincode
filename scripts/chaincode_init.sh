#!/bin/bash

CHAINCODE_NAME=$1
CHAINCODE_CONSTRUCTOR=$2

CHANNEL_NAME=$3

PEER_CONN_PARAMS=$4
ORDERER_VARS=$5


peer chaincode invoke \
  ${ORDERER_VARS} \
  --channelID "${CHANNEL_NAME}" \
  --name "${CHAINCODE_NAME}" \
  --ctor ${CHAINCODE_CONSTRUCTOR} \
  --isInit \
  ${PEER_CONN_PARAMS}
