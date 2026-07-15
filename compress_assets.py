import os
from PIL import Image

DIRS = ["assets/zhao", "sucai/zhao"]
# 长边上限：竖图(高>宽)保留更多细节，横图/方形压到 1600
LAND_MAX = 1600
PORT_MAX = 2000

def fit(w, h, max_side):
    long = max(w, h)
    if long <= max_side:
        return w, h
    r = max_side / long
    return max(1, round(w * r)), max(1, round(h * r))

total_before = total_after = 0
log = []
for d in DIRS:
    for f in sorted(os.listdir(d)):
        p = os.path.join(d, f)
        if not os.path.isfile(p):
            continue
        ext = f.lower().rsplit('.', 1)[-1]
        if ext not in ('png', 'jpg', 'jpeg'):
            continue
        before = os.path.getsize(p)
        total_before += before
        try:
            im = Image.open(p)
            w, h = im.size
            max_side = PORT_MAX if h > w else LAND_MAX
            nw, nh = fit(w, h, max_side)
            if (nw, nh) != (w, h):
                im = im.resize((nw, nh), Image.LANCZOS)
            # 保留 alpha；清除多余文本块
            save_kwargs = {"optimize": True}
            if im.mode in ('RGBA', 'LA'):
                pass  # 保持透明
            elif im.mode == 'P':
                im = im.convert('RGBA') if 'transparency' in im.info else im.convert('RGB')
            elif im.mode != 'RGB':
                im = im.convert('RGB')
            if ext == 'png':
                im.save(p, 'PNG', **save_kwargs)
            else:
                im.save(p, 'JPEG', optimize=True, quality=85)
        except Exception as e:
            log.append(f"ERR {p}: {e}")
            total_after += before
            continue
        after = os.path.getsize(p)
        total_after += after
        saved = before - after
        if saved > 50 * 1024:
            log.append(f"{-saved//1024:6d}KB  {w}x{h}->{nw}x{nh}  {f}")

print(f"压缩前: {total_before//1024//1024}MB  压缩后: {total_after//1024//1024}MB  "
      f"节省: {(total_before-total_after)//1024//1024}MB")
print("---- 主要缩减 ----")
print("\n".join(log))
