# Fable 5.1 Interactive Web 성능 테스트 스펙

## Goal

Fable 5.1의 실제 프론트엔드·에이전트 코딩 성능을 테스트하기 위한
고난도 Interactive Web Experience를 처음부터 끝까지 설계하고 구현한다.

이번 작업은 단순 랜딩 페이지 제작이 아니다.

다음을 동시에 검증한다.

- 프로젝트 전체 구조 이해
- UX / Interaction 설계
- React / Next.js 구현 능력
- Three.js / WebGPU 활용 능력
- GSAP 및 Scroll Interaction
- WebM Alpha Video Overlay 합성
- 캐릭터와 DOM / 3D Scene의 자연스러운 연결
- Responsive
- 접근성
- 성능 최적화
- 실패 처리
- 자기 검수
- 실제 브라우저에서 반복 테스트 후 개선

최종 결과물은

> AI가 만든 화려한 데모

가 아니라

> 실제 공개해도 될 만큼 완성도 높은 Interactive Web Experience

여야 한다.

---

## 0. Design Direction

다음 표현은 피한다.

- SF 우주선
- 사이버펑크
- 과도한 네온
- 의미 없는 홀로그램
- 무작위 particle 폭발
- AI 느낌을 내기 위한 푸른 회로판 배경
- 현실과 동떨어진 미래 도시

전체 분위기:

- 사람이 실제로 일할 것 같은 공간
- 현대적인 디자인 스튜디오
- 작은 방송국 / Creative Lab
- 따뜻한 소재
- 실제 가구와 오브젝트
- 자연스러운 조명
- 약간의 장난기
- 정돈된 인터랙션
- 2D 캐릭터가 현실적인 웹 공간 안에 자연스럽게 존재하는 느낌

목표:

> 아잉이 실제로 살고 일하는 작은 디지털 스튜디오

---

## 1. Experience Concept

프로젝트 이름:

# AING × Fable 5.1  
## Interactive Agent Lab

사용자가 웹사이트에 들어오면
Fable 5.1이 하나의 프로젝트를 완성하는 과정을 직접 탐험한다.

단순 스크롤 페이지가 아니라 다음이 서로 연결되어야 한다.

- scroll
- pointer
- click
- drag
- hover
- video
- 3D
- DOM
- character

전체 흐름:

```text
INTRO
↓
Aing 등장
↓
Fable 5.1 테스트 시작
↓
Benchmark
↓
Agent Coding
↓
Interactive Web Test
↓
Three.js Scene
↓
Self Review Loop
↓
Performance
↓
Final Result
```

각 section은 완전히 분리된 페이지처럼 보이지 않고
하나의 공간 안에서 자연스럽게 이동하는 느낌으로 연결한다.

---

## 2. Intro

첫 화면은 설명을 많이 하지 않는다.

작은 현대적인 스튜디오 공간에서 시작한다.

잠시 뒤 WebM Alpha Video로 만든 아잉이 화면 밖에서 들어온다.

예시 대사:

> Fable 5.1, 진짜 그렇게 잘해?

잠깐 멈춘다.

> 그럼 웹 하나 제대로 만들어보자냥.

CTA:

`[테스트 시작]`

테스트 시작 시 책상 위 모니터가 켜지며 experience가 시작된다.

영상이 끝나도 캐릭터가 갑자기 사라지지 않는다.

WebM의 마지막 frame과 DOM / sprite / 3D representation을 자연스럽게 이어준다.

---

## 3. Higgsfield × Aing

아잉 캐릭터 영상 asset은 Higgsfield를 활용한다.

가능하면 Higgsfield MCP / CLI / Skills를 사용한다.

필요 WebM Alpha Overlay:

### 01_intro_walk.webm

- 화면 오른쪽 밖에서 걸어 들어오기
- 주변 살펴보기
- 카메라 바라보기
- 손 흔들기

### 02_point.webm

- 화면 옆 콘텐츠 가리키기

### 03_thinking.webm

- 고민
- 고개 기울이기
- 턱 만지는 느낌

### 04_typing.webm

- 노트북 타이핑
- 잠깐 멈춰 확인
- 다시 타이핑

### 05_waiting.webm

- 처리 중 기다리기
- 꼬리 움직이기

### 06_surprised.webm

- 결과 보고 놀라기

### 07_celebrate.webm

- 성공
- 기뻐서 점프

### 08_review.webm

- 결과물을 유심히 보기
- 고개 좌우로 움직임

### 09_error.webm

- 오류 발견
- 당황

### 10_goodbye.webm

- 마지막 인사
- 화면 밖으로 퇴장

영상 조건:

- transparent background
- WebM alpha
- 24~30fps
- loop 가능한 clip은 seamless loop
- 캐릭터 중심 crop
- 불필요한 빈 영역 최소화
- 짧은 duration
- 동일 캐릭터 consistency 유지
- lighting direction 통일
- camera angle 통일
- 캐릭터 크기 통일
- camera locked
- overlay 용도로 쓰기 좋은 안정된 silhouette

---

## 4. Aing Overlay Engine

재사용 가능한 시스템을 만든다.

예:

```tsx
<AingOverlay
  state="thinking"
  position="right-bottom"
  scale={0.9}
/>
```

지원 state:

```text
idle
enter
point
think
type
wait
surprise
celebrate
review
error
leave
```

상태 전환:

```text
IDLE
↓
section 진입
↓
POINTING
↓
설명 완료
↓
IDLE
```

영상 교체 시 다음 문제가 없어야 한다.

- flash
- black frame
- layout jump
- 갑작스러운 scale 변경
- audio glitch
- decode spike

검토 전략:

- preload
- poster frame
- dual video buffer
- opacity crossfade
- video pooling
- requestVideoFrameCallback
- intersection based loading

사용하지 않는 video는 계속 decode하지 않는다.

모바일에서는 quality를 낮추거나 WebP / sprite fallback을 사용할 수 있다.

---

## 5. Scene — Model Introduction

Fable 5.1을 소개한다.

텍스트 카드 여러 개를 쌓지 않는다.

큰 typography와 interaction을 사용한다.

예:

```text
66
#1 Intelligence
```

pointer를 올리면 주변에 비교 모델이 등장한다.

```text
Opus 5 — 63
GPT-5.6 Sol — 61
Grok 4.6 — 61
```

단순 막대그래프보다
실제 스튜디오 안 ranking board처럼 표현한다.

아잉은 금메달을 들고 등장할 수 있다.

UI를 캐릭터가 가리지 않게 한다.

---

## 6. Scene — Agent Performance

성능 향상을 interactive하게 보여준다.

예:

```text
Terminal Bench Science

Fable 5
24.7%
```

사용자가 slider를 움직이면

```text
Fable 5.1
52.6%
```

으로 바뀐다.

숫자가 단순 fade되는 것보다
실험 보드 / terminal / desk monitor 등 실제 공간과 연결한다.

추가 후보:

- Terminal Bench
- GDPval
- Humanity's Last Exam

한 화면에 graph를 너무 많이 넣지 않는다.

---

## 7. Scene — Agent Work Loop

이번 experience의 핵심.

Fable 5.1이 일을 처리하는 과정을 직접 보여준다.

```text
PLAN
↓
CODE
↓
RUN
↓
CHECK
↓
FIX
↓
RE-RUN
↓
DONE
```

각 단계에서 작은 preview scene이 변한다.

예:

- CODE → 화면 만드는 중
- RUN → browser preview
- CHECK → 버튼 / layout 확인
- FIX → 문제가 있는 부분 수정
- DONE → 완성

아잉 상태:

```text
typing
↓
thinking
↓
review
↓
celebrate
```

fake terminal text를 의미 없이 쌓지 않는다.

실제 프로젝트 상태와 연결할 수 있다면 실제 상태를 사용한다.

---

## 8. Scene — Three.js Challenge

대표 interactive scene을 직접 만든다.

Theme:

# Aing Creative Studio

공간 예:

- 작은 작업실
- 창문
- 책상
- 모니터
- 식물
- 조명
- 선반
- 작은 피규어
- 포스터
- 노트북
- 커피

실제로 존재할 법한 공간이어야 한다.

사용자가 scroll하면 카메라가 공간을 지나간다.

카메라가 이유 없이 자유롭게 날아다니지 않는다.

예:

- 책상 → Agent Coding
- 벽의 화면 → Benchmark
- 노트북 → Web Test
- 아잉 자리 → Character

각 object는 콘텐츠와 연결한다.

---

## 9. Web Tech

최신 기술을 많이 쓰는 것이 목표가 아니다.

각 기술을 적용하기 전에 반드시 묻는다.

> UX 또는 performance에 실제 이점이 있는가?

후보:

- React 19
- Next.js 16
- React Three Fiber
- Three.js
- WebGPU
- WebGL fallback
- GSAP
- ScrollTrigger
- Motion
- CSS Scroll-driven Animations
- View Transition API
- Web Animations API
- requestVideoFrameCallback
- OffscreenCanvas
- Web Workers
- WebCodecs
- IntersectionObserver
- ResizeObserver

필요 없는 기술은 사용하지 않는다.

---

## 10. WebGPU

실제로 이점이 있는 scene을 먼저 찾는다.

예:

- 많은 instance
- particle
- compute based effect
- procedural visual
- high object count

단순 scene이라면 WebGL이 더 적절할 수 있다.

WebGPU를 사용한다면:

```text
WebGPU supported
→ WebGPU renderer

unsupported
→ WebGL fallback
```

지원 여부 때문에 사이트가 깨지면 안 된다.

---

## 11. Interactive Video × 3D

WebM과 Three.js가 따로 노는 느낌을 없앤다.

아잉이 실제 scene에 있는 것처럼 연출한다.

예:

- 책상 뒤로 일부 가려짐
- 모니터 앞에서 가리키기
- camera movement와 perspective 일치
- scene lighting 방향 맞춤

검토 후보:

- CSS mask
- clip-path
- depth illusion
- DOM overlay
- CSS2DRenderer
- video texture

video texture는 alpha 품질과 성능을 비교해서 결정한다.

---

## 12. Pointer Interaction

mouse movement에 화면 전체가 심하게 흔들리는 parallax는 사용하지 않는다.

작은 반응만 사용한다.

예:

- 눈동자가 pointer를 따라감
- 책상 조명이 미세하게 움직임
- 카드 depth가 2~4px 이동
- 아잉이 pointer 방향을 잠깐 바라봄

subtle하게 처리한다.

---

## 13. Scroll Interaction

scroll hijacking 금지.

native scroll 유지.

scroll progress로 다음을 동기화한다.

- camera
- lighting
- text
- WebM state
- DOM
- 3D object

빠르게 scroll해도 animation state가 꼬이지 않아야 한다.

역방향 scroll도 정확히 지원한다.

---

## 14. Micro Interaction

큰 animation보다 작은 detail을 정교하게 만든다.

예:

- button press
- text reveal
- cursor proximity
- panel open
- chart reaction
- object hover
- video expression
- sound toggle
- light change

transition은 대체로 200~500ms 범위에서 빠르게 한다.

사용자가 기다려야 하는 animation은 최소화한다.

---

## 15. Sound

sound는 optional.

자동 재생 금지.

사용자가 켠 경우에만 다음 정도 사용한다.

- keyboard
- paper
- room tone
- UI click
- 작은 캐릭터 효과음

음악보다 공간감 중심으로 사용한다.

---

## 16. Responsive

Desktop experience를 모바일에 그대로 줄이지 않는다.

### Desktop

- 3D
- scroll camera
- Aing WebM overlay
- interactive objects

### Mobile

- DOM 중심
- limited 3D
- short WebM
- touch interaction
- 필요 시 정적 asset fallback

모바일 조건:

- text가 3D에 가려지지 않음
- 44px 이상 touch target
- scroll이 끊기지 않음
- 캐릭터가 너무 크지 않음

---

## 17. Performance

이 프로젝트 자체가 Fable 5.1 성능 테스트이므로
사이트 성능도 결과에 포함한다.

목표:

```text
LCP < 2.0s
CLS < 0.05
INP < 150ms
```

Desktop animation:

```text
가능한 60fps
```

Mobile:

```text
30~60fps 안정적으로 유지
```

측정:

- Web Vitals
- FPS
- long task
- texture memory
- decoded video
- WebM loading
- bundle size
- JS execution
- Three draw calls
- GPU 비용 추정

성능 때문에 효과를 제거해야 한다면 제거한다.

---

## 18. Asset Strategy

### 3D

- glTF / GLB
- Meshopt
- Draco 필요 여부 판단

### Texture

- AVIF
- WebP
- KTX2

### Video

- WebM alpha

### Image

- AVIF
- WebP

### Font

- subset
- preload 최소화

모든 asset을 첫 화면에서 한꺼번에 받지 않는다.

사용 시점 근처에서 load한다.

---

## 19. Loading Experience

0 → 100 progress bar를 기본으로 쓰지 않는다.

기다리는 시간을 작은 콘텐츠로 바꾼다.

예:

> 아잉이 테스트 준비 중...

loading이 빠르면 animation 자체를 skip한다.

---

## 20. Reduced Motion

`prefers-reduced-motion` 지원.

활성화 시:

- camera transition 최소화
- WebM animation 감소
- parallax 제거
- scroll animation 최소화

콘텐츠 접근은 동일해야 한다.

---

## 21. Architecture

interaction 로직을 component마다 흩뿌리지 않는다.

예:

```text
experience/
  scene/
  timeline/
  camera/
  lighting/
  interactions/
  media/
  mascot/
  performance/
```

Aing:

```text
mascot/
  AingOverlay
  AingController
  states
  preload
  transitions
```

Experience state:

```text
INTRO
MODEL
BENCHMARK
AGENT
THREE
REVIEW
PERFORMANCE
RESULT
```

명확한 state machine을 둔다.

---

## 22. Self Review Loop

구현 후 반드시 스스로 검수한다.

```text
1차 architecture review
2차 visual review
3차 interaction review
4차 responsive review
5차 performance review
6차 accessibility review
7차 code review
```

문제가 발견되면 보고만 하지 않는다.

직접 수정하고 다시 실행한다.

최종적으로 문제가 없어질 때까지 반복한다.

---

## 23. Visual QA

각 주요 viewport에서 screenshot을 찍고 비교한다.

Desktop:

- 1440
- 1280
- 1024

Mobile:

- 430
- 390
- 375

찾아야 할 문제:

- overlap
- clipping
- unreadable text
- video crop
- WebM edge artifact
- scene jump
- z-index 문제
- animation flicker
- layout shift

발견 시 수정한다.

---

## 24. Failure Test

반드시 확인한다.

- WebM load 실패
- Three.js load 실패
- WebGPU unsupported
- slow network
- low-memory mobile
- resize
- tab hidden
- rapid scroll
- back-forward navigation
- asset loading failure

한 기능이 실패했다고 전체 사이트가 깨지면 안 된다.

---

## 25. Final Result

마지막 화면:

# Fable 5.1 Test Complete

단순 총점 하나만 보여주지 않는다.

예:

```text
Architecture — PASS
Interaction — PASS
Three.js — IMPROVED
Video Integration — PASS
Performance — TRADE-OFF
Responsive — PASS
Self Review — PASS
```

마지막에 아잉이 등장한다.

예:

> 생각보다 꽤 하는데?

잠시 뒤:

> 다음엔 더 어려운 걸 시켜보자냥.

CTA:

- `[다시 보기]`
- `[소스 보기]`

---

## 26. Evaluation Priority

새로운 기술을 많이 사용했다고 높은 점수를 주지 않는다.

평가 순서:

1. 완성도
2. 사용자 경험
3. interaction의 이유
4. visual consistency
5. 안정성
6. performance
7. 코드 품질
8. 최신 기술 활용

> 멋있기 때문에 넣었다

라는 설명밖에 할 수 없는 효과는 제거한다.

---

## 27. Deliverables

작업 완료 후 다음 문서를 작성한다.

```text
docs/fable-experiment/

00-goal.md
01-audit.md
02-concept.md
03-interaction-map.md
04-aing-webm.md
05-three-architecture.md
06-performance.md
07-browser-test.md
08-before-after.md
09-final-review.md
```

README에 다음을 정리한다.

- 실행 방법
- 사용 기술
- Higgsfield asset 구조
- interaction architecture
- performance result

---

## 28. Completion Condition

코드 작성이 끝났다고 완료가 아니다.

완료 조건:

- 모든 주요 scene 구현
- Aing WebM overlay 실제 동작
- Three.js interaction 동작
- Desktop 검증
- Mobile 검증
- reverse scroll 검증
- reduced-motion 검증
- WebM fallback 검증
- performance 측정
- console error 0
- critical warning 0
- visual regression 검수
- code review
- 최종 self review

위 조건을 모두 만족할 때까지 계속 작업한다.

---

## 29. 추가 원칙

중간에 더 좋은 interaction 아이디어가 발견되면 제안하고 구현할 수 있다.

단 기능을 추가하기 전에 묻는다.

> 이게 사용자의 경험을 실제로 좋아지게 하는가?

NO라면 추가하지 않는다.

가장 중요한 원칙:

> 새 효과 세 개를 추가하는 것보다  
> 필요 없는 효과 하나를 제거해서 더 좋아질 수 있다면 제거를 선택한다.

이 프로젝트는 Fable 5.1이 얼마나 많은 코드를 작성하는지 보는 테스트가 아니다.

**얼마나 오래 고민하고, 직접 확인하고, 잘못된 부분을 다시 고치고, 끝까지 완성도 높은 결과물을 만드는지 보는 테스트다.**
