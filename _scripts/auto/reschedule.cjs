// reschedule.cjs — 아직 배포 안 된 글들을 N개/일 간격으로 재배치
//   배포된 글(.last_published.json)은 건드리지 않음. 슬러그 기준이라 날짜가 꼬여 있어도 안전.
//   사용: node _scripts/auto/reschedule.cjs [perDay] [startDate]
//   startDate 미지정 시 기계기준 '내일'.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(ROOT, '_scripts', 'reviews-data.cjs');
const reviews = require(DATA);

const PER_DAY = parseInt(process.argv[2], 10) || 5;
function addDays(iso, n) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
const today = new Date().toISOString().slice(0, 10);
const START = process.argv[3] || addDays(today, 1);

// 이미 배포된 슬러그(건드리지 않음)
let deployed = new Set();
try { deployed = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, '_scripts', 'auto', '.last_published.json'), 'utf8'))); } catch (e) {}

// 배포 안 된 글 = 재배치 대상 (배열 순서 유지)
const toSchedule = reviews.filter(r => !deployed.has(r.slug));
const newDate = {};
toSchedule.forEach((r, i) => { newDate[r.slug] = addDays(START, Math.floor(i / PER_DAY)); });

// 슬러그 추적하며 해당 글의 date/publishAt 줄만 교체
const lines = fs.readFileSync(DATA, 'utf8').split('\n');
let cur = null;
for (let i = 0; i < lines.length; i++) {
  const sm = lines[i].match(/^\s*slug:\s*'([^']+)'/);
  if (sm) { cur = sm[1]; continue; }
  const nd = cur && newDate[cur];
  if (!nd) continue;
  if (/^\s*date:\s*'\d{4}-\d\d-\d\d'/.test(lines[i])) lines[i] = lines[i].replace(/'\d{4}-\d\d-\d\d'/, `'${nd}'`);
  else if (/^\s*publishAt:\s*'\d{4}-\d\d-\d\d'/.test(lines[i])) lines[i] = lines[i].replace(/'\d{4}-\d\d-\d\d'/, `'${nd}'`);
}
fs.writeFileSync(DATA, lines.join('\n'), 'utf8');

const byDay = {};
toSchedule.forEach((r, i) => { const d = addDays(START, Math.floor(i / PER_DAY)); (byDay[d] = byDay[d] || []).push(r.thumbTitle || r.slug); });
console.log(`재배치: 미배포 ${toSchedule.length}편 → ${PER_DAY}편/일, ${START}부터 (배포된 ${deployed.size}편 유지)`);
Object.keys(byDay).sort().forEach(d => console.log(`  ${d}: ${byDay[d].join(', ')}`));
