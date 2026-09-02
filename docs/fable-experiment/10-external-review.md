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

