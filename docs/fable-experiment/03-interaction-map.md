# 03 · Interaction Map

## 스크롤 → 상태

네이티브 스크롤 유지. 각 섹션은 `height: N svh` 인 wrapper + `position: sticky` stage.
GSAP ScrollTrigger 가 섹션마다 `progress.locals[id]` (0..1) 을 기록하고, 화면 중앙을 지나는 섹션이 `section` 이 된다.

```
progress.locals[id]  ──→ useSteps(id, thresholds)   → 단계 index (임계값 지날 때만 렌더)
                     ──→ useSectionFrame(id, cb)    → 60fps 콜백 (숫자 카운트업, CSS 변수)
progress.timeline    ──→ resolveCamera()            → 카메라 pos/look/fov (순수 함수)
```

모든 연출이 스크롤 위치의 **순수 함수** 라서 빠르게 넘기거나 거꾸로 올려도 같은 위치면 같은 화면이다.
카메라만 `exp(-dt·5.5)` 감쇠로 따라간다 (reduced-motion 이면 즉시).

## 섹션별 인터랙션

| 섹션 | 길이 | 입력 | 반응 |
|---|---|---|---|
| intro | 100vh | [만든 것 보기] 클릭 | `started` → 모니터 켜짐, career 로 한 번 스크롤, 섹션 dot · 연락 바(이름·메일·GitHub·처음으로) 표시 |
| career | 140vh | 스크롤 12/30/48/66% · 행 hover | 보드 행이 채워짐(DOM + 3D 벽 보드 동기) · hover 시 그 회사에서 한 일 펼침 |
| zivo | 220vh | 스크롤 5~40% · 슬라이더 드래그 | 숫자 카운트업 · 45~90% 에서 쿠키→URL 전환. 드래그하면 그 값이 이기지만, 스크롤이 0.03 이상 움직이면 값의 주인은 다시 스크롤(역방향 복구). 50% 넘으면 아잉 surprise |
| loop | 280vh | 스크롤 28/52/76% | 터미널 내용 · 단계 카드 · 모니터 텍스처 · 아잉 think→review→type→celebrate |
| studio | 260vh | 스크롤 · 정거장 버튼 | 카메라 4 정거장, TV 타일 점등, 서버 랙 분리, 카드 교체. 버튼은 해당 스크롤 위치로 이동 |
| ai | 130vh | 스크롤 15/50% | 카드 stagger, 순서 칩 |
| review | 130vh | 자동 | PerformanceObserver 로 LCP/CLS/INP, rAF 로 FPS 측정. 기준 미달이면 아잉 error + "이건 좀 느린데?" |
| result | 120vh | 스크롤 86% · 버튼 | 아잉 마지막 대사 후 leave 클립, [다시 보기] 는 맨 위로 |

## 포인터

- 램프 point light 가 ±5cm, 카메라 시선이 ±0.06 만 움직인다 (spec §12 subtle)
- 터치 기기 · reduced-motion 이면 0 으로 고정

## 아잉 상태 전이

```
enter(인트로) ─끝─→ idle
섹션 진입 → sectionDefs[id].aing (point / idle / type / think / review / celebrate)
cueAing({state,line}) ← 섹션 컴포넌트 (슬라이더 50%, 단계 변경, 성능 미달)
loop 아닌 클립 끝 → idle
result 86% → "다음엔 더 어려운 걸 시켜보자냥." → leave. 거꾸로 올리면 섹션 effect 가 idle 로 복귀
```

## 외부 리뷰 뒤 바뀐 규칙

- 전체 스크롤 길이 1,820svh → 1,380svh. 연락은 어느 섹션에서든 오른쪽 위 연락 바로.
- reduced-motion: 단계는 항상 최종 상태, 숫자는 최종값, 섹션은 sticky 해제(일반 문서 흐름).
- 아잉 크기 규칙: 데스크톱 230px(인트로 260), 모바일 140(세로 ≤700px 이면 110). 고치는 과정에서는 3D 책상 자리 앵커(월드 0.52m).
- 숨긴 아잉(모바일 loop)은 영상 정지 + 말풍선 없음.
