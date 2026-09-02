#!/usr/bin/env bash
# GPT-5.6 Sol (Codex CLI) 에게 디자인·웹 냉정 리뷰를 받는다. 코드 수정 없음(read-only sandbox).
#   usage: scripts/review/codex-review.sh <prompt.md> <out.md> [screens_dir]
set -euo pipefail
PROMPT="$1"; OUT="$2"; SCREENS="${3:-docs/fable-experiment/screens}"
ARGS=()
for f in "$SCREENS"/*.jpg; do [ -f "$f" ] && ARGS+=(-i "$f"); done
codex exec -m gpt-5.6-sol -s read-only --skip-git-repo-check -C "$(pwd)" \
  -o "$OUT" "${ARGS[@]}" - < "$PROMPT"
echo "review saved: $OUT"
