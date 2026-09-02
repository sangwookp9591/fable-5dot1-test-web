# 00 · Goal

## 한 줄 목표

> 아잉이 실제로 살고 일하는 작은 디지털 스튜디오 안에서
> 박상욱이 만든 것들을 직접 눌러보고 스크롤하며 확인하는 인터랙티브 포트폴리오.

## 입력

| 입력 | 역할 |
|---|---|
| `fable-5.1-interactive-web-spec.md` | 구조·품질 기준. Aing Overlay Engine, Three.js Studio, 스크롤 동기화, 성능·접근성·실패 처리·자기 검수 절차 |
| `ai-ng-tone-rules.md` | 모든 문구의 말투. 중학생이 읽어도 바로 이해되는 짧은 문장. 기술 이름은 뒤에 |
| `docs/박상욱_Portfolio.html` | 실제 콘텐츠. 경력, ZIVO, 백오피스, 백엔드 분리, 여기가게, AI, 품질, 일하는 방식 |
| `image/*.webp` | 아잉 마스코트 원본 6종 (idle · wave · think · type · celebrate · jump, 256px 애니메이션 WebP) |
| Higgsfield CLI | 아잉 WebM alpha 클립 생성. 예산 상한 **100 크레딧** |

## 완료 조건 (spec §28)

- 모든 주요 scene 구현: INTRO → CAREER → ZIVO → LOOP → STUDIO → AI → REVIEW → RESULT
- Aing WebM overlay 실제 동작 (상태 전환 시 flash / jump 없음, 실패 시 WebP fallback)
- Three.js 스튜디오 scene 이 스크롤 진행도에 맞춰 카메라 이동, 오브젝트가 콘텐츠와 연결
- Desktop(1440/1280/1024) · Mobile(430/390/375) 스크린샷 검수
- 역방향 스크롤 · reduced-motion · WebGL 미지원 · WebM 로드 실패 검증
- console error 0, critical warning 0
- 성능 측정 (LCP < 2.0s, CLS < 0.05, INP < 150ms 목표)
- 문서 `docs/fable-experiment/00~09`, README 정리

## 하지 않는 것

- SF · 사이버펑크 · 네온 · 의미 없는 particle
- scroll hijacking, 화면 전체가 흔들리는 parallax
- 자동 재생 사운드
- "멋있어서 넣은" 효과. 이유를 한 문장으로 말할 수 없으면 뺀다
