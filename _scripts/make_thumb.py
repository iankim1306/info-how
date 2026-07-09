# -*- coding: utf-8 -*-
# make_thumb.py — 리뷰 썸네일 (choicemon 스타일: 실사진 배경 + 굵은 텍스트 + 비교! 배지)
# 배경: Pollinations 무료 이미지 생성(프롬프트→사진). 실패 시 그라디언트 폴백.
# 사용: node _scripts/build-reviews.cjs  후  python _scripts/make_thumb.py
import json, os, sys, hashlib, urllib.parse, urllib.request, io
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, '_scripts', 'auto', 'cache')
os.makedirs(CACHE, exist_ok=True)

FONT_PATHS = ['C:/Windows/Fonts/malgunbd.ttf', 'C:/Windows/Fonts/malgun.ttf', 'C:/Windows/Fonts/gulim.ttc']
W = H = 800

# 폴백 그라디언트용 색
SCHEMES = [
    ((30, 41, 59), (56, 89, 138)), ((24, 60, 48), (34, 120, 90)),
    ((49, 46, 129), (99, 102, 241)), ((120, 53, 15), (217, 119, 6)),
    ((76, 29, 79), (162, 62, 160)),
]

def font(sz):
    for fp in FONT_PATHS:
        if os.path.exists(fp):
            try: return ImageFont.truetype(fp, sz)
            except Exception: continue
    return ImageFont.load_default()

def fetch_bg(prompt, color_idx):
    """Pollinations로 배경 생성(캐시). 실패 시 그라디언트."""
    if prompt:
        h = hashlib.md5(prompt.encode()).hexdigest()[:12]
        cache_p = os.path.join(CACHE, f'bg_{h}.jpg')
        if os.path.exists(cache_p):
            try: return Image.open(cache_p).convert('RGB')
            except Exception: pass
        try:
            seed = int(h[:6], 16) % 100000
            url = (f'https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}'
                   f'?width=800&height=800&nologo=true&seed={seed}')
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            data = urllib.request.urlopen(req, timeout=60).read()
            im = Image.open(io.BytesIO(data)).convert('RGB')
            im.save(cache_p, 'JPEG', quality=88)
            return im
        except Exception as e:
            print(f'  (Pollinations 실패, 그라디언트 폴백: {e})')
    # 폴백 그라디언트
    bg, acc = SCHEMES[color_idx % len(SCHEMES)]
    im = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(bg[0]*(1-t)+acc[0]*t), int(bg[1]*(1-t)+acc[1]*t), int(bg[2]*(1-t)+acc[2]*t)))
    return im

def cover(im):
    """임의 비율 → 800x800 꽉 채우기(center-crop)."""
    r = max(W / im.width, H / im.height)
    im = im.resize((int(im.width * r) + 1, int(im.height * r) + 1), Image.LANCZOS)
    x = (im.width - W) // 2; y = (im.height - H) // 2
    return im.crop((x, y, x + W, y + H))

def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], []
    for w in words:
        t = ' '.join(cur + [w])
        if draw.textbbox((0, 0), t, font=fnt)[2] > max_w and cur:
            lines.append(' '.join(cur)); cur = [w]
        else: cur.append(w)
    if cur: lines.append(' '.join(cur))
    return lines

def make(label, prompt, badge, color_idx):
    img = cover(fetch_bg(prompt, color_idx)).convert('RGBA')

    # 가독성: 상단·하단 어둠 스크림
    scrim = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scrim)
    for y in range(H):
        a = 0
        if y < 300: a = int(150 * (1 - y / 300))          # 상단
        elif y > 560: a = int(140 * ((y - 560) / 240))     # 하단
        sd.line([(0, y), (W, y)], fill=(0, 0, 0, a))
    img = Image.alpha_composite(img, scrim)
    draw = ImageDraw.Draw(img, 'RGBA')

    # 테두리(브랜드감)
    draw.rectangle([0, 0, W-1, H-1], outline=(255, 255, 255, 200), width=10)

    # ── 메인 라벨: 상단, 노랑 + 두꺼운 검정 외곽선 (choicemon 감성) ──
    fsize, lines = 96, [label]
    for fs in range(120, 48, -4):
        f = font(fs)
        ls = wrap(draw, label, f, 660)
        h = sum(draw.textbbox((0, 0), l, font=f)[3] for l in ls) + (len(ls)-1)*10
        if h <= 300 and all(draw.textbbox((0,0), l, font=f)[2] <= 660 for l in ls):
            fsize, lines = fs, ls; break
    f = font(fsize)
    y = 70
    for ln in lines:
        bb = draw.textbbox((0, 0), ln, font=f)
        x = (W - (bb[2]-bb[0])) // 2
        draw.text((x, y), ln, font=f, fill=(255, 222, 0), stroke_width=max(6, fsize//14), stroke_fill=(20, 20, 20))
        y += (bb[3]-bb[1]) + fsize//5

    # ── "비교!" 배지: 하단 우측, 청록 라운드 박스 ──
    bf = font(64)
    bb = draw.textbbox((0, 0), badge, font=bf)
    bw, bh = bb[2]-bb[0], bb[3]-bb[1]
    pad = 26
    bx2, by2 = W - 40, H - 40
    bx1, by1 = bx2 - bw - pad*2, by2 - bh - pad*2
    draw.rounded_rectangle([bx1, by1, bx2, by2], radius=18, fill=(0, 200, 170, 255))
    draw.text((bx1 + pad, by1 + pad - bb[1]), badge, font=bf, fill=(255, 255, 255),
              stroke_width=3, stroke_fill=(0, 120, 100))

    # ── 사이트명: 하단 좌측 ──
    sf = font(30)
    draw.text((44, H - 66), 'info-how.com', font=sf, fill=(255, 255, 255),
              stroke_width=3, stroke_fill=(0, 0, 0))

    return img.convert('RGB')

def main():
    jp = os.path.join(ROOT, '_scripts', '.thumbjobs.json')
    if not os.path.exists(jp):
        print('X .thumbjobs.json 없음'); sys.exit(1)
    jobs = json.load(open(jp, encoding='utf-8'))
    n = 0
    for j in jobs:
        out = os.path.join(ROOT, j['out'])
        os.makedirs(os.path.dirname(out), exist_ok=True)
        img = make(j.get('label') or j.get('title') or '', j.get('prompt', ''), j.get('badge', '비교!'), j.get('color', 0))
        img.save(out, 'PNG', optimize=True)
        print(f"OK {j['out']}")
        n += 1
    print(f"완료: 썸네일 {n}개")

if __name__ == '__main__':
    main()
