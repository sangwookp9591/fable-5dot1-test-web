# 10 · External Review — GPT-5.6 Sol (Codex CLI, read-only)

실행: `scripts/review/codex-review.sh scripts/review/design-review-prompt.md` (1차: 코드·문서만, 스크린샷 없이). 아래는 리뷰 원문. 반영 여부와 판단은 맨 아래 "반영 내역" 참조.

---

총점 **4.1/10**. 현재 결과물은 ‘박상욱의 포트폴리오’보다 ‘Fable 5.1로 만든 인터랙티브 실험’으로 먼저 읽힌다.  
첫 화면은 이름·직무·대표 성과보다 분위기와 설명이 먼저 나오므로 3초 전달에 실패한다.  
전체 1,820svh의 스크롤과 반복적인 등장 효과는 채용 담당자가 정보를 찾는 비용을 과도하게 높인다.  
`Code — PASS` 자기 평가는 현재 `bun run lint` 9 errors/4 warnings 및 누락된 스크린샷과 충돌한다.  
현재 체크아웃에 `docs/fable-experiment/screens/`가 없고 브라우저 호출도 차단되어, 시각 평가는 코드·에셋 기준의 잠정 판정이다.

| 항목 | 점수 |
|---|---:|
| 첫 인상 3초 | 4.0 |
| 시각 디자인 | 4.5 |
| 인터랙션의 이유 | 3.5 |
| 스크롤 경험 | 3.0 |
| 아잉 오버레이 | 5.0 |
| Three.js | 5.0 |
| 접근성·반응형 | 4.0 |
| 코드 품질 | 3.0 |
| 포트폴리오 설득력 | 3.0 |

## 이슈 목록

### 1. [High] Hero에서 사람과 대표 결과가 늦게 나온다

- 문제: 제목은 누구에게나 적용 가능한 질문이고, 이름·직무는 패널 맨 아래 13px 문장에 있다.
- 근거: [portfolio.ts](/Users/iron/Project/psw/fable-5.1-web/experience/content/portfolio.ts:21), [Intro.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Intro.tsx:21), tone rules의 3초 기준 [ai-ng-tone-rules.md](/Users/iron/Project/psw/fable-5.1-web/ai-ng-tone-rules.md:223).
- 수정: H1에 `박상욱`과 실제 역할을 넣고, 바로 아래에 `14개 언어 서비스 운영 · 이용자 웹부터 서버까지`처럼 검증 가능한 대표 범위를 한 줄로 제시한다. CTA도 `대표 프로젝트 보기`로 바꾼다.

### 2. [High] 개발자보다 AI 제작 도구가 주인공이다

- 문제: 사이트 안에서 Claude·Fable·Higgsfield 제작 사실을 반복해 실제 개발자의 판단과 기여가 묻힌다.
- 근거: [portfolio.ts](/Users/iron/Project/psw/fable-5.1-web/experience/content/portfolio.ts:158), [Result.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Result.tsx:43), [README.md](/Users/iron/Project/psw/fable-5.1-web/README.md:3).
- 수정: 공개 화면에서는 도구명을 빼고 박상욱이 정한 요구·검수·수정 내용을 보여준다. 모델과 생성 파이프라인은 README나 별도 제작기로 이동한다.

### 3. [High] 핵심 성과가 숫자와 재현 화면뿐이라 검증이 어렵다

- 문제: 440 PR, 157개 화면, 결제 테스트 10회가 나오지만 역할 범위·성과 근거·해당 프로젝트 링크가 함께 나오지 않는다.
- 근거: [portfolio.ts](/Users/iron/Project/psw/fable-5.1-web/experience/content/portfolio.ts:47), 재현 터미널 [portfolio.ts](/Users/iron/Project/psw/fable-5.1-web/experience/content/portfolio.ts:164), 링크가 없는 투어 항목 [StudioTour.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/StudioTour.tsx:30).
- 수정: 프로젝트마다 `상황 → 담당 범위 → 판단 → 달라진 점 → 확인 링크`를 한 세트로 제공한다. 비공개 작업이면 공개 가능한 캡처나 익명화된 설계 문서로 대체한다.

### 4. [High] 1,820svh는 60초 채용 검토에 맞지 않는다

- 문제: 모바일에서는 점 내비게이션까지 사라져 연락처에 도달하려면 약 18개 화면을 통과해야 한다.
- 근거: 섹션 길이 합계 1,820vh [sections.ts](/Users/iron/Project/psw/fable-5.1-web/experience/timeline/sections.ts:17), 모바일 내비게이션 제거 [section.css](/Users/iron/Project/psw/fable-5.1-web/experience/sections/section.css:232), 연락처는 마지막 [Result.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Result.tsx:34).
- 수정: Career·AI·Review·Result는 일반 문서 흐름으로 바꾸고, sticky는 WorkLoop와 Studio에만 남긴다. 모바일에는 고정된 `프로젝트·경력·연락` 바로가기를 둔다.

### 5. [High] ZIVO 슬라이더는 역방향 스크롤에서 이전 상태로 돌아가지 않는다

- 문제: 사용자가 값을 올리면 `Math.max(userT, scrollT)` 때문에 아래 값으로 드래그하거나 위로 스크롤해도 상태가 돌아가지 않는다.
- 근거: [Zivo.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Zivo.tsx:14), 값 결정 [Zivo.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Zivo.tsx:34), 문서의 순수 함수 주장 [03-interaction-map.md](/Users/iron/Project/psw/fable-5.1-web/docs/fable-experiment/03-interaction-map.md:14).
- 수정: 스크롤과 사용자 입력 중 하나만 값의 소유자로 둔다. 가장 단순한 해결은 슬라이더를 독립 입력으로 만들고 스크롤 연동을 삭제하는 것이다.

### 6. [High] 자기 검수의 완료 판정이 실제 저장소 상태와 충돌한다

- 문제: `Code — PASS`라고 적었지만 현재 `bun run lint`는 9 errors/4 warnings로 실패한다. 스크린샷 폴더도 Git 기준 0개다.
- 근거: 완료 주장 [09-final-review.md](/Users/iron/Project/psw/fable-5.1-web/docs/fable-experiment/09-final-review.md:39), 요구된 캡처 범위 [00-goal.md](/Users/iron/Project/psw/fable-5.1-web/docs/fable-experiment/00-goal.md:18), lint 스크립트 [package.json](/Users/iron/Project/psw/fable-5.1-web/package.json:5).
- 수정: `tsc + lint + build + 브라우저 시나리오`를 하나의 검증 명령으로 묶고 모두 성공한 결과만 기록한다. 화면 증거도 저장소에 버전 관리한다.

### 7. [High] reduced-motion이 동등한 콘텐츠 경로를 제공하지 않는다

- 문제: 영상과 CSS 전환만 줄고 180~320vh sticky 길이와 단계별 숨김은 그대로다.
- 근거: 능력 감지 [capabilities.ts](/Users/iron/Project/psw/fable-5.1-web/experience/performance/capabilities.ts:20), 스크롤 단계 [useSectionProgress.ts](/Users/iron/Project/psw/fable-5.1-web/experience/timeline/useSectionProgress.ts:30), 스펙의 동일 접근 요구 [fable-5.1-interactive-web-spec.md](/Users/iron/Project/psw/fable-5.1-web/fable-5.1-interactive-web-spec.md:733).
- 수정: reduced-motion에서는 모든 섹션을 100vh 이하 일반 흐름으로 만들고 숫자·경력·단계는 최종 상태로 즉시 표시한다.

### 8. [High] 공개 포트폴리오의 자기평가 보드와 실시간 지표는 설득이 아니라 자기채점이다

- 문제: PASS 배지와 방문자 기기의 FPS·LCP는 개발자의 실제 업무 성과를 설명하지 못한다.
- 근거: 하드코딩된 판정 [Review.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Review.tsx:10), 실시간 지표 [Review.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Review.tsx:60), 지속 rAF 측정 [useLiveVitals.ts](/Users/iron/Project/psw/fable-5.1-web/experience/performance/useLiveVitals.ts:45).
- 수정: Review 섹션은 삭제하고 `제작·검수 기록` 링크 하나로 대체한다. 실제 화면에는 프로젝트 결과와 본인 기여만 남긴다.

### 9. [High] 모바일 WorkLoop에서 아잉은 숨고 말풍선과 영상 처리는 남는다

- 문제: 캐릭터 opacity만 0이지만 대사는 별도 형제로 렌더되고, 반복 영상 decode도 계속된다.
- 근거: 모바일 loop 숨김 [AingController.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/mascot/AingController.tsx:22), 단계 대사 호출 [WorkLoop.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/WorkLoop.tsx:28), 말풍선 독립 렌더 [AingOverlay.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/mascot/AingOverlay.tsx:215).
- 수정: `hidden`이면 영상 재생·말풍선·예열을 전부 중단한다. 모바일 WorkLoop는 최종 결과를 한 화면에 정적으로 제시한다.

### 10. [High] 복잡한 순수 함수와 상태 전환에 실행 가능한 테스트가 없다

- 문제: 카메라 보간, 역스크롤, dual-buffer race, 사용자 슬라이더 우선순위에 회귀 검사가 없다.
- 근거: 테스트 스크립트가 없는 [package.json](/Users/iron/Project/psw/fable-5.1-web/package.json:5), 카메라 로직 [camera.ts](/Users/iron/Project/psw/fable-5.1-web/experience/scene/camera.ts:31), 영상 전환 [AingOverlay.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/mascot/AingOverlay.tsx:54).
- 수정: `resolveCamera`, ZIVO 값 전환, 아잉 상태 전환의 최소 단위 테스트와 빠른/역방향/reduced-motion Playwright 시나리오를 추가한다.

### 11. [Med] 아잉과 방의 조형 언어가 서로 다르다

- 문제: 아잉은 광택·굵은 외곽선·세부 회로가 있는 생성형 캐릭터이고, 방은 Kenney 저폴리 가구와 절차적 텍스처다.
- 근거: 실제 [rest.png](/Users/iron/Project/psw/fable-5.1-web/public/aing/rest.png), stock 모델 구성 [Model.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/Model.tsx:9), 방 재질 [Room.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/Room.tsx:21).
- 수정: 아잉의 광택과 회로 디테일을 줄이고 방과 같은 평면 색·따뜻한 그림자로 맞춘다. 크로마키 가장자리도 실제 배경 위에서 다시 검사한다.

### 12. [Med] 반투명 패널이 3D를 대부분 가리면서 렌더 비용은 그대로 지불한다

- 문제: 패널은 최대 620px, 불투명도 88%와 blur 10px다. 모바일에서는 전폭 패널 뒤에서도 전체 3D가 렌더된다.
- 근거: [section.css](/Users/iron/Project/psw/fable-5.1-web/experience/sections/section.css:59), 패널 스타일 [section.css](/Users/iron/Project/psw/fable-5.1-web/experience/sections/section.css:63), 모바일도 Canvas 유지 [StudioScene.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/StudioScene.tsx:116).
- 수정: 모바일은 정적 방 이미지로 대체한다. 데스크톱에서는 패널 폭과 내용을 줄여 3D 초점 물건이 실제로 노출되게 한다.

### 13. [Med] 경력·카운트업·AI 카드 인터랙션은 읽기를 개선하지 않는다

- 문제: 스크롤해야 경력 행이 밝아지고 숫자가 올라가며 카드가 나타나지만 정보 자체는 바뀌지 않는다.
- 근거: 경력 180vh [Career.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Career.tsx:7), 카운트업 [Zivo.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Zivo.tsx:19), AI reveal [Ai.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Ai.tsx:7).
- 수정: 세 효과를 삭제하고 처음부터 정보를 표시한다. 인터랙션은 원인과 결과를 직접 비교하는 WorkLoop·Studio에만 남긴다.

### 14. [Med] 스튜디오의 TV 타일과 서버 LED가 프로젝트 내용을 대신하지 못한다

- 문제: 추상 타일 점등과 서버 블록 분리는 장식이며 실제 백오피스나 구조 변경을 보여주지 않는다.
- 근거: [Room.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/Room.tsx:139), 서버 애니메이션 [Room.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/Room.tsx:168), 투어 카드 [StudioTour.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/StudioTour.tsx:69).
- 수정: 모니터·TV 텍스처에 실제 프로젝트 캡처를 넣고, 클릭하면 해당 사례 설명이나 공개 화면으로 이동하게 한다.

### 15. [Med] Safari fallback 판정은 알파 재생 성공을 보장하지 않는다

- 문제: `canPlayType(hvc1)`은 HEVC 코덱 재생만 확인한다. 알파가 빠진 채 정상 재생되면 `error`가 없어 WebP로 떨어지지 않는다.
- 근거: [capabilities.ts](/Users/iron/Project/psw/fable-5.1-web/experience/performance/capabilities.ts:42), 오류 기반 fallback [AingOverlay.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/mascot/AingOverlay.tsx:100), 실제 Safari 미검증 기록 [09-final-review.md](/Users/iron/Project/psw/fable-5.1-web/docs/fable-experiment/09-final-review.md:43).
- 수정: 실제 Safari 버전별 검증 전에는 WebP를 안전 경로로 둔다. HEVC를 유지한다면 첫 프레임 알파 픽셀 검사를 추가한다.

### 16. [Med] `canplaythrough` 단일 이벤트는 느린 네트워크에서 무기한 포스터로 남을 수 있다

- 문제: 브라우저는 `canplaythrough` 발생을 보장하지 않는다. timeout이나 `loadeddata` 대체 경로가 없다.
- 근거: 이벤트 등록 [AingOverlay.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/mascot/AingOverlay.tsx:89), 전환 조건 [AingOverlay.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/mascot/AingOverlay.tsx:112).
- 수정: `loadeddata/canplay + requestVideoFrameCallback`으로 시작하고, 제한 시간 안에 프레임이 없으면 WebP로 전환한다.

### 17. [Med] Three.js 동적 import 실패는 현재 ErrorBoundary 범위 밖이다

- 문제: Canvas 내부 오류는 잡지만 `StudioScene` 청크 자체의 로드 실패는 내부 `SceneBoundary`가 잡을 수 없다.
- 근거: 동적 import [Experience.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/Experience.tsx:20), 경계 위치 [StudioScene.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/StudioScene.tsx:127).
- 수정: dynamic 컴포넌트 바깥에 경계를 두고 청크 오류 시 `sceneFailed`를 설정해 정적 배경으로 전환한다.

### 18. [Med] demand 모드와 감쇠 애니메이션의 책임이 분리되어 있지 않다

- 문제: WallBoard·TV·ServerRack은 `useFrame`에서 damp하지만 스스로 다음 프레임을 요청하지 않는다. reduced-motion에서 CameraRig가 즉시 이동하면 중간 상태로 멈출 수 있다.
- 근거: [Room.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/Room.tsx:101), [Room.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/Room.tsx:147), CameraRig invalidate 조건 [StudioScene.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/StudioScene.tsx:108).
- 수정: reduced-motion에서는 오브젝트도 즉시 목표값으로 설정한다. 일반 모드에서는 감쇠가 끝날 때까지 해당 컴포넌트가 `invalidate()`를 요청한다.

### 19. [Med] 보이지 않는 섹션 내비게이션이 키보드 포커스를 받는다

- 문제: 시작 전 nav는 opacity 0일 뿐 DOM과 탭 순서에 남아 있어 보이지 않는 링크에 포커스가 이동한다.
- 근거: [SectionNav.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/SectionNav.tsx:9), nav 링크 [SectionNav.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/SectionNav.tsx:12).
- 수정: 숨김 상태에서는 `hidden`/`inert`로 탭 순서에서 제외하거나 처음부터 표시한다.

### 20. [Med] hover·tablist·터치 타깃 접근성이 완료되지 않았다

- 문제: 경력 상세는 포커스 가능한 자식이 없어 키보드로 열리지 않고, tour tablist에는 방향키·`aria-controls`가 없다. 버튼 CSS는 36px로 44px 기준과도 충돌한다.
- 근거: [blocks.css](/Users/iron/Project/psw/fable-5.1-web/experience/sections/blocks.css:26), [StudioTour.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/StudioTour.tsx:73), 버튼 높이 [blocks.css](/Users/iron/Project/psw/fable-5.1-web/experience/sections/blocks.css:107).
- 수정: 경력 상세는 항상 표시한다. 투어는 일반 버튼 그룹으로 단순화하거나 완전한 ARIA tabs 키보드 동작을 구현한다.

### 21. [Med] tone rules와 충돌하는 영어·직무 jargon이 많다

- 문제: `Hello · This is what I built`, `Career at a glance`, `Frontend 중심 Full-stack`, `AI/AX`, `Self review`가 첫 문장부터 나온다.
- 근거: [portfolio.ts](/Users/iron/Project/psw/fable-5.1-web/experience/content/portfolio.ts:6), [portfolio.ts](/Users/iron/Project/psw/fable-5.1-web/experience/content/portfolio.ts:34), [Review.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/sections/Review.tsx:46), 기술 이름 후순위 원칙 [ai-ng-tone-rules.md](/Users/iron/Project/psw/fable-5.1-web/ai-ng-tone-rules.md:171).
- 수정: `화면을 중심으로 서버와 배포까지 맡았습니다`, `경력`, `이 사이트를 확인한 결과`처럼 실제 한국어 업무 표현으로 바꾼다.

### 22. [Low] 죽은 상태와 생성 흔적이 남아 있다

- 문제: `soundOn`, `toggleSound`, `wait`, `progress.velocity`, `scope`, 사용하지 않는 `started`, 항상 null인 JSX가 남아 있다.
- 근거: [experience-store.ts](/Users/iron/Project/psw/fable-5.1-web/experience/state/experience-store.ts:29), [AingController.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/mascot/AingController.tsx:48), [Room.tsx](/Users/iron/Project/psw/fable-5.1-web/experience/scene/Room.tsx:369).
- 수정: 현재 사용처가 없는 항목은 삭제한다. 예정 기능을 위한 상태는 필요해지는 변경에서 다시 추가한다.

### 23. [Low] 아잉 생성 스크립트가 부분 성공을 정상 완료처럼 취급할 수 있다

- 문제: WebM 하나만 있으면 MOV·PNG가 없어도 건너뛰며, 잘못된 JSON은 `pending`으로 숨긴다. `generate.sh`도 background job 성공을 기다리지 않는다.
- 근거: [process_all.sh](/Users/iron/Project/psw/fable-5.1-web/scripts/aing/process_all.sh:6), JSON 예외 처리 [process_all.sh](/Users/iron/Project/psw/fable-5.1-web/scripts/aing/process_all.sh:9), [generate.sh](/Users/iron/Project/psw/fable-5.1-web/scripts/aing/generate.sh:14).
- 수정: 세 산출물을 모두 검사하고 malformed/failed 상태는 non-zero 종료한다. PID별 `wait` 결과도 수집한다.

환경 메모: Vercel CLI가 `59.10.0`으로 뒤처져 있다. 배포 작업 전 `npm i -g vercel@latest` 또는 `pnpm add -g vercel@latest`로 `59.11.2` 이상을 사용하는 편이 안전하다.

## 지금 당장 고쳐야 할 5개

1. Hero를 `박상욱 + 대표 역할 + 대표 결과 + 프로젝트 CTA` 구조로 다시 쓴다.
2. Review/PASS/실시간 지표 섹션을 제거하고 전체 스크롤을 절반 이하로 줄인다.
3. ZIVO의 `Math.max(userT, scrollT)` 이중 상태를 없애 역스크롤을 복구한다.
4. lint를 통과시키고, 누락된 화면 캡처와 최소 회귀 테스트를 검증 절차에 넣는다.
5. reduced-motion·모바일에서 sticky/3D/숨은 영상 decode를 끄고 정적 콘텐츠를 바로 보여준다.


---

## 반영 내역 (Fable 5.1 판단)

원칙: 버그·접근성·견고성은 그대로 반영. "포트폴리오라면 빼라" 류는 이 프로젝트의 전제(spec 이 요구한 검수·결과 보드, 사용자가 준 마스코트) 와 충돌하면 근거를 남기고 유지.

| # | 판정 | 조치 |
|---|---|---|
| 1 Hero 에서 사람·대표 결과가 늦다 | 반영 | eyebrow 에 이름, H1 아래 대표 범위 한 줄, 이름 줄을 한국어 역할 설명으로 (Opus 위임) |
| 2 AI 도구가 주인공 | 부분 반영 | 화면 안 도구 언급은 AI 섹션의 "이 사이트도 그렇게 만들었습니다" 한 곳과 결과 각주 한 줄만. 사용자의 AI/AX 정체성이라 완전히 빼지 않음 |
| 3 성과 검증 링크 | 부분 반영 | 링크 없는 투어 카드(서버·노트북)에 포트폴리오 문서 링크. 비공개 프로젝트는 공개 캡처가 없어 숫자·설명 유지 |
| 4 1,820svh · 모바일 내비 없음 · 연락처가 마지막 | 반영 | 섹션 길이 합 1,820 → 1,380svh. 상시 연락 바(이름·메일·GitHub·처음으로) 추가 |
| 5 ZIVO 슬라이더 역스크롤 미복구 | 반영 (버그) | 드래그 시점의 scroll 값을 기억하고 스크롤이 0.03 이상 움직이면 소유권을 스크롤로 |
| 6 Code PASS vs lint 실패 | 반영 | lint 9→0 (React Compiler 규칙: ref 갱신은 effect 로, 섹션 상태는 store 구독으로, three.js mutable 객체는 사유를 적은 disable 3곳), `bun run check` = tsc + lint + test |
| 7 reduced-motion 동등 접근 | 반영 | 단계 즉시 최종 표시, 숫자 최종값, sticky 해제(`[data-reduced]`) |
| 8 자기 검수 보드·실시간 지표 삭제 | 유지 | spec §22·§25 가 명시한 산출물. 포트폴리오 서사("다 만들었다고 끝이 아닙니다")와도 연결. 길이는 160→130svh 로 축소 |
| 9 모바일 loop 에서 숨긴 아잉의 영상·말풍선 | 반영 (버그) | hidden 이면 pause + 말풍선 미렌더 |
| 10 테스트 없음 | 반영 | `resolveCamera` 연속성·순수성·투어 도달, `stepFor` 단위 테스트 8개 (bun test) |
| 11 아잉과 방의 조형 언어 | 유지 | 아잉은 사용자가 준 캐릭터. 방은 저폴리 가구 + 부드러운 그림자로 맞춤. 재생성은 예산·정체성 문제로 보류 |
| 12 패널이 3D 를 가림 · 모바일 3D 비용 | 부분 반영 | 모바일 dpr 1·그림자 없음·demand 렌더(정지 시 GPU 0). saveData 는 정적 배경. 정적 이미지 대체는 보류 |
| 13 경력 reveal·카운트업·카드 stagger 삭제 | 유지 | spec §5 "ranking board" 연출. 비용이 거의 없고 reduced-motion 이면 즉시 최종 상태 |
| 14 TV 타일·서버 LED 가 추상적 | 반영 | 실제 ZIVO 백오피스·이용자용 웹 캡처를 3D TV·모니터 텍스처로. 추상 타일 연출은 제거 |
| 15 Safari HEVC 알파 미검증 | 반영 | 첫 프레임 모서리 픽셀 알파 검사 → 불투명이면 즉시 WebP |
| 16 canplaythrough 무한 대기 | 반영 (버그) | 6초 타임아웃: 데이터 있으면 시작, 없으면 WebP |
| 17 3D 청크 로드 실패 미포착 | 반영 (버그) | SceneBoundary 를 dynamic import 바깥으로 |
| 18 demand 모드에서 감쇠 애니메이션 멈춤 | 반영 (버그) | 목표에 못 갔으면 컴포넌트가 invalidate(), reduced-motion 은 즉시 대입 |
| 19 숨긴 nav 가 포커스 받음 | 반영 | hidden 속성 |
| 20 hover 전용 상세·36px 탭 | 반영 | 경력 행 tabIndex, 투어 탭 44px |
| 21 영어 eyebrow | 반영 | 전부 한국어로 |
| 22 죽은 상태 | 반영 | soundOn/toggleSound, velocity, camera 필드 제거 |
| 23 생성 스크립트 부분 성공 | 보류 | 에셋 생성은 끝났고 재실행 계획 없음. README 에 주의 표기 |

시각 디자인 리뷰(스크린샷 첨부 2차)는 아래에 이어 붙인다.

---

## 2차 · 시각 디자인 리뷰 (스크린샷 18장 첨부, GPT-5.6 Sol)

실행: `scripts/review/codex-review.sh scripts/review/visual-review-prompt.md` (코드 미열람, 화면만 평가). 원문:

전체 시각 완성도는 **5.4/10**입니다. 3D 공간보다 반투명 카드와 카드 안의 카드가 더 강해서, 인터랙티브 포트폴리오보다 AI로 만든 발표 자료에 가깝게 보입니다.

| 화면 | 점수(10) | 가장 큰 문제 한 줄 |
|---|---:|---|
| `desktop-1440-intro.jpg` | 6.5 | 제목 다음에 설명과 버튼 3개가 동시에 붙어 행동 우선순위가 흐리고, 큰 패널이 창문과 책상 절반을 가립니다. |
| `desktop-1440-career.jpg` | 5.4 | 타임라인 아래쪽이 패널 투명도와 작은 글씨 때문에 사라지며, 아잉은 노트북 위 장식으로만 보입니다. |
| `desktop-1440-zivo.jpg` | 6.2 | 네 개 숫자 카드가 제목보다 강하고, 3D 모니터와 아잉은 카드 그리드 뒤의 배경 장식으로 밀립니다. |
| `desktop-1440-zivo-slider.jpg` | 4.9 | 제목·숫자·영문 라벨·소제목·URL·슬라이더·비교 카드·버튼까지 한 패널에 몰려 위계가 무너집니다. |
| `desktop-1440-loop.jpg` | 4.7 | 제목 패널, 터미널, 단계 패널, 큰 아잉이 모두 중심을 차지하며 비활성 단계 글씨는 거의 읽히지 않습니다. |
| `desktop-1440-loop-done.jpg` | 4.5 | 성공 증거보다 중앙의 거대한 아잉이 먼저 보이고, 아잉이 터미널과 책상 초점 물건을 가립니다. |
| `desktop-1440-studio-desk.jpg` | 6.6 | 탭·제목·긴 본문·버튼이 하나의 문서 카드처럼 쌓였고, 작은 아잉은 내용과 떨어진 구석 장식입니다. |
| `desktop-1440-studio-tv.jpg` | 6.4 | 벽 화면과 패널은 같은 무게로 경쟁하고, 회색 본문이 작아 3초 안에는 제목 외 내용을 읽기 어렵습니다. |
| `desktop-1440-studio-server.jpg` | 6.3 | 패널이 서버 선반 위를 덮고 내부 흐름도는 너무 작으며, 같은 탭 카드 틀이 반복돼 장면 차이가 약합니다. |
| `desktop-1440-studio-laptop.jpg` | 6.5 | 노트북보다 긴 설명 카드가 먼저 보이고, 마지막 문장과 기능 라벨에는 명확한 행동이 없습니다. |
| `desktop-1440-ai.jpg` | 5.1 | 2×2 카드, 캡슐 4개, 파란 안내 상자가 AI UI 생성기의 전형이며 핵심 행동도 없습니다. |
| `desktop-1440-review.jpg` | 4.6 | 작은 글씨의 검사 카드·배지·수치 카드가 과도하게 쌓여 3D 공간이 의미 없는 배경으로 변합니다. |
| `desktop-1440-result.jpg` | 4.8 | 중앙 제목, 2×3 기술 카드, 설명 4줄, 버튼 4개가 발표 자료처럼 보이고 이메일과 GitHub가 경쟁합니다. |
| `mobile-390-intro.jpg` | 5.7 | 큰 패널이 화면 대부분을 차지하고 세 번째 버튼만 다음 줄로 떨어져 CTA 묶음이 깨집니다. |
| `mobile-390-zivo.jpg` | 5.0 | 패널과 2×2 숫자 카드만 한 화면을 채워 3D 방과 아잉이 콘텐츠가 끝난 뒤 나타나는 장식이 됩니다. |
| `mobile-390-loop.jpg` | 4.0 | 두 개의 긴 패널이 화면을 거의 모두 차지해 3D와 아잉이 사라지고, 흐린 단계 글씨도 읽기 어렵습니다. |
| `mobile-390-studio-desk.jpg` | 5.8 | 네 탭이 첫 줄을 과하게 차지하고 본문과 큰 버튼까지 이어져 세로로 늘인 데스크톱 카드처럼 보입니다. |
| `mobile-390-result.jpg` | 4.4 | 2열 카드 6개와 버튼 4개가 한 패널에 몰리고, 긴 GitHub 버튼이 이메일보다 더 중요한 행동처럼 보입니다. |

## 공통 문제 Top 7

1. **패널이 3D 공간을 먹습니다.**  
   데스크톱 기본 패널은 `560~600px`, 최대 `42vw × 68vh`로 제한하세요. 모바일은 좌우 `16px`, 높이 `620px`를 넘으면 내용을 다음 장면으로 나누세요.

2. **3D 초점 물건이 패널 뒤에 있습니다.**  
   모니터·TV·서버·노트북 주변에 최소 `48px`의 빈 영역을 두고, 화면의 `30%` 이상은 패널과 아잉이 없는 공간으로 남겨야 합니다.

3. **글자 단계가 너무 많습니다.**  
   데스크톱은 라벨 `12/18px`, 제목 `40/48px`, 소제목 `24/32px`, 본문 `16/26px` 네 단계만 쓰세요. 모바일 제목은 `30/38px`, 본문은 `16/26px`로 고정하세요.

4. **반투명 패널 위 회색 글씨가 흐립니다.**  
   패널을 `#F7F4EE` 기준 `92~94%` 불투명도로 올리고, 제목은 `#142038`, 본문은 `#4B5563`, 보조 글씨는 `#667085`보다 연하게 만들지 마세요.

5. **모든 것을 카드와 캡슐로 만듭니다.**  
   바깥 패널 반경 `20px`, 내부 카드 `10~12px`만 사용하세요. ZIVO·AI·검수·결과 화면의 내부 카드 절반은 구분선과 일반 문장으로 바꾸세요.

6. **아잉의 크기와 역할이 화면마다 바뀝니다.**  
   데스크톱 기본 높이 `210~240px`, 첫 화면만 최대 `260px`, 모바일 `130~150px`로 맞추세요. 패널과 최소 `32px` 떨어뜨리고 증거 화면 중앙에는 놓지 마세요.

7. **행동과 장식의 구분이 약합니다.**  
   한 화면에 채운 버튼 1개, 외곽선 버튼 1개만 두고 높이는 데스크톱 `48px`, 모바일 `52px`로 맞추세요. 오른쪽 점 목록과 왼쪽 아래 `N` 버튼은 용도가 드러나지 않으면 삭제하세요.

## 지금 당장 바꿀 5개

1. **긴 패널부터 나누세요.**  
   `zivo-slider`, `loop`, `review`, `result`를 각각 두 장면으로 분리해 3D 물건이 최소 30% 보이게 만드세요.

2. **내부 카드 절반을 지우세요.**  
   숫자·기술·검수 결과는 카드 대신 굵은 숫자, 짧은 문장, 1px 구분선으로 정리하세요.

3. **패널과 글자 색을 고정하세요.**  
   패널 `#F7F4EE/94%`, 제목 `#142038`, 본문 `#4B5563`으로 통일해 배경 무늬가 글자 사이로 비치지 않게 하세요.

4. **아잉 크기를 한 규칙으로 맞추세요.**  
   `loop-done`의 아잉은 약 25% 줄이고, 스튜디오 화면의 작은 아잉은 `210px` 안팎으로 맞춰 내용과 같은 장면에 있게 하세요.

5. **버튼을 화면당 두 개로 줄이세요.**  
   첫 화면은 “바로 보기”만 채우고 GitHub는 외곽선으로, 결과 화면은 “메일 보내기”와 “GitHub”만 남기세요.

평가는 첨부 화면만으로 했습니다. 과거 메모는 방문자용 문장과 마스코트 맥락 확인에만 사용했습니다.


### 반영 내역 (2차)

| 지적 | 판정 | 조치 |
|---|---|---|
| 패널이 3D 를 먹는다 (42vw·68vh 제한, 30% 여백) | 반영 | 데스크톱 패널 `max-width: min(600px, 46vw)`, 긴 패널은 단계로 나눔(ZIVO 2단계는 이미, loop 모바일은 현재 단계만) |
| 글자 단계 4개로 | 반영 | 라벨 12 · 본문 16/26 · 소제목 24 · 제목 40(모바일 30) 로 정리 |
| 패널 92~94% + 글자색 고정 | 반영 | `.panel` 93%, 제목 `#142038`, 본문 `#4B5563`, 보조 `#667085` |
| 카드 안의 카드 | 반영 | 숫자·기술·검수 결과·AI 항목은 카드 대신 굵은 숫자 + 문장 + 1px 구분선 |
| 아잉 크기 규칙 | 반영 | 데스크톱 230px(인트로 260), 모바일 140(짧은 화면 110), 책상 앵커 월드 높이 0.62 → 0.52 |
| 버튼은 채움 1 + 외곽 1 | 반영 | 인트로: 만든 것 보기 + GitHub. 결과: 메일 보내기 + GitHub, 나머지는 텍스트 링크 |
| 오른쪽 점 내비 삭제 | 유지 | 키보드 사용자용 섹션 이동(라벨 hover). 상시 연락 바와 역할이 다름 |
| 왼쪽 아래 N 버튼 | 해당 없음 | Next.js 개발 서버 표시. 프로덕션에는 없음 |
| 아잉과 방의 조형 차이 | 유지 | 1차와 같은 이유 |
