# 09 · Final Review — 7차 자기 검수

spec §22 순서대로. "문제가 발견되면 보고만 하지 않는다. 직접 수정하고 다시 실행한다."

## 1차 · Architecture — PASS

- `experience/` 아래 state · timeline · mascot · scene · sections · content 로 분리. 인터랙션 로직이 섹션 컴포넌트에 흩어지지 않고, 섹션은 `useSteps` / `useSectionFrame` / `cueAing` 세 가지 훅·이벤트만 쓴다.
- 60fps 값은 `progress` 객체(모듈 스코프)에, 이산 상태는 zustand 에. React 재렌더는 임계값을 지날 때만.
- 카메라·연출이 스크롤 위치의 순수 함수 → 역방향·빠른 스크롤에 강하다 (3차에서 확인).

## 2차 · Visual — PASS (수정 12건)

`07-browser-test.md` 표 참조. 주요 수정: 원시 도형 → 실제 가구, 패널 도입, 카메라 재구성, 포스터 프레임 z, 벽 보드 z-fight, 뷰포트 초과 패널 3곳.

## 3차 · Interaction — PASS

프로덕션 빌드에서 자동화 검증:
- 시작 → 경력 → 인트로 → 고치는 과정 → ZIVO 순서로 점프한 뒤 아잉 상태: point → idle → type → idle. 각 시점에 활성 `<video>` 하나만 opacity 1, 나머지 버퍼는 src 비움.
- 맨 아래에서 맨 위까지 1.5초 역방향 스크롤 후 3초: 섹션 = 시작, 아잉 = idle.
- 처음엔 실패했다: 빠른 역방향 뒤 `02_point` 가 인트로에서 재생되고 빈 버퍼가 보이는 상태가 나왔다. 원인 둘 — (1) 이전 버퍼 정리 타이머가 새 클립을 로딩 중인 버퍼를 비움, (2) 인접 섹션의 단계 변화가 섹션과 무관하게 `cueAing` 을 보냄. 정리 타이머를 "지금 비활성이고 로딩 중이 아닌 버퍼만" 비우도록 바꾸고, cue 에 섹션을 붙여 활성 섹션이 아니면 무시하게 고쳤다. 재실행 → 통과.

## 4차 · Responsive — PASS

- 1440 · 1280 · 1024 데스크톱: 콘텐츠 열 620px + 3D. 1024 에서는 패널이 화면의 60% 를 차지하지만 3D 초점 물건은 오른쪽 40% 안에 들어온다.
- 390 · 375 · 430 모바일: 패널 전폭, 3D 는 세로 fov 보정, 아잉 ≤150px, 고치는 과정에서는 아잉 숨김. 터치 타깃 44px 이상 (`button, a.btn { min-height: 44px }`, 슬라이더 높이 44px).

## 5차 · Performance — PASS (trade-off 1)

`06-performance.md`. LCP 385ms · CLS 0 · 스크롤 FPS 85~120 · Lighthouse BP/SEO 100.
Trade-off: 3D 청크를 첫 화면 뒤에 받아 방이 ~0.5초 뒤 페이드인한다. 첫 화면 LCP 를 지키는 쪽을 택했다.

## 6차 · Accessibility — PASS

- Lighthouse 접근성 96 → 배지·강조 글자·주황 버튼 대비 4.5:1 이상으로 수정 (`--green-text` `--orange-text` `--blue-text`) → 재측정 **100** (Best Practices 100 · SEO 100).
- 키보드: 시작 버튼 → 섹션 dot nav(a11y label) → 정거장 탭(role=tablist) → 슬라이더(aria-valuetext) → 링크·버튼. 아잉 레이어는 `aria-hidden`, 3D 캔버스도 `aria-hidden`.
- 터미널은 `role=log aria-live=polite`, 카운트업 숫자는 `sr-only` 로 최종값 제공.
- `prefers-reduced-motion`: 영상 대신 정지 포스터, 카메라 즉시 이동, 포인터 반응 0, 스크롤 이동 `auto`. `?reduced=1` 로 강제 확인.

## 7차 · Code — PASS

- `bunx tsc --noEmit` 0 에러, `next build` 성공(정적 프리렌더), 콘솔 error 0 · warning 0 (three r182 로 Clock deprecation 경고까지 제거).
- 실패 경로: `?no3d=1`(정적 배경) · `?novideo=1`(WebP) · `?reduced=1` 모두 콘솔 깨끗함. WebGL context lost 는 3초 대기 후 정적 배경.
- 남은 것: HEVC MOV 는 ffmpeg 디코드로 알파를 확인했지만 실제 Safari 재생은 이 환경(Chrome DevTools MCP)에서 못 봤다. `.mov` 가 안 되면 WebP 로 떨어지는 경로는 코드로 보장된다.

## 최종 보드

```
Architecture — PASS
Interaction — PASS
Three.js — IMPROVED
Video Integration — PASS
Performance — TRADE-OFF
Responsive — PASS
Self Review — PASS
```

## 역할 분담 (2차 라운드)

- 사용자 캡처 피드백(말풍선 잘림, 아잉 머리만 보임) → Fable 5.1 이 원인 분석·수정.
- 섹션별 스크린샷 저장, 모바일·짧은 세로 뷰포트 CSS 축약 → Opus 5 서브에이전트에 위임(허용 파일·검증 스크립트 명시), 결과 diff 는 Fable 5.1 이 검토·승인.
- 외부 냉정 리뷰 → Codex CLI (GPT-5.6 Sol, read-only) 에 코드 + 스크린샷을 주고 받음 (`scripts/review/`). 결과와 반영 내역은 `10-external-review.md`.

## Higgsfield 사용

68.5 / 100 크레딧. 3D 오브젝트 생성(multi_image_to_3d)은 비용 추정이 지원되지 않아 남은 예산 안에서 확정할 수 없었고, Kenney CC0 모델이 요구(실제 가구)를 충족해 쓰지 않았다.
