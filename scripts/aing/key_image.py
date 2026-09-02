"""Key a flat-green background out of a generated PNG → RGBA sprite (cropped to content).
usage: key_image.py <in.png> <out_rgba.png>"""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
a = np.asarray(im).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
# green dominance metric: how much g exceeds max(r,b)
dom = g - np.maximum(r, b)
alpha = np.clip((90 - dom) / 60.0, 0, 1)  # dom>=90 → transparent, dom<=30 → opaque
# despill: reduce green in semi-transparent edge pixels
g2 = np.where(alpha < 1, np.minimum(g, np.maximum(r, b)), g)
outarr = np.stack([r, g2, b, (alpha * 255).astype(np.int16)], axis=-1).clip(0, 255).astype(np.uint8)
res = Image.fromarray(outarr, "RGBA")
res = res.crop(res.getbbox())
res.save(out)
print(out, res.size)
