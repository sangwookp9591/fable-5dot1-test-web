import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 자동 생성 AGENTS.md / CLAUDE.md 는 저장소에 넣지 않는다
  agentRules: false,
  async headers() {
    return [
      {
        // 아잉 클립 · 폰트는 내용이 바뀌면 파일명이 바뀌므로 오래 캐시
        source: "/:prefix(aing|fonts)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
