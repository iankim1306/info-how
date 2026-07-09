// build-reviews.cjs — reviews-data.cjs → reviews/index.html + reviews/{slug}/index.html
// 실행: node _scripts/build-reviews.cjs
// 이후: python _scripts/make_thumb.py  (썸네일 PNG 생성)
//       node _scripts/build-forms.cjs  (sitemap에 리뷰 URL 반영)
const fs = require('fs');
const path = require('path');
const reviews = require('./reviews-data.cjs');

const ROOT = path.resolve(__dirname, '..');
const ADSENSE = 'ca-pub-7852008102553944';
const BASE = 'https://info-how.com';

// ★ 쿠팡파트너스 "홈/골드박스" 링크 — 상단 고지배너 클릭 시 이동.
//   partners.coupang.com → 링크 생성(쿠팡 홈 or 골드박스) → 여기 붙여넣기.
//   이 링크 타고 들어간 사람이 24시간 내 뭘 사든 수수료가 잡힙니다.
//   비어 있으면 배너가 클릭 안 되는 일반 고지문으로 표시됩니다.
const COUPANG_BANNER_LINK = '';

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const AD = `<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="0000000000" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`;
const DISCLOSURE = `<p class="rv-disclosure">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>`;

// 상단 고지 배너: 링크 있으면 클릭형(쿠팡 이동), 없으면 일반 고지문
const TOP_BANNER = COUPANG_BANNER_LINK
  ? `<a class="rv-banner" href="${COUPANG_BANNER_LINK}" target="_blank" rel="nofollow sponsored noopener">
<span class="rv-banner-note">파트너스 활동의 일환으로 일정액의 수수료를 지급받습니다</span>
<span class="rv-banner-cta">🛒 오늘의 쿠팡 특가 보러가기 →</span>
</a>`
  : DISCLOSURE;

function head(title, desc, canonical, og, extraJsonLd){
  return `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google-site-verification" content="6Yk8hNMiHDdWrRzcEJn1hf99kJAFrkWbrbBa5kMpxsY">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
${og?`<meta property="og:image" content="${og}">`:''}
<meta name="google-adsense-account" content="${ADSENSE}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>
${extraJsonLd||''}
<link rel="stylesheet" href="/home.css">
<link rel="stylesheet" href="/reviews.css">
</head><body>`;
}

function header(){
  return `<header class="site-header"><div class="header-inner">
<a href="/" class="logo">생활서식 <span>모음</span></a>
<nav class="header-nav">
<a href="/reviews/">제품리뷰</a>
<a href="/?cat=직장">직장서식</a>
<a href="/?cat=부동산">부동산</a>
<a href="/?cat=법률">법률서식</a>
</nav></div></header>`;
}

function footer(){
  return `<footer class="site-footer"><div class="footer-inner">
<p class="footer-brand">생활서식 모음 · info-how.com</p>
<p>무료 생활서식과 제품 비교 리뷰를 제공합니다.</p>
<div class="footer-links"><a href="/about/">소개</a> · <a href="/privacy/">개인정보처리방침</a> · <a href="/contact/">문의</a></div>
<p class="footer-note">파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.<br>※ 리뷰 내 가격·스펙은 작성 시점 기준이며 변동될 수 있습니다. 구매 전 판매 페이지에서 최종 확인하세요.</p>
</div></footer>`;
}

// CTA 버튼: 링크 없으면 비활성 표시
function ctaRow(p){
  const btns = [];
  if (p.linkCoupang) btns.push(`<a class="cta cta-coupang" href="${p.linkCoupang}" target="_blank" rel="nofollow sponsored noopener">쿠팡 최저가 확인 →</a>`);
  if (p.linkNaver)   btns.push(`<a class="cta cta-naver" href="${p.linkNaver}" target="_blank" rel="nofollow sponsored noopener">네이버 최저가 확인 →</a>`);
  if (!btns.length)  btns.push(`<span class="cta cta-off">최저가 링크 준비중</span>`);
  return `<div class="cta-row">${btns.join('')}</div>`;
}

function productImg(p, cls, phCls){
  if (p.image) return `<img class="${cls}" src="${p.image}" alt="${esc(p.imageAlt||p.name)}" width="150" height="150" loading="lazy">`;
  return `<div class="${phCls}">${esc(p.imageAlt||p.name)}</div>`;
}

function buildArticle(r){
  const url = `${BASE}/reviews/${r.slug}/`;
  const thumb = `${BASE}/reviews/${r.slug}/thumb.png`;

  // JSON-LD
  const faqLd = (r.faq&&r.faq.length)?`<script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org","@type":"FAQPage",
    mainEntity:r.faq.map(q=>({"@type":"Question",name:q.q,acceptedAnswer:{"@type":"Answer",text:q.a}}))
  })}</script>`:'';
  const artLd = `<script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org","@type":"Article",
    headline:r.title, description:r.desc, datePublished:r.date,
    image:thumb, author:{"@type":"Organization",name:"생활서식 모음"},
    mainEntityOfPage:url
  })}</script>`;
  const bcLd = `<script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org","@type":"BreadcrumbList",
    itemListElement:[
      {"@type":"ListItem",position:1,name:"홈",item:`${BASE}/`},
      {"@type":"ListItem",position:2,name:"제품리뷰",item:`${BASE}/reviews/`},
      {"@type":"ListItem",position:3,name:r.title,item:url}
    ]})}</script>`;

  // 인트로
  const intro = (r.intro||[]).map(b=>`<p>${b.p}</p>`).join('\n');

  // 빠른 선택
  const quick = r.quickPick?`
<h2 class="rv-inv">${esc(r.h1)} — 결론 먼저</h2>
<p>${r.quickPick.lead}</p>
<ul class="rv-quick">
${r.quickPick.items.map(i=>`<li>${i.text} → <a href="#${i.anchor}">${esc(i.label)}</a></li>`).join('\n')}
</ul>`:'';

  // 제품 카드
  const cards = (r.products||[]).map((p,idx)=>`
<hr>
<article class="pcard" id="${p.id}">
  <div class="pcard-head"><span class="pcard-num">${idx+1}</span><span class="pcard-cat">${esc(p.subtitle)}</span></div>
  <div class="pcard-top">
    <span class="rv-tag rv-tag-${p.tagColor}">${esc(p.tag)}</span>
    ${productImg(p,'pcard-img','pcard-img-ph')}
    <div>
      <div class="pcard-award">${esc(p.award)}</div>
      <h3 class="pcard-name">${esc(p.name)}</h3>
      <ul class="pcard-feats">${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>
    </div>
  </div>
  <p class="pcard-summary">${p.summary}</p>
  <hr class="hr-dash">
  <strong class="pcard-label">추천 대상</strong>
  <ul class="plain">${p.forWho.map(x=>`<li>${x}</li>`).join('')}</ul>
  <strong class="pcard-label">장점</strong>
  <ul class="plain pros">${p.pros.map(x=>`<li>${x}</li>`).join('')}</ul>
  <strong class="pcard-label">단점</strong>
  <ul class="plain cons">${p.cons.map(x=>`<li>${x}</li>`).join('')}</ul>
  ${p.consNote?`<p>${p.consNote}</p>`:''}
  <strong class="pcard-label">한줄 리뷰</strong>
  <p class="pcard-review">${p.review}</p>
  <strong class="pcard-label">주요 스펙</strong>
  <ul class="plain">${p.specs.map(x=>`<li>${esc(x)}</li>`).join('')}<li><small>※ 실제 스펙·가격과 차이가 있을 수 있습니다</small></li></ul>
  ${ctaRow(p)}
</article>`).join('\n');

  // 비교표
  const cmpHead = (r.products||[]).map(p=>`<td>
<span class="rv-tag rv-tag-${p.tagColor}">${esc(p.tag)}</span>
<div class="cmp-prod">
${productImg(p,'','cmp-ph')||''}
<span class="cmp-name">${esc(p.name.replace(/^\d+\.\s*/,''))}</span>
${p.linkCoupang?`<a class="cmp-cta" href="${p.linkCoupang}" target="_blank" rel="nofollow sponsored noopener">최저가 →</a>`:(p.linkNaver?`<a class="cmp-cta" href="${p.linkNaver}" target="_blank" rel="nofollow sponsored noopener">최저가 →</a>`:'')}
</div></td>`).join('');
  const cmpRows = (r.compare||[]).map(row=>`<tr><th class="sticky">${row.label}</th>${row.vals.map((v,i)=>`<td${row.strong===i+1?' class="best"':''}>${v}${row.strong===i+1?' <span class="badge">최고</span>':''}</td>`).join('')}</tr>`).join('\n');
  const cmpTable = (r.compare&&r.compare.length)?`
<h2 class="rv-inv">스펙 비교표: 한눈에 보기</h2>
<p>가격·풍량·무게 중 본인에게 중요한 기준부터 보세요. "최고" 표시는 3제품 중 객관적 1위 값입니다.</p>
<p class="cmp-hint">← 좌우로 스크롤 →</p>
<div class="cmp-wrap"><div class="cmp-scroll"><table class="cmp">
<thead><tr><th class="sticky">제품 정보</th>${cmpHead}</tr></thead>
<tbody>${cmpRows}</tbody>
</table></div></div>`:'';

  // 가이드
  const guide = (r.guide||[]).map(b=>{
    if(b.h2) return `<h2 class="rv-inv">${esc(b.h2)}</h2>`;
    if(b.h3) return `<h3>${esc(b.h3)}</h3>`;
    if(b.p) return `<p>${b.p}</p>`;
    if(b.ul) return `<ul class="plain">${b.ul.map(li=>`<li>${li}</li>`).join('')}</ul>`;
    if(b.ol) return `<ol>${b.ol.map(li=>`<li>${li}</li>`).join('')}</ol>`;
    return '';
  }).join('\n');

  // FAQ
  const faq = (r.faq&&r.faq.length)?`
<h2 class="rv-inv">자주 묻는 질문 (FAQ)</h2>
<div class="rv-faq">
${r.faq.map((q,i)=>`<details><summary>Q${i+1}. ${esc(q.q)}</summary><div class="ans"><p>${q.a}</p></div></details>`).join('\n')}
</div>`:'';

  // 결론
  const concl = (r.conclusion&&r.conclusion.length)?`
<h2 class="rv-inv">결론: 한 줄 요약</h2>
<ul class="rv-concl">${r.conclusion.map(c=>`<li>${c}</li>`).join('\n')}</ul>`:'';

  return head(r.title, r.desc, url, thumb, artLd+bcLd+faqLd)
+ header()
+ `<div class="container"><div class="rv">
<nav class="breadcrumb"><a href="/">홈</a> › <a href="/reviews/">제품리뷰</a> › ${esc(r.category)}</nav>
<div class="rv-hero">
<h1>${esc(r.h1)}</h1>
<p class="meta">작성: 생활서식 모음 · ${r.date}</p>
<img src="thumb.png" alt="${esc(r.h1)}" width="190" height="190">
</div>
${TOP_BANNER}
${intro}
${AD}
${quick}
${cards}
${cmpTable}
${AD}
${guide}
${faq}
${concl}
${DISCLOSURE}
</div></div>`
+ footer() + `</body></html>`;
}

// 리뷰 목록 페이지
function buildList(){
  const cards = reviews.map(r=>`<a href="/reviews/${r.slug}/">
<img src="/reviews/${r.slug}/thumb.png" alt="${esc(r.h1)}" loading="lazy">
<div class="t">${esc(r.title)}</div>
<div class="d">${esc(r.category)} · ${r.date}</div>
</a>`).join('\n');
  const ld = `<script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org","@type":"ItemList",
    itemListElement:reviews.map((r,i)=>({"@type":"ListItem",position:i+1,name:r.title,url:`${BASE}/reviews/${r.slug}/`}))
  })}</script>`;
  return head('제품 비교 리뷰 모음 | 생활서식 모음','가전·생활용품을 가격·스펙 기준으로 직접 비교한 구매가이드 리뷰 모음입니다.',`${BASE}/reviews/`,null,ld)
+ header()
+ `<div class="container"><div class="rv">
<div class="rv-hero"><h1>제품 비교 리뷰</h1><p class="meta">가격·스펙 기준으로 딱 정해드리는 구매가이드</p></div>
${TOP_BANNER}
${AD}
<div class="rvlist">${cards}</div>
</div></div>`
+ footer() + `</body></html>`;
}

// ─── 실행 ───
let n=0;
const thumbJobs=[];
for (const r of reviews){
  const dir=path.join(ROOT,'reviews',r.slug);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'), buildArticle(r),'utf8');
  thumbJobs.push({title:r.thumbTitle||r.h1, out:`reviews/${r.slug}/thumb.png`, color:r.thumbColor||0});
  n++;
}
fs.mkdirSync(path.join(ROOT,'reviews'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'reviews','index.html'), buildList(),'utf8');
fs.writeFileSync(path.join(ROOT,'_scripts','.thumbjobs.json'), JSON.stringify(thumbJobs,null,1),'utf8');
console.log(`✓ 리뷰 목록 + 글 ${n}개 생성. 다음: python _scripts/make_thumb.py && node _scripts/build-forms.cjs`);
