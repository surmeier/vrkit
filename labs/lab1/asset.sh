#!/usr/bin/env bash

# Usage: $0 links.txt

INPUT_FILE="$1"

while read p; do
  filename="$(echo "$p" | awk -F'https://sketchfab.com/3d-models/' '{print $2}' | awk -F'-' '{print $1}').glb"
  wget --output-document $filename "$p"
done < "$INPUT_FILE"