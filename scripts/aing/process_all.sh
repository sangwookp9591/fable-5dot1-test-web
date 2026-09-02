#!/usr/bin/env bash
# Download finished Higgsfield jobs (json in <gen_dir>) and key them into public/aing/.
#   usage: process_all.sh <gen_dir> <public_aing_dir>
# 부분 성공을 완료로 취급하지 않는다: webm · mov · png 세 산출물이 모두 있어야 건너뛰고,
# 실패/깨진 job 은 조용히 넘기지 않고 종료 코드를 1 로 남긴다.
set -euo pipefail
GEN="$1"; OUT="$2"; mkdir -p "$OUT"
failed=0
for j in "$GEN"/*.json; do
  name=$(basename "$j" .json)
  if [ -f "$OUT/$name.webm" ] && [ -f "$OUT/$name.mov" ] && [ -f "$OUT/$name.png" ]; then
    echo "skip $name (webm·mov·png 모두 있음)"
    continue
  fi
  status=$(python3 -c "
import json,sys
try:
    d=json.load(open('$j')); j=d[0] if isinstance(d,list) else d
    print(j.get('status','unknown'))
except Exception:
    print('malformed')")
  case "$status" in
    completed) ;;
    queued|in_progress|processing) echo "pending $name ($status)"; continue ;;
    *) echo "FAIL $name: status=$status"; failed=1; continue ;;
  esac
  url=$(python3 -c "
import json
d=json.load(open('$j')); j=d[0] if isinstance(d,list) else d
print(j.get('result_url',''))")
  if [ -z "$url" ]; then
    echo "FAIL $name: completed 인데 result_url 이 없음"; failed=1; continue
  fi
  [ -f "$GEN/$name.mp4" ] || curl -fsSL -o "$GEN/$name.mp4" "$url" || { echo "FAIL $name: 다운로드 실패"; failed=1; continue; }
  case "$name" in
    01_enter|10_goodbye) crop="" ;;           # movement clips keep full width
    *) crop="880:720:200:0" ;;                 # centered clips: trim empty sides
  esac
  echo "key $name"
  "$(dirname "$0")/keyout.sh" "$GEN/$name.mp4" "$OUT/$name" "$crop" 24
  for ext in webm mov png; do
    [ -s "$OUT/$name.$ext" ] || { echo "FAIL $name: $ext 산출물 없음"; failed=1; }
  done
done
ls -la "$OUT"/*.webm 2>/dev/null | awk '{print $5, $9}'
[ "$failed" -eq 0 ] || { echo "일부 클립이 실패했습니다."; exit 1; }
