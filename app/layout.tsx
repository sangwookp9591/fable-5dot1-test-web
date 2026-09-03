import type { Metadata, Viewport } from "next";
import "./pretendard.css";
import "./globals.css";
import "@/experience/sections/section.css";
import "@/experience/sections/blocks.css";

export const metadata: Metadata = {
  title: "박상욱 포트폴리오 — 화면부터 서버, 배포까지 직접 만드는 개발자",
  description:
    "프론트엔드로 시작해 서버 API, 데이터베이스, 배포와 AI 기능까지 직접 다뤄온 개발자 박상욱의 포트폴리오입니다. 실제로 만든 서비스와 문제 해결 과정을 정리했습니다.",
  metadataBase: new URL("https://ai-ng.co.kr"),
  openGraph: {
    title: "박상욱 포트폴리오",
    description: "화면부터 서버, 배포까지 실제로 만든 서비스와 문제 해결 과정을 정리했습니다.",
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
      <body>{children}</body>
    </html>
  );
}
