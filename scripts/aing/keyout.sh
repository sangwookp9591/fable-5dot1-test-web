#!/usr/bin/env bash
# Chroma-key a green-screen mp4 into a VP9 alpha WebM (+ HEVC alpha MOV for Safari)
# and a poster PNG for the first frame.
#   usage: keyout.sh <in.mp4> <out_basename> [crop_w:crop_h:x:y] [fps]
set -euo pipefail
IN="$1"; OUT="$2"; CROP="${3:-}"; FPS="${4:-24}"
FILTER="fps=${FPS}"
[ -n "$CROP" ] && FILTER="$FILTER,crop=${CROP}"
# chromakey: key pure green; similarity/blend tuned for cartoon edges; despill green fringe
FILTER="$FILTER,format=rgba,chromakey=0x00ff00:0.22:0.08,despill=type=green:mix=0.6:expand=0.3,format=yuva420p"
ffmpeg -y -loglevel error -i "$IN" -vf "$FILTER" -an \
  -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32 -deadline good -cpu-used 1 -row-mt 1 -auto-alt-ref 0 \
  "${OUT}.webm"
# HEVC with alpha (Safari). videotoolbox is macOS only; skip if unavailable.
if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q hevc_videotoolbox; then
  ffmpeg -y -loglevel error -i "$IN" -vf "$FILTER" -an \
    -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.75 -q:v 60 -tag:v hvc1 "${OUT}.mov" || echo "mov skipped"
fi
# poster (first frame, transparent)
ffmpeg -y -loglevel error -i "$IN" -vf "${FILTER},select=eq(n\,0)" -frames:v 1 "${OUT}.png"
ls -la "${OUT}".*
