// forms-data.cjs → 정적 사이트 생성 (index.html + forms/{id}/index.html)
const fs = require('fs');
const path = require('path');
// 2026-11-03 애드센스 심사 대비 개편
//  - forms-enrich.json : 기존 서식의 guide/faq 보강본(id 로 덮어씀)
//  - forms-new.json    : 새 서식(publishAt 예약발행 — GitHub Actions 가 매일 09:00 KST 빌드)
const TODAY = new Date().toISOString().slice(0,10);
const isLive = f => !f.publishAt || String(f.publishAt) <= TODAY;
let ENRICH = {}; try { ENRICH = require('./forms-enrich.json'); } catch(e) {}
let NEWF = []; try { NEWF = require('./forms-new.json'); } catch(e) {}
const ALL_FORMS = [...require('./forms-data.cjs'), ...NEWF].map(f => ENRICH[f.id] ? { ...f, ...ENRICH[f.id] } : f);
const forms = ALL_FORMS.filter(isLive);

const ROOT = path.resolve(__dirname, '..');
const CSSV = Date.now().toString(36); // CSS 캐시버스팅
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
<meta name="naver-site-verification" content="3fc1e5b2b3fdd06916dd0550b1637befa022d6e9" />
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
<link rel="stylesheet" href="/home.css?v=${CSSV}">
</head><body>`;
}

function header() {
  return `<header class="site-header"><div class="header-inner">
<a href="/" class="logo">info<span>-how</span></a>
<nav class="header-nav">
<a href="/">전체 서식</a>
${CATS.map(c => `<a href="/?cat=${encodeURIComponent(c)}">${c}서식</a>`).join('\n')}
<a href="/about/">소개</a>
</nav></div></header>`;
}

function footer() {
  return `<footer class="site-footer">
<div class="footer-inner">
<p class="footer-brand">info-how — 무료 생활서식 모음</p>
<p>사직서·계약서·내용증명 등 무료 생활서식을 제공합니다.</p>
<div class="footer-links"><a href="/about/">소개</a> · <a href="/privacy/">개인정보처리방침</a> · <a href="/contact/">문의</a></div>
<p class="footer-note">※ 제공되는 서식은 표준 참고용이며 법적 효력을 보장하지 않습니다. 중요한 계약·법률 문서는 전문가 검토를 권장합니다.</p>
</div></footer>`;
}

// 메인 페이지
function buildIndex(canonical) {
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

  const recent = [...forms].filter(f => f.publishAt).sort((a,b) => String(b.publishAt).localeCompare(String(a.publishAt))).slice(0,5);
  const recentHTML = recent.length ? `<section class="guide home-intro"><h2>최근 추가된 서식</h2><ul>${recent.map(f=>`<li><a href="/forms/${f.id}/">${f.emoji} ${esc(f.name)}</a> — ${esc(f.desc)}</li>`).join('')}</ul></section>` : '';

  return head('무료 생활서식 양식 모음 | 사직서·계약서·내용증명 작성법', `사직서, 임대차계약서, 내용증명 등 생활·직장에 필요한 서식 ${forms.length}종을 작성법·예시와 함께 무료로 미리보기·인쇄·다운로드하세요.`, `${canonical}`, itemListLd)
+ header()
+ `<div class="container">
<div class="hero">
<h1>무료 생활서식 모음</h1>
<p>사직서·계약서·내용증명 등 총 ${forms.length}가지 서식을 무료로 제공해요. 서식마다 언제 쓰는지, 칸마다 무엇을 적는지, 작성 예시와 자주 틀리는 부분까지 함께 정리했습니다.</p>
</div>
<div class="cat-tabs">${tabs}</div>
<div class="form-grid" id="formGrid">${cards}</div>
${recentHTML}
<section class="guide home-intro">
<h2>이렇게 이용하세요</h2>
<ol>
<li>필요한 서식을 고르면 표준 양식을 바로 미리 볼 수 있어요.</li>
<li>아래 작성 방법과 예시를 읽고 빈칸에 들어갈 내용을 정리합니다.</li>
<li>인쇄하기로 출력하거나, 텍스트 파일로 내려받아 한글·워드에 붙여 넣어 고쳐 쓰세요.</li>
</ol>
<h2>서식은 이렇게 만듭니다</h2>
<p>각 서식은 관련 법령과 정부 기관의 공개 안내를 바탕으로 꼭 필요한 항목만 담아 정리했습니다. 회원가입이나 개인정보 입력 없이 쓸 수 있고, 작성한 내용은 서버에 저장되지 않아요.</p>
<p>다만 서식은 참고용 표준 양식이에요. 회사나 기관이 정한 양식이 따로 있으면 그쪽을 우선하고, 금액이 크거나 분쟁이 걸린 문서는 변호사·법무사 상담이나 대한법률구조공단(국번 없이 132)의 도움을 받는 게 안전합니다.</p>
</section>
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

  const sameCat = forms.filter(x=>x.category===f.category && x.id!==f.id);
  const otherCat = forms.filter(x=>x.category!==f.category);
  const related = [...sameCat.slice(0,4), ...otherCat.slice((forms.indexOf(f)*2)%Math.max(1,otherCat.length)).concat(otherCat).slice(0,2)]
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
const UPDATED = '2026-11-03'; // 서식 보강·개편일 (사이트맵 lastmod — 매일 바뀌지 않게 고정)
fs.mkdirSync(path.join(ROOT,'forms'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'index.html'), buildIndex(`${BASE}/`), 'utf8');          // 홈 = 서식 첫 화면
fs.writeFileSync(path.join(ROOT,'forms','index.html'), buildIndex(`${BASE}/`), 'utf8');  // 옛 주소 /forms/ 도 같은 화면(정규 주소는 홈)
let n=0;
for (const f of forms) {
  const dir=path.join(ROOT,'forms',f.id);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'), buildForm(f), 'utf8');
  n++;
}
const CONTACT_MAIL = 'holy3320@gmail.com';
fs.writeFileSync(path.join(ROOT,'about','index.html'), buildStatic('사이트 소개', `
<p><strong>info-how 생활서식 모음</strong>은 사직서, 재직증명서, 임대차계약서, 내용증명처럼 살면서 한 번쯤 꼭 쓰게 되는 서식을 무료로 제공하는 사이트예요. 지금 ${forms.length}종의 서식을 직장·부동산·법률·생활 네 갈래로 나눠 정리해 두었습니다.</p>
<h2>무엇을 제공하나요</h2>
<ul>
<li><strong>표준 양식</strong> — 화면에서 바로 미리 보고 인쇄하거나 텍스트 파일로 내려받을 수 있어요.</li>
<li><strong>작성 방법과 예시</strong> — 칸마다 무엇을 적는지, 실제로 채운 예시, 자주 틀리는 부분을 함께 설명합니다.</li>
<li><strong>자주 묻는 질문</strong> — 제출 시기, 효력, 제출처처럼 서식을 쓰기 전에 많이 궁금해하는 점을 모았어요.</li>
</ul>
<h2>서식과 설명은 이렇게 만듭니다</h2>
<p>근로기준법, 주택임대차보호법, 민법, 개인정보 보호법 등 관련 법령과 고용노동부·법원·우정사업본부 같은 기관의 공개 안내를 기준으로 꼭 들어가야 할 항목을 정리했습니다. 법령이 바뀌거나 오류 제보가 들어오면 해당 서식을 고쳐 올려요.</p>
<h2>이용할 때 알아 두세요</h2>
<p>여기 서식은 누구나 고쳐 쓸 수 있는 참고용 표준 양식이에요. 회사·기관이 정한 양식이 있으면 그쪽을 먼저 쓰시고, 금액이 크거나 분쟁이 걸린 계약·법률 문서는 변호사·법무사 또는 대한법률구조공단(국번 없이 132)의 상담을 받으시길 권합니다.</p>
<h2>문의</h2>
<p>서식 추가 요청이나 오류 제보는 <a href="/contact/">문의 페이지</a>로 보내 주세요.</p>
<p class="form-lead">최종 업데이트: ${UPDATED}</p>`,'about'), 'utf8');
fs.writeFileSync(path.join(ROOT,'privacy','index.html'), buildStatic('개인정보처리방침', `
<p>info-how 생활서식 모음(이하 「사이트」)은 이용자의 개인정보를 소중히 다루며, 아래와 같이 처리합니다.</p>
<h2>1. 수집하는 개인정보</h2>
<p>사이트는 회원가입이 없고, 서식 작성·다운로드 과정에서 이름·연락처 등 개인정보를 입력받거나 서버에 저장하지 않습니다. 미리보기·다운로드는 모두 이용자 브라우저 안에서 처리돼요.</p>
<p>이메일로 문의하실 경우 회신을 위해 보낸 분의 이메일 주소와 문의 내용만 받으며, 답변이 끝난 뒤 지체 없이 삭제합니다.</p>
<h2>2. 자동으로 수집되는 정보</h2>
<p>사이트 운영과 통계를 위해 접속 기록(방문 페이지, 브라우저 종류, 접속 시각 등)이 호스팅 서비스와 분석 도구에 자동으로 남을 수 있습니다. 이 정보로 개인을 식별하지 않습니다.</p>
<h2>3. 광고와 쿠키</h2>
<p>사이트는 Google AdSense 등 제3자 광고를 게재할 수 있습니다. Google을 포함한 제3자 광고 업체는 쿠키를 사용해 이용자의 이 사이트 및 다른 사이트 방문 기록을 바탕으로 광고를 보여 줄 수 있어요. 이용자는 <a href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">Google 광고 설정</a>에서 맞춤 광고를 끌 수 있고, 브라우저 설정에서 쿠키 저장을 거부할 수도 있습니다.</p>
<h2>4. 제3자 제공</h2>
<p>사이트는 법령에 따른 요청이 있는 경우를 제외하고 이용자의 정보를 제3자에게 제공하지 않습니다.</p>
<h2>5. 문의처</h2>
<p>개인정보와 관련한 문의는 <a href="mailto:${CONTACT_MAIL}">${CONTACT_MAIL}</a> 로 보내 주세요.</p>
<p class="form-lead">시행일: ${UPDATED}</p>`,'privacy'), 'utf8');
fs.writeFileSync(path.join(ROOT,'contact','index.html'), buildStatic('문의', `
<p>서식 추가 요청, 내용 오류 제보, 기타 문의는 아래 이메일로 보내 주세요. 보통 2~3일 안에 답장을 드려요.</p>
<p>이메일: <a href="mailto:${CONTACT_MAIL}">${CONTACT_MAIL}</a></p>
<h2>제보하실 때</h2>
<ul>
<li>어느 서식의 어떤 부분인지(페이지 주소) 함께 알려 주시면 빨리 고칠 수 있어요.</li>
<li>개별 사건에 대한 법률 상담은 드리기 어렵습니다. 대한법률구조공단(국번 없이 132)이나 가까운 법률 전문가에게 문의해 주세요.</li>
</ul>`,'contact'), 'utf8');

// 404 — 이 파일이 없으면 Cloudflare Pages 가 없는 주소에도 홈을 200 으로 돌려준다(소프트 404).
fs.writeFileSync(path.join(ROOT,'404.html'),
  head('페이지를 찾을 수 없어요 | 생활서식 모음', '요청한 페이지가 없습니다.', `${BASE}/`).replace('<head>', '<head>\n<meta name="robots" content="noindex">')
  + header()
  + `<div class="container"><div class="static-page"><h1>페이지를 찾을 수 없어요</h1><p>주소가 바뀌었거나 아직 올라오지 않은 서식이에요. <a href="/">전체 서식 목록</a>에서 찾아보세요.</p></div></div>`
  + footer() + `</body></html>`, 'utf8');

// sitemap — 서식·소개 페이지만. 제품 추천 글(/reviews/)은 2026-11-03 부터 제외(검색 제외 처리).
const urls=[[`${BASE}/`,UPDATED],[`${BASE}/about/`,UPDATED],[`${BASE}/privacy/`,UPDATED],[`${BASE}/contact/`,UPDATED],
  ...forms.map(f=>[`${BASE}/forms/${f.id}/`, (f.publishAt && f.publishAt>UPDATED) ? f.publishAt : UPDATED])];
fs.writeFileSync(path.join(ROOT,'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+
urls.map(([u,d])=>`<url><loc>${u}</loc><lastmod>${d}</lastmod></url>`).join('\n')+`\n</urlset>\n`,'utf8');

// robots + ads
// /go/ = CPA 제휴 링크 래퍼(_redirects). 색인 대상이 아니므로 항상 Disallow.
fs.writeFileSync(path.join(ROOT,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /go/\nSitemap: ${BASE}/sitemap.xml\n`,'utf8');
fs.writeFileSync(path.join(ROOT,'ads.txt'),`google.com, pub-7852008102553944, DIRECT, f08c47fec0942fa0\n`,'utf8');

console.log(`✓ 홈 + 서식 ${n}개 (예약 대기 ${ALL_FORMS.length-forms.length}개) + 정적3 + sitemap/robots/ads.txt 생성 완료`);
