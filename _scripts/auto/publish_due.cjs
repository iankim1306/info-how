// publish_due.cjs — 예약발행 자동 배포기 (매일 schtask로 실행)
//   오늘까지 발행 예정인(publishAt<=오늘) 글 목록이 지난 배포와 달라졌을 때만
//   빌드+썸네일+사이트맵 재생성 후 Cloudflare Pages에 자동 배포한다.
//   변화 없으면 아무것도 안 함(불필요한 프로덕션 배포 방지).
// 사용: node _scripts/auto/publish_due.cjs            (예약 반영 자동 배포)
//       node _scripts/auto/publish_due.cjs --force     (변화 없어도 강제 재배포)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const STATE = path.join(__dirname, '.last_published.json');
const LOG = path.join(__dirname, '.publish_log.txt');
const FORCE = process.argv.includes('--force');

function log(msg){
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(LOG, line + '\n'); } catch(e){}
}

function run(cmd){
  log(`$ ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

function main(){
  const reviews = require(path.join(ROOT, '_scripts', 'reviews-data.cjs'));
  const today = new Date().toISOString().slice(0,10);
  const liveSlugs = reviews.filter(r => !r.publishAt || String(r.publishAt) <= today)
                           .map(r => r.slug).sort();

  let prev = [];
  try { prev = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch(e){}

  const same = prev.length === liveSlugs.length && prev.every((s,i)=>s===liveSlugs[i]);
  if (same && !FORCE){
    log(`변화 없음 (라이브 ${liveSlugs.length}개). 배포 건너뜀.`);
    return;
  }

  const newly = liveSlugs.filter(s => !prev.includes(s));
  log(`발행 변화 감지: 라이브 ${liveSlugs.length}개` + (newly.length?`, 신규: ${newly.join(', ')}`:` (강제)`));

  // 빌드 파이프라인
  run('node _scripts/build-reviews.cjs');
  run('python _scripts/make_thumb.py');
  run('node _scripts/build-forms.cjs');

  // Cloudflare Pages 배포 (CLOUDFLARE_API_TOKEN 있으면 무인, 없으면 OAuth 캐시 사용)
  //  --yes: npx가 wrangler 새 버전 설치 여부를 (y)로 물으며 멈추는 것 방지(무인 실행 필수)
  run('npx --yes wrangler pages deploy . --project-name=info-how --branch=main --commit-dirty=true');

  fs.writeFileSync(STATE, JSON.stringify(liveSlugs, null, 1), 'utf8');
  log(`✓ 배포 완료. 상태 저장 (${liveSlugs.length}개).`);
}

try { main(); }
catch(e){ log(`X 실패: ${e.message}`); process.exit(1); }
