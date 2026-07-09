// ============================================================
// keywords.cjs — 제휴 리뷰용 키워드 자동발굴
//
// 파이프라인: 시드 제품군 → 네이버/구글 자동완성 재귀(수요 발굴)
//   → 구매의도 필터 → 쿠팡 API 수익성 검증(상품수·중앙가) → 기존글 제외
//   → 점수순 queue.json 생성 → (Claude가 큐 읽고 글 작성)
//
// CLI:
//   node _scripts/auto/keywords.cjs discover                 (기본 시드)
//   node _scripts/auto/keywords.cjs discover 무선청소기 가습기   (시드 지정)
//   node _scripts/auto/keywords.cjs top 10                   (queue.json 상위 N)
//
// 자동완성 로직은 autokeyword/golden_keyword/discovery.py(실검증) 이식.
// ============================================================
const fs = require('fs');
const path = require('path');
const coupang = require('./coupang.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const QUEUE = path.join(__dirname, 'queue.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

// 기본 시드 = 제휴 수익 잘 나는 제품군 (physical goods, 쿠팡 재고 풍부)
const DEFAULT_SEEDS = [
  '제습기', '가습기', '무선청소기', '공기청정기', '선풍기', '서큘레이터',
  '전기장판', '온수매트', '가전', '커피머신', '에어프라이어', '전기포트',
  '캠핑의자', '캠핑테이블', '텐트', '아이스박스', '캠핑랜턴',
  '유모차', '아기욕조', '젖병소독기', '분유포트',
  '전동칫솔', '체중계', '안마기', '족욕기', '마사지건',
  '게이밍마우스', '기계식키보드', '모니터암', '노트북거치대'
];

// 구매의도(리뷰글로 만들만한) 접미사
const INTENT_RE = /(추천|비교|순위|가성비|best|후기|vs|top)/i;
// 정보성(제품 아님) — 이런 변형은 제외
const INFO_RE = /(전기세|전기요금|원리|뜻|고장|as|a\/s|소음|사용법|청소|필터교체|중고|렌탈|대여|무료|나눔)/i;

async function naverAC(word, max = 10) {
  const url = 'https://ac.search.naver.com/nx/ac?' + new URLSearchParams({
    con: '0', frm: 'nv', ans: '2', r_format: 'json', r_enc: 'UTF-8', r_unicode: '0',
    t_koreng: '1', run: '2', rev: '4', q_enc: 'UTF-8', st: '100', q: word
  });
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Referer': 'https://www.naver.com/' } });
    const j = await r.json();
    const items = (j.items && j.items[0]) || [];
    return items.map(e => String(e[0]).trim()).filter(s => s && s !== word).slice(0, max);
  } catch { return []; }
}

async function googleAC(word, max = 10) {
  const url = 'https://suggestqueries.google.com/complete/search?' + new URLSearchParams({ client: 'firefox', hl: 'ko', q: word });
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    const j = await r.json();
    return (j[1] || []).map(s => String(s).trim()).filter(Boolean).slice(0, max);
  } catch { return []; }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// 시드 → 자동완성 재귀(depth 2)로 롱테일 제품 변형 발굴
async function expandSeeds(seeds, depth = 2) {
  const found = new Map(); // keyword → {sources:Set}
  const add = (kw, src) => {
    kw = kw.replace(/\s+/g, ' ').trim();
    if (kw.length < 2 || kw.length > 25) return;
    if (!found.has(kw)) found.set(kw, new Set());
    found.get(kw).add(src);
  };

  // Level 1: 시드 자체 + 네이버 자동완성
  const level1 = [];
  for (const s of seeds) {
    add(s, 'seed');
    const nv = await naverAC(s);
    nv.forEach(k => { add(k, 'naver'); level1.push(k); });
    await sleep(250);
  }

  // Level 2: L1 상위(제품형만) 재귀
  if (depth >= 2) {
    const l2seeds = level1.filter(k => !INFO_RE.test(k)).slice(0, 40);
    for (const s of l2seeds) {
      const nv = await naverAC(s, 6);
      nv.forEach(k => add(k, 'naver2'));
      await sleep(200);
    }
  }
  return found;
}

// 제품 명사 추출: "소형 제습기 추천" → "소형 제습기" (쿠팡 검색용)
function toProductQuery(kw) {
  return kw.replace(INTENT_RE, '').replace(/\s+/g, ' ').trim();
}

// 후보를 리뷰글 주제로 정규화: 항상 "{제품} 추천" 형태로
function toTopic(productQuery) {
  return `${productQuery} 추천`;
}

// slug 생성 (영문 카테고리 없으니 제품명 로마자 대신 해시식 안전 slug)
function toSlug(productQuery) {
  // 한글 → best-{한글압축}. 실제 slug는 사람이 다듬을 수 있게 제안만.
  const base = productQuery.replace(/\s+/g, '-');
  return `review-${Buffer.from(base).toString('hex').slice(0, 10)}`;
}

// 기존 리뷰/서식과 중복 제거용 기존 키워드 로드
function existingTopics() {
  const set = new Set();
  try {
    const reviews = require(path.join(ROOT, '_scripts', 'reviews-data.cjs'));
    for (const r of reviews) {
      set.add(r.slug);
      (r.keywords || '').split(',').forEach(k => set.add(k.trim()));
      // 제목의 제품명도 대략 반영
    }
  } catch {}
  return set;
}

// 쿠팡 수익성 점수: 상품수·중앙가
async function monetize(productQuery) {
  try {
    const items = await coupang.search(productQuery, 10);
    const priced = items.filter(p => p.productPrice > 0);
    if (!priced.length) return { count: 0, median: 0, rocket: 0 };
    const prices = priced.map(p => p.productPrice).sort((a, b) => a - b);
    const median = prices[Math.floor(prices.length / 2)];
    const rocket = priced.filter(p => p.isRocket).length;
    return { count: priced.length, median, rocket };
  } catch (e) {
    return { count: 0, median: 0, rocket: 0, err: e.message };
  }
}

async function discover(seeds) {
  console.log(`[1/4] 시드 ${seeds.length}개 자동완성 확장 중...`);
  const expanded = await expandSeeds(seeds, 2);
  console.log(`  → ${expanded.size}개 키워드 수집`);

  // 후보 = 제품형(정보성 제외). 띄어쓰기·어순 변형은 한 글감으로 병합.
  //   canonical key = 공백제거 후 글자 정렬 (제습기공기청정기 == 공기청정제습기)
  //   대표 표기 = 최단 변형
  const canon = new Map(); // canonKey → {rep, variants:Set, sources:Set}
  const canonKey = pq => [...pq.replace(/\s+/g, '')].sort().join('');
  for (const [kw, srcs] of expanded) {
    if (INFO_RE.test(kw)) continue;
    const pq = toProductQuery(kw);
    if (pq.length < 2 || pq.length > 20) continue;
    const k = canonKey(pq);
    if (!canon.has(k)) canon.set(k, { rep: pq, variants: new Set(), sources: new Set() });
    const e = canon.get(k);
    if (pq.length < e.rep.length) e.rep = pq; // 최단 표기를 대표로
    e.variants.add(kw);
    srcs.forEach(s => e.sources.add(s));
  }
  // rep 기준 후보 맵으로 변환
  const cand = new Map();
  for (const e of canon.values()) cand.set(e.rep, { variants: e.variants, sources: e.sources });
  console.log(`[2/4] 제품 후보 ${cand.size}개 (정보성 제외, 근사중복 병합)`);

  // 이미 다룬 주제 제외
  const existing = existingTopics();

  // demand 정렬 후 상위만 쿠팡 검증(API 호출 절약)
  const ranked = [...cand.entries()]
    .map(([pq, v]) => ({ pq, demand: v.variants.size, sources: [...v.sources] }))
    .filter(c => !existing.has(c.pq) && !existing.has(toSlug(c.pq)))
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 35); // 쿠팡 검증 상한

  console.log(`[3/4] 상위 ${ranked.length}개 쿠팡 수익성 검증 중...`);
  const results = [];
  for (const c of ranked) {
    const m = await monetize(c.pq);
    // 수익성 점수: 상품수 × 중앙가(수수료잠재력, 소비자가 30만 상한) × 로켓비율
    //   상한 없으면 산업용 79만원짜리(수요0·사업자용)가 소비자 제품을 눌러버림
    const cappedPrice = Math.min(m.median, 300000);
    const monScore = m.count === 0 ? 0
      : Math.min(m.count, 10) * (Math.log10(cappedPrice + 1)) * (0.6 + 0.4 * (m.rocket / m.count));
    // 수요(자동완성 변형수) 가중 상향 → 대중 제품이 니치를 이기게
    const demandScore = Math.min(c.demand, 12) * 6;
    const score = Math.round(monScore * 4 + demandScore);
    results.push({
      topic: toTopic(c.pq),
      productQuery: c.pq,
      slugSuggest: toSlug(c.pq),
      score,
      coupangCount: m.count,
      medianPrice: m.median,
      rocket: m.rocket,
      demandVariants: c.demand,
      sampleVariants: [...(cand.get(c.pq).variants)].slice(0, 5)
    });
    await sleep(300);
  }

  results.sort((a, b) => b.score - a.score);
  const queue = results.filter(r => r.coupangCount >= 3); // 상품 3개 미만=수익불가, 제외
  fs.writeFileSync(QUEUE, JSON.stringify(queue, null, 1), 'utf8');
  console.log(`[4/4] ✓ queue.json 생성: 발굴 ${queue.length}개 (상품 3+ 수익가능)\n`);

  // 상위 12개 표
  printTop(queue.slice(0, 12));
  return queue;
}

function printTop(rows) {
  console.log('순위 | 점수 | 상품수 | 중앙가 | 수요 | 주제');
  console.log('-'.repeat(70));
  rows.forEach((r, i) => {
    console.log(
      `${String(i + 1).padStart(2)} | ${String(r.score).padStart(4)} | ${String(r.coupangCount).padStart(3)}개(로켓${r.rocket}) | ${r.medianPrice.toLocaleString().padStart(8)}원 | ${String(r.demandVariants).padStart(2)} | ${r.topic}`
    );
  });
}

// ── CLI ──
if (require.main === module) {
  const [cmd, ...args] = process.argv.slice(2);
  (async () => {
    if (cmd === 'discover') {
      const seeds = args.length ? args : DEFAULT_SEEDS;
      await discover(seeds);
    } else if (cmd === 'top') {
      const n = parseInt(args[0] || '10', 10);
      const q = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
      printTop(q.slice(0, n));
    } else {
      console.log('사용: node keywords.cjs discover [시드...] | top [N]');
    }
  })().catch(e => { console.error('X', e.message); process.exit(1); });
}

module.exports = { discover, naverAC, googleAC, monetize };
