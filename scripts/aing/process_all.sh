#!/usr/bin/env bash
# Download finished Higgsfield jobs (json in <gen_dir>) and key them into public/aing/.
#   usage: process_all.sh <gen_dir> <public_aing_dir>
set -euo pipefail
GEN="$1"; OUT="$2"; mkdir -p "$OUT"
for j in "$GEN"/*.json; do
  name=$(basename "$j" .json)
  [ -f "$OUT/$name.webm" ] && { echo "skip $name"; continue; }
  url=$(python3 -c "
import json,sys
try:
    d=json.load(open('$j')); j=d[0] if isinstance(d,list) else d
    print(j.get('result_url','') if j.get('status')=='completed' else '')
except Exception: print('')")
  [ -z "$url" ] && { echo "pending $name"; continue; }
  [ -f "$GEN/$name.mp4" ] || curl -sL -o "$GEN/$name.mp4" "$url"
  case "$name" in
    01_enter|10_goodbye) crop="" ;;           # movement clips keep full width
    *) crop="880:720:200:0" ;;                 # centered clips: trim empty sides
  esac
  echo "key $name"
  "$(dirname "$0")/keyout.sh" "$GEN/$name.mp4" "$OUT/$name" "$crop" 24
done
ls -la "$OUT"/*.webm 2>/dev/null | awk '{print $5, $9}'
