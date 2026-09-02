# AING × 박상욱 — Interactive Portfolio

아잉이 일하는 작은 스튜디오를 스크롤로 둘러보며, 박상욱이 실제로 만든 것들을 방 안의 물건에서 꺼내 보는 인터랙티브 포트폴리오.
`fable-5.1-interactive-web-spec.md` 의 구조·품질 기준과 `ai-ng-tone-rules.md` 의 말투를 따라 Claude Fable 5.1 이 만들고 직접 검수했다.

## 실행

```bash
bun install
bun run dev        # http://localhost:3000
bun run build && bun run start
```

- Bun 1.3 · Next.js 16.3 (App Router, Turbopack) · React 19.2
- 정적 프리렌더. 서버 코드 없음. 배포는 어떤 Node/Bun 호스팅이든 가능

## 사용 기술과 이유

| 기술 | 왜 |
|---|---|
| Three.js 0.182 + React Three Fiber 9 + drei 10 | 방(스튜디오)과 카메라 투어. WebGL. 오브젝트가 30개 남짓이라 WebGPU 는 이점이 없어 쓰지 않음 |
| GSAP ScrollTrigger | 섹션별 스크롤 진행도. 네이티브 스크롤 유지, hijacking 없음 |
| zustand | 섹션·시작 여부 같은 이산 상태. 60fps 값은 `progress` 객체에 직접 기록 |
| WebM(VP9 alpha) + MOV(HEVC alpha) | 아잉 오버레이. Safari 는 HEVC, 둘 다 안 되면 애니메이션 WebP |
| Kenney Furniture Kit (CC0) | 실제 가구 형태의 저용량 GLB (`public/models`, 316KB) |
| Pretendard Variable (self-host, dynamic subset) | 한국어 본문. 필요한 유니코드 구간만 내려받음 |
| Tailwind v4 (토큰만) + 일반 CSS | 디자인 토큰은 `app/globals.css`, 컴포넌트 스타일은 `experience/sections/*.css` |

## Higgsfield 에셋 구조

```
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
