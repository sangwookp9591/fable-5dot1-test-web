"use client";

import { Component, type ReactNode } from "react";

/** 3D 가 어떤 이유로든 죽으면(청크 로드 실패 포함) 조용히 정적 배경으로. DOM 콘텐츠는 영향 없음. */
export class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
