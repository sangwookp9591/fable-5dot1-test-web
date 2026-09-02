import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "박상욱 · 아잉 스튜디오 — 만들고, 고치고, 끝까지 보는 개발자",
  description:
    "프론트엔드로 시작해 API, DB, 배포, AI까지 직접 본 개발자 박상욱의 인터랙티브 포트폴리오. 아잉이 방 안을 돌면서 실제로 만든 것들을 보여줍니다.",
  metadataBase: new URL("https://ai-ng.co.kr"),
  openGraph: {
    title: "박상욱 · 아잉 스튜디오",
    description: "그래서 뭐 만들었냐고요? 바로 보여드릴게요.",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfaf7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="/fonts/pretendard/pretendard.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
