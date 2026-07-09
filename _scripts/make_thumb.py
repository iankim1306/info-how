# -*- coding: utf-8 -*-
# make_thumb.py — 리뷰 글 썸네일 생성 (wp_autoposter make_thumbnail 이식판)
# 사용: build-reviews.cjs 실행 후  python _scripts/make_thumb.py
#      (_scripts/.thumbjobs.json 을 읽어 reviews/{slug}/thumb.png 생성)
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FONT_PATHS = [
    'C:/Windows/Fonts/malgunbd.ttf',
    'C:/Windows/Fonts/malgun.ttf',
    'C:/Windows/Fonts/gulim.ttc',
]

COLOR_SCHEMES = [
    {'bg': (30, 41, 59),   'accent': (56, 89, 138),  'text': (255, 255, 255), 'sub': (148, 197, 255)},  # 0 네이비
    {'bg': (24, 60, 48),   'accent': (34, 120, 90),  'text': (255, 255, 255), 'sub': (167, 243, 208)},  # 1 그린
    {'bg': (49, 46, 129),  'accent': (99, 102, 241), 'text': (255, 255, 255), 'sub': (199, 210, 254)},  # 2 인디고
    {'bg': (120, 53, 15),  'accent': (217, 119, 6),  'text': (255, 255, 255), 'sub': (253, 230, 138)},  # 3 앰버
    {'bg': (76, 29, 79),   'accent': (162, 62, 160), 'text': (255, 255, 255), 'sub': (240, 200, 245)},  # 4 퍼플
]

def get_font(size):
    for fp in FONT_PATHS:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                continue
    return ImageFont.load_default()

def make_thumbnail(title, color_idx=0, label='PRODUCT REVIEW'):
    s = COLOR_SCHEMES[color_idx % len(COLOR_SCHEMES)]
    bg, acc, tc, sc = s['bg'], s['accent'], s['text'], s['sub']

    W = H = 800
    img = Image.new('RGB', (W, H), bg)
    draw = ImageDraw.Draw(img, 'RGBA')

    # 그라디언트 배경
    for y in range(H):
        t = y / H
        draw.line([(0, y), (W, y)], fill=(
            int(bg[0]*(1-t) + acc[0]*t),
            int(bg[1]*(1-t) + acc[1]*t),
            int(bg[2]*(1-t) + acc[2]*t)))

    # 테두리
    draw.rectangle([0, 0, W-1, H-1], outline=(*tc, 60), width=12)
    draw.rectangle([18, 18, W-19, H-19], outline=(*tc, 35), width=2)

    # 라벨
    lf = get_font(24)
    bb = draw.textbbox((0, 0), label, font=lf)
    draw.text(((W-(bb[2]-bb[0]))//2, 165), label, fill=(*sc, 220), font=lf)
    draw.rectangle([120, 212, W-120, 215], fill=(*tc, 90))

    # 제목: 자동 줄바꿈 + 자동 폰트 축소
    words = title.strip().split()

    def wrap(words, font, max_w):
        lines, cur = [], []
        for w in words:
            test = ' '.join(cur + [w])
            b = draw.textbbox((0, 0), test, font=font)
            if b[2] - b[0] > max_w and cur:
                lines.append(' '.join(cur)); cur = [w]
            else:
                cur.append(w)
        if cur:
            lines.append(' '.join(cur))
        return lines

    MAX_W, MAX_H = 640, 360
    font, lines = get_font(30), [title]
    for fsize in range(76, 24, -2):
        f = get_font(fsize)
        ls = wrap(words, f, MAX_W)
        total = sum(draw.textbbox((0, 0), ln, font=f)[3] for ln in ls) + (len(ls)-1)*16
        if total <= MAX_H:
            font, lines = f, ls
            break

    total = sum(draw.textbbox((0, 0), ln, font=font)[3] for ln in lines) + (len(lines)-1)*16
    y = 240 + (MAX_H - total)//2
    for ln in lines:
        b = draw.textbbox((0, 0), ln, font=font)
        draw.text(((W-(b[2]-b[0]))//2, y), ln, fill=tc, font=font)
        y += b[3] + 16

    # 하단 구분선 + 사이트명
    draw.rectangle([120, 640, W-120, 643], fill=(*tc, 90))
    sf = get_font(26)
    site = 'info-how.com'
    bb = draw.textbbox((0, 0), site, font=sf)
    draw.text(((W-(bb[2]-bb[0]))//2, 668), site, fill=(*sc, 220), font=sf)

    return img

def main():
    jobs_path = os.path.join(ROOT, '_scripts', '.thumbjobs.json')
    if not os.path.exists(jobs_path):
        print('X .thumbjobs.json 없음 — 먼저 node _scripts/build-reviews.cjs 실행'); sys.exit(1)
    jobs = json.load(open(jobs_path, encoding='utf-8'))
    n = 0
    for j in jobs:
        out = os.path.join(ROOT, j['out'])
        os.makedirs(os.path.dirname(out), exist_ok=True)
        img = make_thumbnail(j['title'], j.get('color', 0))
        img.save(out, 'PNG', optimize=True)
        print(f"OK {j['out']}")
        n += 1
    print(f"완료: 썸네일 {n}개 생성")

if __name__ == '__main__':
    main()
