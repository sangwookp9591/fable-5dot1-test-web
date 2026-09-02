# 05 · Three.js Architecture

## 판단

- **WebGL, WebGPU 아님.** 오브젝트 30여 개, 인스턴스·파티클·compute 없음. WebGPU 의 이점이 없고 지원 분기만 늘어난다 (spec §10).
- **demand 렌더.** `frameloop="demand"`. 스크롤·포인터·리사이즈·store 변경 때 `invalidate()`, 카메라가 목표에 닿을 때까지만 다음 프레임을 요청한다. 가만히 있으면 GPU 0.
- **모델은 Kenney Furniture Kit (CC0).** 원시 도형으로 만든 첫 버전은 "현실과 너무 다른 오브젝트" 라는 피드백을 받았다. 저용량 GLB 23개(총 316KB)로 교체. 원본이 0.5 스케일이라 2배로 배치.
- **그림자는 창문 방향 directional light 하나만** (2048 soft). 모바일은 그림자 없음, dpr 1.
- **텍스처는 캔버스로 생성** (바닥 나무결, 벽 질감, 모니터 화면, 포스터). 외부 이미지 요청 0.

## 구조

```
experience/scene/
  StudioScene.tsx   Canvas · 조명 · CameraRig · ContextGuard · ErrorBoundary
  Room.tsx          방 껍데기 + Kenney 모델 배치 + 반응하는 물건(WallBoard, TvTiles, ServerRack, MonitorScreen, LampLight) + Anchor
  Model.tsx         useGLTF 로더, 그림자 플래그, Kenney 핑크 → 세이지 recolor
  camera.ts         섹션별 키프레임 · 투어 4정거장 · resolveCamera(timeline) 순수 함수
  Screen.tsx        모니터 CanvasTexture (섹션·loopStep 바뀔 때만 다시 그림)
  anchors.ts        월드 좌표 → 화면 px (아잉 앵커)
  textures.ts       바닥·벽 캔버스 텍스처
```

## 카메라

`progress.timeline` (섹션 index + local) → `resolveCamera()` → pos/look/fov.
섹션의 마지막 25% 에서 다음 섹션 키로 smoothstep 블렌드. 스튜디오 섹션은 local 0~0.8 동안 4 정거장, 0.86 부터 다음 섹션으로.
CameraRig 는 `1 - exp(-dt·5.5)` 로 따라가며 아직 목표에 못 갔으면 `invalidate()` 를 다시 건다. reduced-motion 이면 즉시 대입.

## WebM × 3D (spec §11)

DOM 오버레이 + 앵커 방식을 택했다. video texture 는 Safari 에서 VP9 alpha 를 못 쓰고, 두 코드 경로(WebGL/캔버스 fallback)를 유지해야 했다.
`<Anchor id="deskSeat" feet height cutY/>` 가 매 프레임 발 위치·키·책상 윗면 선을 px 로 기록하고,
AingController 가 loop 섹션에서 그 값으로 위치·크기·`clip-path: inset(0 0 Npx 0)` 를 갱신한다 → 아잉이 책상 뒤에 앉아 상반신만 보인다.

## 실패 처리 (spec §24)

- WebGL 없음 / saveData → `.scene-fallback` 정적 그라디언트, DOM 은 그대로
- Canvas 렌더 중 예외 → ErrorBoundary → `failScene()`
- `webglcontextlost` → preventDefault 후 3초 대기, 캔버스가 아직 살아있는데 복구 안 되면 `failScene()`. (HMR 로 캔버스가 교체될 때 옛 컨텍스트가 유실되는 경우는 `isConnected` 로 무시)
- 모델 로딩은 Suspense. 전부 올라온 뒤 600ms 페이드인 (가구가 하나씩 튀어나오지 않게)
