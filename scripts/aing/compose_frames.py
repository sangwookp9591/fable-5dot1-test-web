"""Compose start/end frames for Aing image-to-video generation.

Places an RGBA sprite (or one frame of an animated WebP) on a flat chroma-green
16:9 canvas so Higgsfield (Kling 3.0) keeps the character identity while we
key the background out later with ffmpeg (see keyout.sh).

usage: python3 compose_frames.py <sprite.png|src.webp> <frame_index> <x_center 0..1> <out.png> [char_h]
"""
import sys
from PIL import Image

W, H = 1280, 720
GREEN = (0, 255, 0, 255)
BOTTOM_MARGIN = 56

src, idx, xc, out = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
char_h = int(sys.argv[5]) if len(sys.argv) > 5 else 580
im = Image.open(src)
if getattr(im, "n_frames", 1) > 1:
    im.seek(idx)
fr = im.convert("RGBA")
fr = fr.crop(fr.getbbox())
scale = char_h / fr.height
fr = fr.resize((round(fr.width * scale), char_h), Image.LANCZOS)
canvas = Image.new("RGBA", (W, H), GREEN)
x = round(W * xc - fr.width / 2)
y = H - BOTTOM_MARGIN - char_h
canvas.alpha_composite(fr, (x, y))
canvas.convert("RGB").save(out)
print(out, fr.size, (x, y))
