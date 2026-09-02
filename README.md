# AING × 박상욱 — Interactive Portfolio

아잉이 일하는 작은 스튜디오를 스크롤로 둘러보며, 박상욱이 실제로 만든 것들을 방 안의 물건에서 꺼내 보는 인터랙티브 포트폴리오.
`fable-5.1-interactive-web-spec.md` 의 구조·품질 기준과 `ai-ng-tone-rules.md` 의 말투를 따라 Claude Fable 5.1이 만들고 직접 검수했다.

## 실행

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # 정적 내보내기 → out/ (Cloudflare Pages)
bunx serve out     # 빌드 결과 확인 (output: "export" 라 next start 는 쓰지 않는다)
bun run check      # tsc + eslint + bun test
```

검증 보조: `scripts/review/codex-review.sh <prompt.md> <out.md>` 로 Codex CLI(GPT-5.6 Sol, read-only)에 코드·스크린샷 리뷰를 받을 수 있다. 실제로 받은 리뷰와 반영 판정은 `docs/fable-experiment/10-external-review.md`.

- Bun 1.3 · Next.js 16.3 (App Router, Turbopack) · React 19.2
- 정적 내보내기(`output: "export"`). 서버 코드 없음. Cloudflare Pages 에 `out/` 를 올린다. 캐시 규칙은 `public/_headers`

## 사용 기술과 이유


| 기술                                              | 왜                                                                |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| Three.js 0.182 + React Three Fiber 9 + drei 10  | 방 (스튜디오)과 카메라 투어. WebGL. 오브젝트가 30개 남짓이라 WebGPU 는 이점이 없어 쓰지 않음    |
| GSAP ScrollTrigger                              | 섹션별 스크롤 진행도. 네이티브 스크롤 유지, hijacking 없음                           |
| zustand                                         | 섹션·시작 여부 같은 이산 상태. 60fps 값은 `progress` 객체에 직접 기록                 |
| WebM(VP9 alpha) + MOV(HEVC alpha)               | 아잉 오버레이. Safari 는 HEVC, 둘 다 안 되면 애니메이션 WebP                      |
| Kenney Furniture Kit (CC0)                      | 실제 가구 형태의 저용량 GLB (`public/models`, 316KB)                       |
| Pretendard Variable (self-host, dynamic subset) | 한국어 본문. 필요한 유니코드 구간만 내려받음                                        |
| Tailwind v4 (토큰만) + 일반 CSS                      | 디자인 토큰은 `app/globals.css`, 컴포넌트 스타일은 `experience/sections/*.css` |


## Higgsfield 에셋 구조

```
public/screens/          실제 ZIVO 백오피스·이용자용 웹 캡처 (3D TV · 모니터 텍스처)
public/aing/
  rest.png              기준 포즈 (Nano Banana 2 Lite, 1 credit) — 포스터 · 로딩 전 이미지
  00_idle … 10_goodbye  .webm (VP9 alpha) + .mov (HEVC alpha) + .png (첫 프레임)
  fallback/*.webp       원본 애니메이션 WebP 6종 (image/ 폴더)
scripts/aing/
  clips.tsv             클립 11개의 길이 · start/end 프레임 · 프롬프트
  compose_frames.py     기준 포즈를 1280×720 초록 캔버스에 배치
  generate.sh           Kling 3.0 image-to-video 배치 (start+end 프레임 고정)
  process_all.sh        결과 다운로드 → keyout.sh (ffmpeg chromakey → alpha 비디오)
```

사용 크레딧 **68.5 / 100** (Kling 3.0 × 11 = 67.5, Nano Banana 2 Lite × 1). 자세한 판단은 `docs/fable-experiment/04-aing-webm.md`.

## 인터랙션에 쓴 기술 (무엇을 · 왜)

| 기술 | 어디에 | 왜 이걸 썼나 |
|---|---|---|
| CSS `position: sticky` + 긴 wrapper | 모든 섹션 | 스크롤을 빼앗지 않고(hijacking 금지) 한 화면을 고정한 채 내부 연출을 진행 |
| GSAP ScrollTrigger | 섹션별 진행도 `progress.locals[id]` | 리사이즈·역방향에 안전한 스크롤 수학, 화면 중앙 기준 활성 섹션 판정 |
| 모듈 스코프 `progress` 객체 + rAF | 카운트업 숫자, CSS 변수 `--t`, 카메라 | 60fps 값은 React state 를 거치지 않는다. `useSteps` 는 임계값을 지날 때만 setState |
| React Three Fiber `frameloop="demand"` | 3D 스튜디오 | 스크롤·포인터·상태 변경 때만 렌더, 카메라가 멈추면 GPU 0 |
| 카메라 키프레임 + `resolveCamera(timeline)` 순수 함수 | 섹션 이동, 4 정거장 투어 | 어떤 순서로 스크롤해도 같은 위치면 같은 화면 |
| `Vector3.project()` → DOM 앵커 (`anchors.ts`) | 고치는 과정에서 아잉이 책상 뒤에 앉음 | 2D 영상을 3D 좌표에 붙이고 `clip-path` 로 책상 윗면 아래를 가림 |
| CanvasTexture (2D canvas → three) | 모니터 화면, 포스터, 바닥·벽 질감 | 외부 이미지 없이 섹션 내용을 방 안 물건에 반영 |
| Dual `<video>` buffer + `requestVideoFrameCallback` | 아잉 클립 전환 | 새 클립의 첫 프레임이 그려진 뒤에만 opacity 교체 → 검은 프레임·튐 없음 |
| VP9 alpha WebM / HEVC alpha MOV / 애니메이션 WebP | 아잉 오버레이 | 브라우저별 알파 비디오 지원 차이를 순서대로 fallback |
| `transform`-only 이동·크기 (`translate3d` + `scale`) | 아잉 위치·크기, 단계 카드 강조 | layout shift 0, compositor 스레드에서만 처리 (CLS 0.237 → 0.008) |
| `<input type="range">` + 스크롤 연동 | ZIVO 14개 언어 슬라이더 | 스크롤이 먼저 밀고, 사용자가 드래그하면 그 값이 우선 |
| `CustomEvent` 기반 `cueAing()` | 섹션 → 아잉 반응 (놀람·타이핑·에러) | 섹션 컴포넌트가 아잉 구현을 몰라도 신호만 보냄. 활성 섹션이 아니면 무시 |
| PerformanceObserver (LCP · layout-shift · event) + rAF FPS | 검수 섹션 라이브 측정 | 방문자 브라우저에서 실제 값을 보여주고 기준 미달이면 아잉이 반응 |
| `IntersectionObserver` 대신 섹션 인접성 예열 (`fetch cache: force-cache`) | 다음 섹션 클립 | 사용 직전에만 받고 saveData 면 받지 않음 |
| `prefers-reduced-motion` + `?reduced=1 ?novideo=1 ?no3d=1` | 접근성·실패 경로 | 영상은 정지 포스터, 카메라 즉시 이동, 3D 는 정적 배경 |

## Interaction architecture

```
experience/
  Experience.tsx         레이어 조립: 3D 배경(고정) · DOM 섹션 · 아잉 오버레이 · 섹션 nav
  state/                 experience-store (섹션 state machine) · progress (60fps 값)
  timeline/              sections(길이·아잉·카메라) · useScrollTimeline(ScrollTrigger) · useSectionProgress(useSteps/useSectionFrame)
  mascot/                AingOverlay(dual video buffer) · AingController(섹션→상태·위치·대사·앵커) · states · preload
  scene/                 StudioScene · Room(Kenney 모델 + 반응하는 물건) · camera(키프레임, resolveCamera) · Screen(모니터 텍스처) · anchors
  interactions/          usePointer (subtle)
  performance/           capabilities(감지 + ?reduced ?novideo ?no3d 강제) · useLiveVitals
  sections/              Intro · Career · Zivo · WorkLoop · StudioTour · Ai · Review · Result
  content/portfolio.ts   모든 문구 (tone rules 적용)
```

흐름: `INTRO → CAREER → ZIVO → LOOP → STUDIO → AI → REVIEW → RESULT`.
모든 연출은 스크롤 위치의 순수 함수라서 빠르게·거꾸로 스크롤해도 같은 위치면 같은 화면이다. 상세: `docs/fable-experiment/03-interaction-map.md`.

## Performance result

프로덕션 빌드, Chrome DevTools 트레이스 (로컬): LCP 385 ms · CLS 0 · 스크롤 중 85~120 fps · Lighthouse 접근성 100 · Best Practices 100 · SEO 100. 자세한 값과 판단은 `docs/fable-experiment/06-performance.md`.

## 문서

`docs/fable-experiment/00-goal.md` ~ `09-final-review.md`.

## 라이선스 · 크레딧

- 가구 모델: [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit) — CC0 (`public/models/LICENSE-kenney.txt`)
- 폰트: Pretendard — SIL OFL 1.1
- 아잉 캐릭터: 박상욱 (AI-NG). 영상 클립은 Higgsfield (Kling 3.0) 로 생성

