import type { Metadata, Viewport } from "next";
import "./pretendard.css";
import "./globals.css";
import "@/experience/sections/section.css";
import "@/experience/sections/blocks.css";

export const metadata: Metadata = {
  title: "박상욱 포트폴리오 — 화면부터 서버, 배포까지",
  description:
    "처음에는 화면을 만드는 일이 중심이었습니다. 그런데 실제 서비스에서 생기는 문제를 따라가다 보니 API, 데이터베이스, 배포까지 함께 보게 됐습니다.",
  metadataBase: new URL("https://ai-ng.co.kr"),
  openGraph: {
    title: "박상욱 포트폴리오",
    description: "화면을 만들다 보니 서버도 보고, 배포까지 하게 됐습니다.",
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
