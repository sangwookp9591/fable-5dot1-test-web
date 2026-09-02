# 01 · Audit — 시작 전 점검

## 환경

| 항목 | 값 |
|---|---|
| Bun | 1.3.14 |
| Node | 25.8.1 (Next 빌드 런타임) |
| Next.js | 16.3.4 (App Router, Turbopack) |
| React | 19.2.8 |
| three / @react-three/fiber / drei | 0.185 / 9.7 / 10.7 |
| gsap | 3.15 (ScrollTrigger 포함, 무료) |
| zustand | 5 |
| ffmpeg | 8.1.2 (libvpx-vp9, hevc_videotoolbox) |
| Higgsfield CLI | 1.1.23, 잔액 279.79 크레딧, 사용 상한 100 |

## 아잉 원본 에셋 점검

- 6개 애니메이션 WebP, 각 58프레임 · 100ms/frame(10fps) · 256×256 · RGBA · 무한 loop
- 캐릭터: 흰 고양이, 파란 헤드밴드(뇌 아이콘), 헤드폰(A 로고), 파란 눈, 핑크 귀, 발밑 연한 그림자
- 문제: 256px 는 데스크톱 오버레이(300~420px 표시)에서 흐릿함. → Higgsfield 로 720p 클립 재생성, 원본 WebP 는 fallback 과 poster 로 사용
- ffmpeg 는 animated WebP 를 직접 디코드하지 못함 → PIL 로 PNG 시퀀스 추출 후 인코드 (`scripts/aing/`)

## Higgsfield 비용 조사 (image-to-video, 720p, 오디오 off)

| 모델 | 3s | 4s | 5s | 비고 |
|---|---|---|---|---|
| Kling 3.0 std | 4.5 | 6 | 7.5 | start+end image 지원, 추가 비용 없음 → **선택** |
| Kling 3.0 pro | | | 8.75 | |
| Seedance 2.0 fast | | 14 | 17.5 | image_references 지원 |
| Seedance 2.0 mini | | | 12.5 | |
| Minimax Hailuo | | | 6 | end image 없음 |
| Nano Banana 2 Lite (이미지) | 1 | | | 포스터 텍스처용 |

알파 추출: 모델은 알파를 직접 내지 못함 → 순수 초록(#00FF00) 배경 + start/end 프레임에 캐릭터 합성 → ffmpeg `chromakey` + `despill` → VP9 alpha WebM (+ Safari 용 HEVC alpha MOV).
start 프레임과 end 프레임을 모두 "idle 기본 포즈"로 고정하면 모든 클립이 idle 로 시작·종료하므로 상태 전환 crossfade 가 자연스럽다.

## 포트폴리오 콘텐츠 점검

- 문서 자체가 이미 tone rule 을 따르는 말투 (짧은 문장, 실제 상황 먼저)
- 이미지 에셋(`assets/*.png`) 은 문서에 없음 → 실제 화면은 라이브 URL(ai-ng.co.kr/zivo/app, /zivo/admin) 스크린샷 또는 링크로 대체
- 숫자: 14개 언어 · 440 웹 PR · 157 운영 화면 · 결제 테스트 10회 연속 성공 · 4개 회사(2019–2026)

## 기존 사이트(ai-ng.co.kr) 와의 연속성

- 폰트: Pretendard (동일하게 사용, self-host dynamic subset)
- 톤: "만들고, 고치고, 끝까지 보는 개발자"
- 팔레트: 포트폴리오 문서의 paper/ink/orange/blue/green 을 그대로 토큰화
