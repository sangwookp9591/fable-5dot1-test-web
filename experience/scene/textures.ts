import * as THREE from "three";

/** 캔버스로 만든 나무 바닥 텍스처 (외부 파일 없이). */
export function makeWoodTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#c9a26e";
  ctx.fillRect(0, 0, 512, 512);
  const plankH = 64;
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let row = 0; row < 8; row++) {
    const y = row * plankH;
    const offset = (row % 2) * 180 + rnd() * 60;
    for (let x = -256; x < 512; x += 256) {
      const px = x + offset;
      const l = 0.9 + rnd() * 0.2;
      ctx.fillStyle = `rgb(${Math.round(201 * l)}, ${Math.round(162 * l)}, ${Math.round(110 * l)})`;
      ctx.fillRect(px, y, 256, plankH);
      // 나무결
      ctx.strokeStyle = "rgba(90, 60, 30, 0.12)";
      ctx.lineWidth = 1;
      for (let k = 0; k < 6; k++) {
        ctx.beginPath();
        const gy = y + 8 + k * 9 + rnd() * 4;
        ctx.moveTo(px, gy);
        ctx.bezierCurveTo(px + 80, gy + rnd() * 6 - 3, px + 170, gy - rnd() * 6 + 3, px + 256, gy);
        ctx.stroke();
      }
      // 판 사이 틈
      ctx.fillStyle = "rgba(70, 45, 25, 0.35)";
      ctx.fillRect(px, y, 256, 1.5);
      ctx.fillRect(px, y, 1.5, plankH);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2.5, 2.2);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** 벽: 아주 옅은 질감 */
export function makePlasterTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#f3ede2";
  ctx.fillRect(0, 0, 256, 256);
  const img = ctx.getImageData(0, 0, 256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 2);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
