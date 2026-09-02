"use client";

import { Component, useCallback, useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Room } from "./Room";
import { preloadModels } from "./Model";
import { resolveCamera } from "./camera";
import { progress, useExperience, SECTIONS } from "@/experience/state/experience-store";

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
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

/** WebGL context 유실: 복구를 기다리고, 캔버스가 아직 살아있는데 3초 안에 못 돌아오면 정적 배경으로 */
function ContextGuard() {
  const { gl, invalidate } = useThree();
  const failScene = useExperience((s) => s.failScene);
  useEffect(() => {
    const el = gl.domElement;
    let timer: number | null = null;
    const onLost = (e: Event) => {
      e.preventDefault();
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (el.isConnected) failScene();
      }, 3000);
    };
    const onRestored = () => {
      if (timer) window.clearTimeout(timer);
      timer = null;
      invalidate();
    };
    el.addEventListener("webglcontextlost", onLost);
    el.addEventListener("webglcontextrestored", onRestored);
    return () => {
      if (timer) window.clearTimeout(timer);
      el.removeEventListener("webglcontextlost", onLost);
      el.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl, invalidate, failScene]);
  return null;
}

/** 스크롤 → 카메라. demand 렌더: 움직이는 동안만 다음 프레임을 요청한다. */
function CameraRig() {
  const { camera, invalidate } = useThree();
  const reduced = useExperience((s) => s.caps.reducedMotion);
  const mobile = useExperience((s) => s.caps.mobile);
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const curLook = useRef(new THREE.Vector3(0, 0.9, -1.3));
  const fovRef = useRef(42);
  const initialized = useRef(false);

  useEffect(() => {
    // 스크롤/포인터/리사이즈 시 프레임 요청 (demand 모드)
    const kick = () => invalidate();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    if (!mobile) window.addEventListener("pointermove", kick, { passive: true });
    const unsub = useExperience.subscribe(kick);
    kick();
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("pointermove", kick);
      unsub();
    };
  }, [invalidate, mobile]);

  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    let fov = resolveCamera(SECTIONS, progress.timeline, pos.current, look.current);
    // 세로 화면(모바일)은 가로 시야가 좁아지므로 fov 를 넓혀 같은 물건이 화면에 들어오게 한다
    if (cam.aspect < 1) fov = Math.min(78, fov * (1 + (1 - cam.aspect) * 0.9));
    // 포인터 반응은 아주 작게 (카메라 흔들림 금지)
    if (!reduced && !mobile) {
      look.current.x += progress.pointerX * 0.06;
      look.current.y -= progress.pointerY * 0.04;
    }
    const d = Math.min(dt, 0.05);
    if (!initialized.current || reduced) {
      cam.position.copy(pos.current);
      curLook.current.copy(look.current);
      fovRef.current = fov;
      initialized.current = true;
    } else {
      const k = 1 - Math.exp(-d * 5.5);
      cam.position.lerp(pos.current, k);
      curLook.current.lerp(look.current, k);
      fovRef.current = THREE.MathUtils.lerp(fovRef.current, fov, k);
    }
    cam.lookAt(curLook.current);
    if (Math.abs(cam.fov - fovRef.current) > 0.01) {
      cam.fov = fovRef.current;
      cam.updateProjectionMatrix();
    }
    // 아직 목표에 못 갔으면 다음 프레임 계속
    if (cam.position.distanceToSquared(pos.current) > 1e-6 || curLook.current.distanceToSquared(look.current) > 1e-6 || Math.abs(cam.fov - fov) > 0.05) {
      invalidate();
    }
  });
  return null;
}

export function StudioScene() {
  const failScene = useExperience((s) => s.failScene);
  const mobile = useExperience((s) => s.caps.mobile);
  const wrap = useRef<HTMLDivElement>(null);
  const onReady = useCallback(() => {
    // 모델까지 다 올라온 다음 페이드인 (가구가 하나씩 튀어나오지 않게)
    requestAnimationFrame(() => wrap.current?.classList.add("on"));
  }, []);
  useEffect(() => {
    preloadModels();
  }, []);
  return (
    <div ref={wrap} className="scene-canvas">
      <SceneBoundary onError={failScene}>
        <Canvas
          frameloop="demand"
          dpr={mobile ? [1, 1] : [1, 1.5]}
          camera={{ position: [2.3, 1.75, 3.4], fov: 42, near: 0.1, far: 30 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
          shadows={mobile ? false : "soft"}
          onCreated={({ gl, scene }) => {
            gl.setClearColor("#f6f1e8");
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            scene.fog = new THREE.Fog("#f6f1e8", 6, 12);
          }}
          style={{ position: "absolute", inset: 0 }}
        >
          <hemisphereLight args={["#fff6ea", "#b39c86", 0.8]} />
          {/* 창문에서 들어오는 빛: 그림자는 이 조명 하나만 */}
          <directionalLight
            position={[-3.2, 2.7, 0.6]}
            intensity={1.7}
            color="#ffe9d2"
            castShadow={!mobile}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0004}
            shadow-normalBias={0.02}
            shadow-camera-near={0.5}
            shadow-camera-far={12}
            shadow-camera-left={-4}
            shadow-camera-right={4}
            shadow-camera-top={3.5}
            shadow-camera-bottom={-3}
          />
          <directionalLight position={[2.5, 3, 3]} intensity={0.3} color="#e6f0ff" />
          <Room onReady={onReady} />
          <CameraRig />
          <ContextGuard />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
