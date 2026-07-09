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

def _rotated_badge(text, fnt, fill, txt_fill, pad_x=22, pad_y=12, radius=16, angle=-8, stroke=(120,10,0)):
    """텍스트 라운드 배지를 만들어 회전한 RGBA 이미지 반환."""
    d0 = ImageDraw.Draw(Image.new('RGBA', (10, 10)))
    bb = d0.textbbox((0, 0), text, font=fnt)
    tw, th = bb[2]-bb[0], bb[3]-bb[1]
    bw, bh = tw + pad_x*2, th + pad_y*2
    im = Image.new('RGBA', (bw, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, bw-1, bh-1], radius=radius, fill=fill)
    d.text((pad_x - bb[0], pad_y - bb[1]), text, font=fnt, fill=txt_fill, stroke_width=3, stroke_fill=stroke)
    return im.rotate(angle, expand=True, resample=Image.BICUBIC)

def make(label, hook, top, prompt, badge, color_idx):
    img = cover(fetch_bg(prompt, color_idx)).convert('RGBA')

    # 가독성: 상단·하단 어둠 스크림 (상단 강하게 — 텍스트존)
    scrim = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scrim)
    for y in range(H):
        a = 0
        if y < 360: a = int(175 * (1 - y / 360))          # 상단(라벨+후킹)
        elif y > 560: a = int(140 * ((y - 560) / 240))     # 하단(배지)
        sd.line([(0, y), (W, y)], fill=(0, 0, 0, a))
    img = Image.alpha_composite(img, scrim)
    draw = ImageDraw.Draw(img, 'RGBA')
    draw.rectangle([0, 0, W-1, H-1], outline=(255, 255, 255, 210), width=10)

    # ── TOP 3 빨강 배지 (좌상단, 살짝 기울임) ──
    if top:
        badge_top = _rotated_badge(top, font(46), (232, 53, 14, 255), (255, 255, 255))
        img.alpha_composite(badge_top, (34, 30))
        draw = ImageDraw.Draw(img, 'RGBA')

    # ── 2026 노랑 태그 (우상단) ──
    yf = font(38)
    yb = draw.textbbox((0, 0), '2026', font=yf)
    yw, yh = yb[2]-yb[0], yb[3]-yb[1]
    draw.rounded_rectangle([W-40-yw-32, 34, W-40, 34+yh+22], radius=12, fill=(255, 210, 0, 255))
    draw.text((W-40-yw-16, 34+11-yb[1]), '2026', font=yf, fill=(30, 30, 30))

    # ── 메인 라벨: 노랑 + 검정 외곽선 ──
    fsize, lines = 96, [label]
    for fs in range(112, 48, -4):
        f = font(fs)
        ls = wrap(draw, label, f, 640)
        h = sum(draw.textbbox((0, 0), l, font=f)[3] for l in ls) + (len(ls)-1)*10
        if h <= 250 and all(draw.textbbox((0,0), l, font=f)[2] <= 640 for l in ls):
            fsize, lines = fs, ls; break
    f = font(fsize)
    y = 150
    for ln in lines:
        bb = draw.textbbox((0, 0), ln, font=f)
        draw.text(((W-(bb[2]-bb[0]))//2, y), ln, font=f, fill=(255, 222, 0),
                  stroke_width=max(6, fsize//14), stroke_fill=(20, 20, 20))
        y += (bb[3]-bb[1]) + fsize//5

    # ── 후킹 문구: 라벨 아래, 흰 글씨 + 반투명 검정 라운드 바 ──
    if hook:
        hf = font(44)
        for hs in range(52, 28, -3):
            hf = font(hs)
            if draw.textbbox((0, 0), hook, font=hf)[2] <= 620: break
        hb = draw.textbbox((0, 0), hook, font=hf)
        hw, hh = hb[2]-hb[0], hb[3]-hb[1]
        px, py = 26, 14
        hx1 = (W - hw)//2 - px; hy1 = y + 6
        draw.rounded_rectangle([hx1, hy1, hx1+hw+px*2, hy1+hh+py*2], radius=14, fill=(0, 0, 0, 150))
        draw.text((hx1+px-hb[0], hy1+py-hb[1]), hook, font=hf, fill=(255, 255, 255))

    # ── "비교!" 청록 배지 (우하단) ──
    bf = font(60)
    bb = draw.textbbox((0, 0), badge, font=bf)
    bw, bh = bb[2]-bb[0], bb[3]-bb[1]
    pad = 24
    bx2, by2 = W-40, H-40
    bx1, by1 = bx2-bw-pad*2, by2-bh-pad*2
    draw.rounded_rectangle([bx1, by1, bx2, by2], radius=18, fill=(0, 200, 170, 255))
    draw.text((bx1+pad-bb[0], by1+pad-bb[1]), badge, font=bf, fill=(255, 255, 255),
              stroke_width=3, stroke_fill=(0, 120, 100))

    # ── 사이트명 (좌하단) ──
    draw.text((44, H-64), 'info-how.com', font=font(30), fill=(255, 255, 255),
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
        img = make(j.get('label') or j.get('title') or '', j.get('hook', ''), j.get('top', ''), j.get('prompt', ''), j.get('badge', '비교!'), j.get('color', 0))
        img.save(out, 'PNG', optimize=True)
        print(f"OK {j['out']}")
        n += 1
    print(f"완료: 썸네일 {n}개")

if __name__ == '__main__':
    main()
