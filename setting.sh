#!/bin/bash
LOCATION="`pwd`"
PORT=8000
while getopts l:p: flag
do
    case "${flag}" in
        l) LOCATION=${OPTARG};;
        p) PORT=${OPTARG};;
    esac
done
echo "location: $LOCATION and port: $PORT"
cd $(dirname ${BASH_SOURCE[0]})
tmp=$(mktemp)
    jq --arg location "$LOCATION" --arg port "$PORT" '.port = $port| .folderPath = $location' ./manifest.json > "$tmp" && mv "$tmp" manifest.json
