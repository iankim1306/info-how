// forms-data.cjs → 정적 사이트 생성 (index.html + forms/{id}/index.html)
const fs = require('fs');
const path = require('path');
const forms = require('./forms-data.cjs');

const ROOT = path.resolve(__dirname, '..');
const ADSENSE = 'ca-pub-7852008102553944';
const BASE = 'https://info-how.com';
const CATS = ['직장', '부동산', '법률', '생활'];

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// 공통 head
function head(title, desc, canonical, extraJsonLd) {
  return `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google-site-verification" content="6Yk8hNMiHDdWrRzcEJn1hf99kJAFrkWbrbBa5kMpxsY">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta name="google-adsense-account" content="${ADSENSE}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>
${extraJsonLd || ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="/home.css">
</head><body>`;
}

function header() {
  return `<header class="site-header"><div class="header-inner">
<a href="/" class="logo">생활서식 <span>모음</span></a>
<nav class="header-nav">
<a href="/reviews/">제품리뷰</a>
<a href="/?cat=직장">직장서식</a>
<a href="/?cat=부동산">부동산</a>
<a href="/?cat=법률">법률서식</a>
</nav></div></header>`;
}

function footer() {
  return `<footer class="site-footer">
<div class="footer-inner">
<p class="footer-brand">생활서식 모음 · info-how.com</p>
<p>사직서·계약서·내용증명 등 무료 생활서식을 제공합니다.</p>
<div class="footer-links"><a href="/about/">소개</a> · <a href="/privacy/">개인정보처리방침</a> · <a href="/contact/">문의</a></div>
<p class="footer-note">※ 제공되는 서식은 표준 참고용이며 법적 효력을 보장하지 않습니다. 중요한 계약·법률 문서는 전문가 검토를 권장합니다.</p>
</div></footer>`;
}

// 메인 페이지
function buildIndex() {
  const cards = forms.map(f => `<a href="/forms/${f.id}/" class="form-card" data-cat="${f.category}">
<div class="form-card-head"><span class="form-emoji">${f.emoji}</span>
<div><div class="form-name">${esc(f.name)}</div><span class="form-badge">${f.category}</span></div></div>
<p class="form-desc">${esc(f.desc)}</p>
<div class="form-actions"><span class="act-preview">미리보기</span><span class="act-download">다운로드</span></div>
</a>`).join('\n');

  const tabs = ['전체', ...CATS].map((c, i) =>
    `<button class="cat-tab${i===0?' active':''}" data-cat="${c==='전체'?'all':c}">${c}${c==='전체'?` (${forms.length})`:` (${forms.filter(f=>f.category===c).length})`}</button>`
  ).join('');

  const itemListLd = `<script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org","@type":"ItemList",
    itemListElement: forms.map((f,i)=>({"@type":"ListItem",position:i+1,name:f.name,url:`${BASE}/forms/${f.id}/`}))
  })}</script>`;

  return head('무료 생활서식 양식 모음 | 사직서·계약서·내용증명', '사직서, 임대차계약서, 내용증명 등 생활에 필요한 서식 18종을 무료로 미리보기·인쇄·다운로드하세요.', `${BASE}/`, itemListLd)
+ header()
+ `<div class="container">
<div class="hero">
<h1>무료 생활서식 모음</h1>
<p>사직서·계약서·내용증명 등 총 ${forms.length}가지 서식을 무료로 제공합니다. 미리보기 후 인쇄하거나 텍스트 파일로 다운로드하세요.</p>
</div>
<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="0000000000" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>
<div class="cat-tabs">${tabs}</div>
<div class="form-grid" id="formGrid">${cards}</div>
</div>`
+ footer()
+ `<script>
// 카테고리 필터
var tabs=document.querySelectorAll('.cat-tab'),cards=document.querySelectorAll('.form-card');
function filter(cat){cards.forEach(function(c){c.style.display=(cat==='all'||c.dataset.cat===cat)?'':'none'});tabs.forEach(function(t){t.classList.toggle('active',t.dataset.cat===cat)})}
tabs.forEach(function(t){t.addEventListener('click',function(){filter(t.dataset.cat)})});
// URL ?cat= 처리
var p=new URLSearchParams(location.search).get('cat');if(p)filter(p);
</script></body></html>`;
}

// 서식 상세 페이지
function buildForm(f) {
  const url = `${BASE}/forms/${f.id}/`;
  const howToLd = `<script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org","@type":"HowTo",
    name:`${f.name} 작성 방법`, description:f.desc,
    step:(f.howto||[]).map((s,i)=>({"@type":"HowToStep",position:i+1,text:s}))
  })}</script>`;
  const bcLd = `<script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org","@type":"BreadcrumbList",
    itemListElement:[
      {"@type":"ListItem",position:1,name:"홈",item:`${BASE}/`},
      {"@type":"ListItem",position:2,name:f.category+"서식",item:`${BASE}/?cat=${f.category}`},
      {"@type":"ListItem",position:3,name:f.name,item:url}
    ]})}</script>`;

  const related = forms.filter(x=>x.category===f.category && x.id!==f.id).slice(0,4)
    .map(x=>`<a href="/forms/${x.id}/" class="rel-link">${x.emoji} ${esc(x.name)}</a>`).join('');

  const howtoList = (f.howto||[]).map(s=>`<li>${esc(s)}</li>`).join('');

  // 가이드 본문 (guide 블록 배열: {h2}|{p}|{ul}|{ol})
  const guideHTML = (f.guide||[]).map(b=>{
    if(b.h2) return `<h2>${esc(b.h2)}</h2>`;
    if(b.h3) return `<h3>${esc(b.h3)}</h3>`;
    if(b.p) return `<p>${b.p}</p>`;
    if(b.ul) return `<ul>${b.ul.map(li=>`<li>${li}</li>`).join('')}</ul>`;
    if(b.ol) return `<ol>${b.ol.map(li=>`<li>${li}</li>`).join('')}</ol>`;
    return '';
  }).join('\n');

  // FAQ + FAQPage 스키마
  const faqHTML = (f.faq||[]).map(q=>`<details class="q"><summary>${esc(q.q)}</summary><div class="a">${q.a}</div></details>`).join('\n');
  const faqLd = (f.faq&&f.faq.length)?`<script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org","@type":"FAQPage",
    mainEntity:f.faq.map(q=>({"@type":"Question",name:q.q,acceptedAnswer:{"@type":"Answer",text:q.a.replace(/<[^>]+>/g,'')}}))
  })}</script>`:'';

  return head(`${f.name} 양식 무료 다운로드 | 작성법·미리보기 | 생활서식 모음`,
    `${f.name} 표준 양식을 무료로 미리보기하고 인쇄하거나 텍스트 파일로 다운로드하세요. ${f.name} 작성법, 주의사항, 자주 묻는 질문까지 상세히 안내합니다.`,
    url, howToLd + bcLd + faqLd)
+ header()
+ `<div class="container">
<nav class="breadcrumb"><a href="/">홈</a> › <a href="/?cat=${f.category}">${f.category}서식</a> › ${esc(f.name)}</nav>
<h1 class="form-title">${f.emoji} ${esc(f.name)}</h1>
<p class="form-lead">${esc(f.desc)}</p>

<div class="tool-bar">
<button class="btn-print" onclick="window.print()">🖨 인쇄하기</button>
<button class="btn-download" id="dlBtn">⬇ 텍스트 다운로드</button>
</div>

<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE}" data-ad-slot="0000000000" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<div class="preview-box" id="previewBox">${f.bodyHTML}</div>

<section class="howto">
<h2>${esc(f.name)} 작성 방법</h2>
<ol>${howtoList}</ol>
</section>

${guideHTML?`<article class="guide">${guideHTML}</article>`:''}

${faqHTML?`<section class="faq-sec"><h2>${esc(f.name)} 자주 묻는 질문</h2>${faqHTML}</section>`:''}

${related?`<section class="related"><h2>같은 카테고리 서식</h2><div class="rel-links">${related}</div></section>`:''}
</div>`
+ footer()
+ `<script>
document.getElementById('dlBtn').addEventListener('click',function(){
var txt=${JSON.stringify(f.txt)};
var blob=new Blob(['\\uFEFF'+txt],{type:'text/plain;charset=utf-8'});
var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='${f.id}.txt';a.click();
});
</script></body></html>`;
}

// 정적 페이지 (about/privacy/contact)
function buildStatic(title, bodyHTML, slug) {
  return head(`${title} | 생활서식 모음`, `생활서식 모음 ${title}`, `${BASE}/${slug}/`)
  + header()
  + `<div class="container"><div class="static-page"><h1>${esc(title)}</h1>${bodyHTML}</div></div>`
  + footer() + `</body></html>`;
}

// ─── 실행 ───
fs.writeFileSync(path.join(ROOT,'index.html'), buildIndex(), 'utf8');
let n=0;
for (const f of forms) {
  const dir=path.join(ROOT,'forms',f.id);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'), buildForm(f), 'utf8');
  n++;
}
fs.writeFileSync(path.join(ROOT,'about','index.html'), buildStatic('사이트 소개',
  '<p>생활서식 모음(info-how.com)은 사직서, 계약서, 내용증명 등 일상과 업무에 필요한 서식을 무료로 제공하는 사이트입니다. 모든 서식은 미리보기 후 인쇄하거나 텍스트 파일로 내려받을 수 있습니다.</p><p>제공되는 서식은 표준 참고용이며, 중요한 법률·계약 문서는 반드시 전문가의 검토를 받으시기 바랍니다.</p>','about'), 'utf8');
fs.writeFileSync(path.join(ROOT,'privacy','index.html'), buildStatic('개인정보처리방침',
  '<p>본 사이트는 회원가입 없이 이용 가능하며, 서식 다운로드 시 어떠한 개인정보도 서버에 저장하지 않습니다. 모든 처리는 이용자 브라우저 내에서 이루어집니다.</p><p>본 사이트는 Google AdSense 광고를 게재하며, 광고 제공을 위해 쿠키가 사용될 수 있습니다. 이용자는 브라우저 설정에서 쿠키를 거부할 수 있습니다.</p>','privacy'), 'utf8');
fs.writeFileSync(path.join(ROOT,'contact','index.html'), buildStatic('문의',
  '<p>서식 추가 요청, 오류 제보, 제휴 문의는 아래 이메일로 보내주세요.</p><p>이메일: <a href="mailto:holy3320@gmail.com">holy3320@gmail.com</a></p>','contact'), 'utf8');

// sitemap (리뷰 글 포함)
let reviewUrls=[];
try{
  const reviews=require('./reviews-data.cjs');
  reviewUrls=[`${BASE}/reviews/`,...reviews.map(r=>`${BASE}/reviews/${r.slug}/`)];
}catch(e){/* reviews-data 없으면 서식만 */}
const urls=[`${BASE}/`,`${BASE}/about/`,`${BASE}/privacy/`,`${BASE}/contact/`,...reviewUrls,...forms.map(f=>`${BASE}/forms/${f.id}/`)];
const today=new Date().toISOString().slice(0,10);
fs.writeFileSync(path.join(ROOT,'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+
urls.map(u=>`<url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')+`\n</urlset>\n`,'utf8');

// robots + ads
fs.writeFileSync(path.join(ROOT,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`,'utf8');
fs.writeFileSync(path.join(ROOT,'ads.txt'),`google.com, pub-7852008102553944, DIRECT, f08c47fec0942fa0\n`,'utf8');

console.log(`✓ 메인 + 서식 ${n}개 + 정적3 + sitemap/robots/ads.txt 생성 완료`);
