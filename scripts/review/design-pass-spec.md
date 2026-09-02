# 디자인 패스 스펙 (GPT-5.6 Sol 2차 시각 리뷰 반영)

허용 파일: experience/sections/*.tsx, experience/sections/*.css, experience/content/portfolio.ts, app/globals.css (토큰만 추가).

## 1. 토큰·타이포 (globals.css, section.css)
- 패널: `.panel { background: color-mix(in srgb, #f7f4ee 93%, transparent); }` (기존 88%). blur 유지.
- 글자색 토큰: `--ink: #142038`, 본문 `--body: #4b5563`, 보조 `--muted: #667085` (기존 --muted 대체). `.lead` 는 `--body`.
- 글자 단계 4개만: `.eyebrow 12px` · `.lead 16px/1.6` · `.h-section clamp(22px, 2.4vw, 32px)` · `.h-display clamp(32px, 3.4vw, 48px)`. 모바일: 제목 30px, 본문 16px. 그 외 임의 font-size(13.5, 14.5 …)는 12/14/16 중 하나로 정리.
- 반경: 바깥 패널 20px, 안쪽 요소 10~12px, 알약 버튼만 999px.

## 2. 데스크톱 패널 크기
- `.panel { max-width: min(600px, 46vw) }` (col-left/col-right 폭도 같이).
- 3D 초점 물건이 보이게: 각 섹션 패널 내용은 68vh 를 넘지 않게 정리 (아래 3~6 으로 줄어든다).

## 3. 카드 안의 카드 제거
- ZIVO 숫자 4개: 카드 대신 한 줄 — 굵은 숫자(32px) + 라벨(12px), 항목 사이 1px 구분선(`border-left`), 배경 없음.
- ZIVO 2단계(슬라이더): 축약 숫자판(`data-compact`) 제거, BEFORE/AFTER 비교 카드 2개 제거 → URL 바 + 언어 칩 + 슬라이더 + 캡션 한 줄 `쿠키 1개 주소 → /ko · /en … 14개 URL` 로.
- AI 4카드 → 카드 없이 제목(굵게 16px) + 설명(14px) 2열 리스트, 항목 사이 구분선. 순서 칩 4개 → 한 문장 `직접 써봄 → 비교해봄 → 괜찮으면 공유 → 쓸 곳이 있으면 적용` (굵은 화살표 텍스트).
- 검수 보드 7개: 카드 제거 → 2열 리스트, 각 행 `항목  ······  PASS` 배지(작게), 설명은 12px 회색 한 줄. 측정값 4개는 카드 대신 굵은 숫자 + 라벨 한 줄.
- 결과 보드 6개: 카드 제거 → 2열 정의 목록(dt 12px muted / dd 16px 굵게), 행 사이 구분선.

## 4. 버튼: 화면당 채움 1 + 외곽 1
- 인트로: `만든 것 보기`(채움) + `GitHub`(외곽). `ai-ng.co.kr` 버튼 제거(연락 바에 있음). 높이 48px.
- 결과: `메일 보내기`(채움) + `GitHub`(외곽). `다시 보기` · `이 사이트 소스 보기` 는 아래 작은 텍스트 링크 한 줄로.
- 모바일 버튼 높이 52px, 나란히 2개(줄바꿈 금지).

## 5. 고치는 과정 (loop)
- 왼쪽 패널: 제목 + 리드(16px) + 터미널. 오른쪽 패널: 단계 4개 — 비활성 단계 opacity .45 → 색만 muted, opacity 1 (읽히게).
- 모바일: 단계 목록 대신 현재 단계 1개 카드 + `2 / 4` 표시. 터미널 min-height 96.

## 6. 아잉·3D 여백
- 패널과 아잉은 최소 32px 떨어지게 (아잉 x 위치는 mascot/AingController 에서 이미 조정 — 여기서는 패널 폭만 줄인다).

## 검증
- tsc · lint · bun test 통과, 1440·390 스윕(bad/over 0), 스크린샷 26장 다시 저장.
