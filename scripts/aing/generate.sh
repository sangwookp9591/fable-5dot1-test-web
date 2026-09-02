#!/usr/bin/env bash
# Batch-generate Aing clips with Higgsfield Kling 3.0 (image-to-video, start+end frame).
#   usage: generate.sh <frames_dir> <out_dir> [only_name]
# Reads clips.tsv next to this script. Each job runs in the background and writes <name>.json.
set -euo pipefail
FRAMES="$1"; OUT="$2"; ONLY="${3:-}"
mkdir -p "$OUT"
PREFIX="2D cartoon sticker animation, camera locked, single character centered. The cute white cat mascot (light-blue tech headband with a brain icon, blue headphones with an A badge, blue eyes, pink inner ears, faint circuit marks). "
SUFFIX=" Flat solid bright green chroma-key background, perfectly even flat lighting, no shadows on the background, no extra props, no text. Crisp dark outlines, flat cel shading, exact same character design and size throughout."
grep -v '^#' "$(dirname "$0")/clips.tsv" | while IFS=$'\t' read -r name dur start end prompt; do
  [ -z "$name" ] && continue
  [ -n "$ONLY" ] && [ "$ONLY" != "$name" ] && continue
  echo "→ $name (${dur}s)"
  nohup higgsfield generate create kling3_0 --prompt "${PREFIX}${prompt}${SUFFIX}" \
    --start-image "$FRAMES/$start.png" --end-image "$FRAMES/$end.png" \
    --duration "$dur" --mode std --sound off --aspect_ratio 16:9 \
    --wait --wait-timeout 25m --json > "$OUT/$name.json" 2> "$OUT/$name.err" &
  sleep 1.5
done
# 백그라운드 job 이 모두 끝날 때까지 기다리고, 하나라도 실패하면 1 로 종료
fail=0
for pid in $(jobs -p); do wait "$pid" || fail=1; done
[ "$fail" -eq 0 ] || { echo "일부 생성 job 이 실패했습니다."; exit 1; }
echo "모든 생성 job 완료"
