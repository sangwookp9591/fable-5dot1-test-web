import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 정적 배포. 캐시 헤더는 headers() 대신 public/_headers 에 있다.
  output: "export",
  // 자동 생성 AGENTS.md / CLAUDE.md 는 저장소에 넣지 않는다
  agentRules: false,
};

export default nextConfig;
