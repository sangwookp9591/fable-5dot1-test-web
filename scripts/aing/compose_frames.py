"""Compose start/end frames for Aing image-to-video generation.

Places one frame of a source animated WebP on a flat chroma-green 16:9 canvas
so Higgsfield (Kling 3.0) keeps the character identity while we key the
background out later with ffmpeg (see keyout.sh).

usage: python3 compose_frames.py <src.webp> <frame_index> <x_center 0..1> <out.png>
"""
import sys
from PIL import Image

W, H = 1280, 720
GREEN = (0, 255, 0, 255)
CHAR_H = 560          # character height on canvas (px)
BOTTOM_MARGIN = 60

src, idx, xc, out = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
im = Image.open(src)
im.seek(idx)
fr = im.convert("RGBA")
bbox = fr.getbbox()
fr = fr.crop(bbox)
scale = CHAR_H / fr.height
fr = fr.resize((round(fr.width * scale), CHAR_H), Image.LANCZOS)
canvas = Image.new("RGBA", (W, H), GREEN)
x = round(W * xc - fr.width / 2)
y = H - BOTTOM_MARGIN - CHAR_H
canvas.alpha_composite(fr, (x, y))
canvas.convert("RGB").save(out)
print(out, fr.size, (x, y))
