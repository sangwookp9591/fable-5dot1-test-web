# 06 · Performance

측정: 프로덕션 빌드 (`bun run build && bun run start --port 3211`), Chrome DevTools MCP 트레이스, 1440×900, CPU/네트워크 throttling 없음 (로컬).

## Web Vitals (프로덕션, 로컬)

| 지표 | 값 | 목표 | 판정 |
|---|---|---|---|
| LCP | 385 ms (TTFB 4 · load 8 · render delay 374) | < 2.0 s | PASS |
| CLS (로드) | 0.00 | < 0.05 | PASS |
| CLS (전체 스크롤 9초 누적, 페이지 내 PerformanceObserver) | 0.015 (처음 0.237 → 수정) | < 0.05 | PASS |
| INP | 방문자 브라우저에서 실측 (검수 섹션에 표시). 자동 스크롤 + 클릭 테스트에서 long task 없음 | < 150 ms | PASS (측정 계속) |
| 스크롤 중 FPS | 85 ~ 120 (120Hz 디스플레이, 7초 프로그램 스크롤 표본 8개) | 60 | PASS |

LCP 요소는 인트로 제목(텍스트). render delay 374ms 는 hydration + Pretendard subset 폰트 swap. 네트워크가 느린 환경에서는 폰트 CSS(92 @font-face) 가 render-blocking 이 된다 → `font-display: swap` 으로 텍스트는 먼저 그려진다.

## Lighthouse (desktop, navigation)

| 카테고리 | 점수 |
|---|---|
| Accessibility | 96 → 배지·주황 버튼 대비 수정 (`--orange-text #b53d07`, `--green-text`, `--blue-text`) → **100** |
| Best Practices | 100 (중간에 96 으로 떨어진 적 있음 — 재빌드 후 옛 서버가 살아 있어 청크 500. 포트 기준으로 서버를 죽이고 재시작해 해결) |
| SEO | 100 |

## 번들

| 청크 | gzip |
|---|---|
| Three.js + R3F + drei (동적 import, 첫 화면 뒤 로드) | 258 KB |
| Next/React 런타임 | 72 KB |
| 앱 코드 + GSAP + zustand | ~100 KB (여러 청크) |
| Kenney GLB 23개 | 316 KB (Suspense, 첫 화면 뒤) |
| 아잉 클립 | 230 KB ~ 1.1 MB / 클립 (사용 섹션 직전에 캐시 예열) |

## 렌더 비용 통제

- `frameloop="demand"`: 스크롤·포인터·상태 변경 때만 렌더. 카메라가 목표에 닿으면 렌더 중단 → 정지 시 GPU 0
- 그림자 맵 1개(2048), 모바일은 그림자 없음 · dpr 1
- 모니터/포스터/바닥 텍스처는 캔버스에서 한 번 그림. 모니터는 섹션·단계 바뀔 때만 다시 그림
- 아잉: 동시에 decode 되는 video 는 최대 2개(crossfade 중), 평시 1개. 가운데 클립은 880×720 crop
- 60fps 값(`progress.*`) 은 React state 를 거치지 않음. 임계값을 지날 때만 setState

## CLS 0.237 → 0.015

전체 스크롤 중 누적 CLS 를 페이지 안에서 재보니 0.237 이었다. 원인 둘:
1. sticky stage 가 `align-items: center` 라서 단계에 따라 패널 높이가 바뀌면(ZIVO 숫자→슬라이더, 투어 카드 교체) 패널 전체가 다시 가운데로 이동 → 큰 shift. → `align-items: start` 로 위 모서리를 고정 (내용 높이가 변하지 않는 intro/result 만 center).
2. 아잉 컨테이너의 `height/width` 를 섹션마다 바꾸며 transition → layout. → 컨테이너 크기를 400px 로 고정하고 `transform: scale()` 로만 조절, 말풍선은 역스케일. 앵커 모드의 매 프레임 갱신도 transform 만 건드린다.

남은 0.015 는 ZIVO 숫자 카드가 한 줄로 줄어드는 순간(0.007 × 2) 이다.

## 발견한 비용과 판단

| 항목 | 값 | 판단 |
|---|---|---|
| ScrollTrigger 초기 측정 forced reflow | 시작 시 1회 ~100 ms (트리거 17개) | 로드 직후 한 번이라 유지. 트리거 수를 줄이는 것보다 코드 단순함이 낫다고 판단 |
| 3D 청크 258 KB | 첫 화면 LCP 에 포함되지 않음 (dynamic import) | 유지 |
| HEVC MOV 11개 | Safari 전용, 다른 브라우저는 요청하지 않음 | 유지 |
| 인트로 enter 클립 1.06 MB | 첫 화면에서 바로 재생 | crf 34 유지. `canplaythrough` 후 재생하므로 끊김 대신 잠깐 포스터 |

## 모바일 (390×844 에뮬레이션)

- 3D 유지(dpr 1, 그림자 없음), 세로 화면은 fov 를 넓혀 같은 물건이 들어오게 함
- 아잉은 작게(≤150px), 고치는 과정 섹션에서는 숨김 (터미널·단계가 화면을 다 씀)
- `saveData` 이면 3D 를 켜지 않고 클립 예열도 하지 않음
