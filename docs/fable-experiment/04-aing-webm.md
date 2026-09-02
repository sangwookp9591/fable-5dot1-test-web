# 04 · Aing WebM — Higgsfield 파이프라인

## 결과

| 상태 | 파일 | 길이 | 반복 | 용도 |
|---|---|---|---|---|
| idle | 00_idle | 4s | loop | 기본. 숨쉬기·눈 깜빡임·꼬리 |
| enter | 01_enter | 5s | once | 인트로. 오른쪽에서 걸어와 둘러보고 손 흔들기 |
| point | 02_point | 4s | once | 경력. 왼쪽 콘텐츠 가리키기 |
| think | 03_think | 4s | loop | AI · 고치는 과정 1단계 |
| type | 04_type | 5s | loop | 고치는 과정 3단계 (노트북 타이핑, 앉은 포즈) |
| wait | 05_wait | 4s | loop | (예비) 처리 대기 |
| surprise | 06_surprise | 3s | once | ZIVO 슬라이더 50% |
| celebrate | 07_celebrate | 4s | once | 고치는 과정 4단계 · 결과 |
| review | 08_review | 4s | loop | 검수 · 고치는 과정 2단계 |
| error | 09_error | 3s | once | 성능 기준 미달 |
| leave | 10_goodbye | 5s | once | 마지막 인사 후 오른쪽으로 퇴장 (마지막 프레임은 빈 화면) |

크레딧: Nano Banana 2 Lite 1 + Kling 3.0 × 11 (4.5~7.5) = **68.5 / 100**. 재생성 없음.

## 왜 이렇게 만들었나

1. **기준 포즈 한 장을 먼저 만들었다.** 원본 idle WebP 는 전부 윙크 프레임이라 bookend 로 쓰기 어려웠다.
   Nano Banana 2 Lite 에 idle · think 프레임을 참조로 넣고 "눈 뜬 정면 기본 포즈, 초록 배경" 을 1장 뽑았다 (`public/aing/rest.png` 로도 사용).
2. **모든 클립의 start/end 프레임을 그 기준 포즈로 고정했다.** Kling 3.0 은 start+end image 를 받고 추가 비용이 없다.
   결과: 어떤 상태에서 어떤 상태로 바뀌어도 첫/끝 프레임이 같아 crossfade 만으로 이어진다. (type 은 앉은 포즈라 예외 — 전환 시 220ms 페이드)
3. **알파는 크로마키로.** 모델은 알파를 직접 내지 못한다. 순수 초록(#00FF00) 배경 → ffmpeg `chromakey=0x00ff00:0.22:0.08` + `despill=green:mix=0.3:expand=0`.
   `expand>0` 을 주면 옅은 파란 헤드밴드가 보라색으로 변했다 (색 샘플로 확인) → 0 으로 고정.
4. **두 포맷.** VP9 alpha WebM (Chrome·Firefox·Edge) + HEVC alpha MOV (Safari, `hevc_videotoolbox -alpha_quality`). 둘 다 못 틀면 원본 애니메이션 WebP.
5. **가운데 클립은 좌우를 잘라** 880×720 으로 (decode 픽셀 30% 감소). 걸어 들어오고 나가는 두 클립만 1280 전폭.

## 스크립트 (재현)

```
scripts/aing/key_image.py       초록 배경 PNG → RGBA 스프라이트
scripts/aing/compose_frames.py  스프라이트를 1280×720 초록 캔버스 위에 배치 (start/end 프레임)
scripts/aing/clips.tsv          클립별 길이·프레임·프롬프트
scripts/aing/generate.sh        Kling 3.0 배치 생성 (--wait --json, 백그라운드)
scripts/aing/process_all.sh     완료된 job 다운로드 → keyout.sh → public/aing/
scripts/aing/keyout.sh          크로마키 → .webm / .mov / 포스터 .png
```

## Overlay Engine 이 지키는 것 (spec §4)

- 두 개의 `<video>` 버퍼. 새 클립은 `canplaythrough` 후 `play()` → `requestVideoFrameCallback` 으로 첫 프레임이 그려진 뒤에만 opacity 교체 → 검은 프레임 없음
- 안 쓰는 버퍼는 `removeAttribute("src")` + `load()` 로 decode 중단
- 다음 섹션 클립은 `fetch(cache: force-cache)` 로 HTTP 캐시만 미리 채움 (saveData 면 안 함)
- 위치 이동은 `transform` 만 (compositor). 앵커 추적 중엔 transition 없음
- `visibilitychange` 에 pause/play
- reduced-motion 이면 정지 포스터(rest.png)
- `<video>` 가 `error` 를 내면 그 즉시 WebP 로 전환, 이후 다시 시도하지 않음
