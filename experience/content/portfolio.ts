/**
 * 박상욱 포트폴리오 콘텐츠 (docs/박상욱_Portfolio.html 에서 추출).
 * 모든 문구는 ai-ng-tone-rules.md 를 따른다: 짧게, 실제 상황 먼저, 기술 이름은 뒤에.
 */

export const profile = {
  name: "박상욱",
  nameEn: "Sangwook Park",
  role: "Frontend 중심 Full-stack Developer",
  roleSub: "Backend · Infra · AI/AX",
  period: "2019–2026",
  email: "sangwookp9591@gmail.com",
  github: "https://github.com/sangwookp9591",
  githubHandle: "@sangwookp9591",
  youtube: "https://www.youtube.com/@ai-ng-tech",
  web: "https://ai-ng.co.kr",
  webLabel: "ai-ng.co.kr",
  source: "https://github.com/sangwookp9591/fable-5dot1-test-web",
} as const;

export const hero = {
  eyebrow: "Hello · This is what I built",
  title: ["그래서 뭐 만들었냐고요?", "바로 보여드릴게요."],
  body:
    "프론트엔드로 시작했는데, 하다 보니 서버도 보고 배포도 하고 AI도 붙이고 있었습니다. 문제가 생기면 제 담당인지부터 따지기보다 어디서 꼬였는지부터 찾아갑니다.",
  cta: "바로 보기",
  points: [
    { n: "01", t: "화면만 만들진 않았습니다", d: "API, DB, 배포까지 필요하면 직접 봤습니다." },
    { n: "02", t: "잘 되는 건 기본이고", d: "두 번 눌렀을 때, 끊겼을 때, 다시 시도했을 때도 확인합니다." },
    { n: "03", t: "새 거 나오면 일단 써봅니다", d: "AI든 개발 도구든 직접 써보고 괜찮으면 팀에도 공유합니다." },
  ],
} as const;

export const career = {
  eyebrow: "Career at a glance",
  title: "처음엔 프론트엔드였습니다. 지금은 이것저것 다 봅니다.",
  body:
    "작은 팀에서 서비스를 만들다 보니 화면만 보고 있을 수가 없었습니다. API도 보고, DB도 보고, 배포도 하다 보니 자연스럽게 지금의 범위가 됐습니다.",
  items: [
    { years: "2019–2022", company: "㈜아와소프트", d: "공공·기업 SI · 실시간 관제 · AI 결과 검증 화면", tags: ["관제", "AI 검증"], scope: ["Frontend"] },
    { years: "2022–2023", company: "㈜데브락", d: "2인 팀 · Figma 기반 디자인 협업 · 여기가게 앱·파트너센터 · 영상 파이프라인", tags: ["숏폼", "위치 기반"], scope: ["App", "Video"] },
    { years: "2024–2025", company: "애자일그로스㈜", d: "2~3인 팀 · 화면부터 API·AWS·배포까지 A to Z", tags: ["웹", "API", "AWS"], scope: ["Web", "API", "Infra"] },
    { years: "2025–2026", company: "ZIVO", d: "이용자용 웹 · 백오피스 공통 기반 · 여러 도메인의 서버 기능", tags: ["웹", "백오피스", "서버"], scope: ["Web", "Back office", "Server"] },
  ],
} as const;

export const zivo = {
  eyebrow: "ZIVO · 9개월간 만든 것들",
  title: "ZIVO에서는 웹부터 시작해서 백오피스와 서버까지 갔습니다.",
  body:
    "이용자용 웹을 설계부터 운영까지 맡았습니다. 운영 화면이 필요하면 백오피스를 만들고, 서버에서 막히면 API를 고쳤습니다. 병원·택시·호텔·eSIM·QR 주문과 검색·결제·AI·쿠폰·물류까지 실제 서비스 흐름을 따라가며 작업했습니다.",
  stats: [
    { value: 14, suffix: "", label: "지원 언어" },
    { value: 440, suffix: "", label: "웹 PR" },
    { value: 157, suffix: "", label: "운영 화면" },
    { value: 10, suffix: "회", label: "결제 테스트 연속 성공" },
  ],
  lanes: [
    { k: "USER WEB", big: "처음부터", t: "이용자용 웹", d: "설계, 구현, 14개 언어와 실제 운영까지 맡았습니다." },
    { k: "BACK OFFICE", big: "157개", t: "운영 화면", d: "공통 구조를 만들고 주요 기능을 직접 구현했습니다." },
    { k: "BACKEND", big: "API까지", t: "서버", d: "여러 도메인과 검색·결제·AI·쿠폰·물류를 맡았습니다." },
  ],
  quote: {
    t: "화면에서 안 풀리면 서버까지 갔습니다.",
    d: "담당 저장소를 나누기보다 사용자가 막힌 지점부터 따라가며 필요한 곳을 고쳤습니다.",
  },
  userWeb: {
    eyebrow: "Implemented product · User web",
    title: "말로만 설명하면 재미없으니까, 실제 화면부터 보여드릴게요.",
    body: "검색으로 들어온 해외 사용자가 앱 설치 없이 병원·숙소를 찾고 주문과 결제까지 이어갈 수 있는 웹입니다.",
    link: "https://ai-ng.co.kr/zivo/app/index.html",
    linkLabel: "실제 화면 직접 눌러 보기",
    points: [
      { n: "01", t: "검색해 들어와도 바로 자기 언어로", d: "14개 언어가 검색에서도 각각 제대로 노출되도록 주소 구조부터 나눴습니다." },
      { n: "02", t: "앱 설치 없이 결제까지", d: "장소 확인, QR 주문, 장바구니와 결제를 하나의 웹 흐름으로 연결했습니다." },
      { n: "03", t: "실패해도 길을 잃지 않게", d: "뒤로 가기, 결제 취소, 0원 주문과 판매 불가 상황에서도 돌아올 길을 만들었습니다." },
      { n: "04", t: "14개 언어 · 9개월 운영", d: "만들고 넘긴 화면이 아니라 실제 사용자가 쓰는 동안 계속 고치고 운영했습니다." },
    ],
  },
  i18n: {
    eyebrow: "14 languages · Web from zero to operation",
    title: "14개 언어, 번역만 붙이면 끝일 줄 알았습니다.",
    body: "막상 해보니 검색 노출도 언어별로 달라야 했고, 캐시가 다른 언어와 섞여서도 안 됐습니다. 그래서 언어를 쿠키에 숨기지 않고 URL 자체에 넣었습니다.",
    steps: [
      { k: "상황", t: "검색으로 들어오는 사용자", d: "앱 설치보다 웹 검색이 먼저였고, 열네 가지 언어가 각각 검색에 노출돼야 했습니다." },
      { k: "판단", t: "언어를 주소에 포함", d: "쿠키에만 저장하지 않고 언어 자체를 URL 구조에 넣었습니다." },
      { k: "결과", t: "색인과 캐시를 분리", d: "각 언어가 고유 주소를 갖고 검색과 CDN 정책도 따로 움직입니다." },
    ],
    before: { k: "BEFORE", t: "쿠키에만 언어 저장", d: "주소 1개 · 언어별 색인 어려움" },
    after: { k: "AFTER", t: "/ko · /en · /ja · /zh · …", d: "14개 URL · 색인과 캐시 분리" },
    langs: ["ko", "en", "ja", "zh", "zh-tw", "th", "vi", "id", "ms", "es", "fr", "de", "ru", "ar"],
    note: {
      t: "기술보다 먼저 정한 것",
      d: "“검색으로 발견되는 서비스”가 목표였기 때문에 구현 편의보다 주소 구조와 검색 노출을 우선했습니다. 도구도 최신이라는 이유보다 당시 환경에서 안정적으로 적용되는지를 기준으로 골랐습니다.",
    },
  },
  backOffice: {
    eyebrow: "Implemented product · Back office",
    title: "이용자 화면만 만든 건 아닙니다. 운영 화면도 157개.",
    body: "파트너, 관리자, 직원이 같은 서비스를 서로 다른 방식으로 사용합니다. 화면마다 사용법이 달라지지 않도록 공통 구조를 만들고, 개발자를 부르지 않아도 직접 처리할 수 있는 기능을 늘렸습니다.",
    link: "https://ai-ng.co.kr/zivo/admin/index.html",
    linkLabel: "백오피스 화면 보기",
    points: [
      { t: "역할마다 필요한 것만", d: "파트너·관리자·직원의 메뉴와 행동 권한을 화면과 서버에서 함께 확인합니다." },
      { t: "화면마다 제멋대로 놀지 않게", d: "표, 팝업, 오류 안내와 요청 처리를 공통으로 묶었습니다." },
      { t: "개발자를 부르지 않아도", d: "알림, 약관, 워크플로, 엑셀 업로드를 운영자가 직접 관리할 수 있게 했습니다." },
    ],
  },
  backend: {
    eyebrow: "Backend restructuring",
    title: "야간 배치 하나가 낮의 API까지 느리게 만들지 않도록.",
    body: "배치, 워커, API가 한 실행 구조를 공유하며 장애 영향이 함께 번지던 흐름을 나눴습니다.",
    before: { t: "단일 실행 구조", d: "API · Worker · Batch", sub: "하나의 지연이 전체로 확산" },
    after: ["API", "Worker", "Batch"],
    points: [
      { n: "01", t: "한 덩어리부터 나눴습니다", d: "계층 중심 구조를 Gradle 멀티모듈로 바꾸고 도메인 사이 호출은 정해진 길로만 열었습니다." },
      { n: "02", t: "미룬 업그레이드도 같이", d: "JDK 21과 Spring Boot 3.5로 올려 현재 구조와 장기 유지보수 기준을 맞췄습니다." },
      { n: "03", t: "쿠폰부터 먼저 옮겨봤습니다", d: "기준 사례와 문서를 먼저 만들고 같은 틀로 하나씩 안전하게 옮겼습니다." },
    ],
    quote: {
      t: "외부 서비스는 언제든 멈출 수 있습니다.",
      d: "결제·알림·검색 중 한 곳이 멈춰도 옆 기능까지 같이 멈추지 않게 하고, 다시 시도해도 결과가 중복되지 않도록 만들었습니다.",
    },
  },
} as const;

export const yeogigage = {
  eyebrow: "Previous product · 여기가게",
  title: "주변 가게에서 찍고, 기다림 없이 넘겨보는 맛집 숏폼 앱.",
  body: "앱의 처음부터 끝까지 만들고 파트너센터 기능도 개발했습니다. 촬영 위치 확인부터 업로드, 영상 변환과 재생까지 한 흐름으로 최적화했습니다.",
  flow: ["위치 권한 확인", "현재 가게 선택", "촬영 동의", "영상 업로드"],
  points: [
    { k: "CAPTURE", t: "주변 가게에서 바로 촬영", d: "현재 위치와 가게를 확인해 앱에서 실시간으로 직접 찍은 영상이 연결되도록 만들었습니다." },
    { k: "STREAM", t: "느린 환경에서도 바로 재생", d: "AWS MediaConvert로 영상을 HLS로 바꾸고, 네트워크에 맞는 화질을 내려주도록 구성했습니다." },
    { k: "OPERATE", t: "앱부터 파트너센터까지", d: "앱 전체와 파트너센터를 개발하고 업로드, 가게 정보와 운영 기능까지 함께 다뤘습니다." },
  ],
  quote: {
    t: "다음 영상은 넘기기 전에 조금 먼저 준비했습니다.",
    d: "스크롤 위치를 기준으로 호출 임계값을 잡고 다음 HLS 영상의 첫 세그먼트를 미리 받아왔습니다. 전체 영상을 기다리지 않고 필요한 화질부터 재생해 로딩을 줄였습니다.",
  },
} as const;

export const ai = {
  eyebrow: "AI · 일단 제가 먼저 써봅니다",
  title: "새 AI가 나오면 후기보다 먼저 켜봅니다.",
  body: "무료 한도만으로 모르겠으면 소액이라도 결제해서 써봅니다. 남의 평가보다 제 일에서 진짜 쓸 만한지가 더 궁금합니다.",
  cards: [
    { t: "새로 나오면 일단 설치", d: "Orca, Buzz, Aside, cmux처럼 새로운 도구가 보이면 직접 써봅니다. 괜찮은 건 팀에도 바로 공유합니다." },
    { t: "모델도 직접 붙여봄", d: "Claude, GPT, Gemini, Grok에 같은 작업을 던져보고 잘하는 것과 애매한 것을 비교합니다." },
    { t: "좋다는 말보다 내 손으로 확인", d: "코딩도 시켜보고 문서도 맡겨봅니다. 실제 업무 흐름에 넣어 쓸 수 있는지도 확인합니다." },
    { t: "괜찮으면 팀에도 전파", d: "어디에 쓰면 좋은지, 기존 도구보다 무엇이 나은지까지 정리해 팀원들과 공유합니다." },
  ],
  loop: ["직접 써봄", "비교해봄", "괜찮으면 공유", "쓸 곳이 있으면 적용"],
  quote: {
    t: "새로운 걸 가장 빨리 아는 사람보다, 쓸 만한 걸 골라내는 사람이 되고 싶습니다.",
    d: "직접 써보고 비교한 뒤, 제 일에서 실제로 쓸 수 있는 것만 남깁니다.",
  },
  thisSite: {
    t: "이 사이트도 그렇게 만들었습니다.",
    d: "Claude Fable 5.1에게 만들게 하고, 아잉 영상은 Higgsfield로 뽑았습니다. 만든 다음엔 직접 열어보고 틀린 곳을 고치게 했습니다.",
  },
} as const;

export const quality = {
  eyebrow: "Quality · 가끔부터 없애기",
  title: "테스트가 가끔 실패했습니다. 그래서 ‘가끔’부터 없앴습니다.",
  body: "결제 기능에는 문제가 없었는데 자동 테스트는 가끔씩 실패했습니다. 시간을 더 기다리게 만드는 대신 왜 실패하는지 찾고, 반복해도 결과가 같도록 고쳤습니다.",
  steps: [
    { id: "plan", k: "문제", t: "실서버 결제 테스트가 느리고 가끔 실패합니다", d: "자동 검사에 올리기 어려웠습니다.", aing: "think", terminal: ["$ bun test e2e/payment", "✓ 장바구니 담기", "✓ 주문서 이동", "✗ 결제 버튼 클릭 … timeout 30s", "1 failed, 2 passed (flaky 3/10)"] },
    { id: "check", k: "원인", t: "결제 로직이 아니었습니다", d: "화면이 준비되기 전에 클릭이 먼저 들어가는 문제였습니다.", aing: "review", terminal: ["$ bun test e2e/payment --trace", "→ click(#pay) fired at 412ms", "→ #pay hydrated at 688ms", "원인: 준비 전 클릭"] },
    { id: "fix", k: "해결", t: "화면이 준비됐는지 확인한 뒤 클릭", d: "기다리는 시간을 늘리는 대신 준비 신호를 기다리도록 테스트 방식을 바꿨습니다.", aing: "type", terminal: ["- await page.waitForTimeout(3000)", "+ await expect(pay).toBeEnabled()", "+ await pay.click()"] },
    { id: "rerun", k: "다시 실행", t: "10회 연속 성공", d: "반복해도 결과가 같습니다.", aing: "celebrate", terminal: ["$ bun test e2e/payment --repeat 10", "✓✓✓✓✓✓✓✓✓✓", "10 passed, 0 failed"] },
  ],
  history: [
    { years: "2019–2022 · 아와소프트", t: "AI 결과를 사람이 확인하는 화면", d: "도로 영상 분석 결과를 담당자가 직접 확인하고 판단할 수 있는 검증 화면을 만들었습니다." },
    { years: "2022–2023 · 데브락", t: "영상 업로드에서 재생까지", d: "촬영·편집·업로드·변환·배포·재생을 구간별로 나눠 문제의 시작점을 찾았습니다." },
    { years: "2024–2025 · 애자일그로스", t: "화면부터 서버와 배포까지", d: "2~3인 팀에서 웹과 API, AWS 환경과 배포를 맡아 서비스를 통째로 세웠습니다." },
  ],
} as const;

export const howIWork = {
  eyebrow: "How I work",
  title: "일할 때는 대충 이런 편입니다.",
  body: "거창하게 정한 원칙은 아니고, 몇 년 일하다 보니 자연스럽게 남은 습관들입니다.",
  habits: [
    { t: "느리면 일단 기다리게 만들진 않습니다.", d: "어디에서 시간이 걸리는지부터 찾습니다." },
    { t: "한 번 누르는 기능도 두 번 눌러봅니다.", d: "연결이 끊기거나 중복 요청이 들어와도 괜찮은지 확인합니다." },
    { t: "같은 고생은 자동화에 넘깁니다.", d: "두 번 이상 반복되면 공통 코드나 검사로 바꿀 수 있는지 봅니다." },
    { t: "개발자 눈에만 보이면 부족합니다.", d: "운영하는 사람도 지금 무슨 일이 벌어지고 있는지 알 수 있게 만듭니다." },
  ],
  stack: [
    { k: "Frontend", v: "TypeScript · React 19 · Next.js 16 · React Native · Three.js" },
    { k: "Backend", v: "Java 21 · Spring Boot 3.5 · NestJS · PostgreSQL · Redis · OpenSearch" },
    { k: "Infra", v: "AWS · Docker · Nginx · GitHub Actions" },
    { k: "Quality", v: "Playwright · ArchUnit · Testcontainers · Micrometer" },
    { k: "AI / AX", v: "OpenAI · Gemini · Claude · Multi LLM · Agent Skill · On-device LLM" },
  ],
  closing: ["만든 사람이 옆에 없어도", "잘 돌아가면 제일 좋습니다."],
} as const;

/** 아잉 대사. `냥` 은 결론·감정이 강한 순간에만. */
export const aingLines = {
  intro: ["박상욱, 진짜 그렇게 다 해?", "그럼 뭐 만들었는지 보여줘 봐냥."],
  career: "처음엔 화면만 만들었다는데?",
  zivo: "14개 언어… 이걸 혼자?",
  loop: { plan: "또 실패했네.", check: "잠깐, 버튼이 문제가 아니었어?", fix: "다시!", rerun: "이번엔 됐다냥!" },
  studio: "여기가 내 자리.",
  ai: "새 거 나오면 나부터 켜본다냥.",
  review: "다 만들었다고 끝? 아니지.",
  result: ["오… 꽤 하는데?", "다음엔 더 어려운 걸 시켜보자냥."],
} as const;
