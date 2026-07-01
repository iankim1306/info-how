// info-how 서식 데이터. build-forms.cjs가 이걸 읽어 정적 HTML 생성.
// 각 서식: { id, name, category, emoji, desc, howto:[], bodyHTML, txt }
// bodyHTML = 미리보기 렌더용 표준 양식. txt = 다운로드 파일 내용.

const CATS = { 직장: '직장', 부동산: '부동산', 법률: '법률', 생활: '생활' };

module.exports = [
// ───────── 직장 (5) ─────────
{
  id: 'resignation', name: '사직서', category: '직장', emoji: '📄',
  desc: '회사에 제출하는 공식 사직서 양식입니다. 작성 후 출력하여 제출하세요.',
  howto: ['소속 부서와 성명을 정확히 기재합니다.', '퇴직 희망일과 사직 사유를 간단히 적습니다.', '작성일과 서명을 넣어 출력 후 제출합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">사 직 서</h2>
<table class="form-table"><tr><th>소속</th><td>&nbsp;</td><th>직위</th><td>&nbsp;</td></tr>
<tr><th>성명</th><td>&nbsp;</td><th>입사일</th><td>&nbsp;</td></tr>
<tr><th>퇴직 희망일</th><td colspan="3">&nbsp;</td></tr></table>
<p>본인은 위와 같은 사유로 사직하고자 하오니 조치하여 주시기 바랍니다.</p>
<p class="form-reason"><strong>사직 사유:</strong><br><br>&nbsp;</p>
<p style="text-align:right;margin-top:40px;">작성일 : &nbsp;&nbsp;&nbsp; 년 &nbsp;&nbsp; 월 &nbsp;&nbsp; 일</p>
<p style="text-align:right;">작성자 : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (서명 또는 인)</p>
<p style="text-align:center;margin-top:30px;">○ ○ ○ 귀하</p>`,
  txt: `사 직 서

소속 :
직위 :
성명 :
입사일 :
퇴직 희망일 :

본인은 위와 같은 사유로 사직하고자 하오니 조치하여 주시기 바랍니다.

사직 사유 :


작성일 :        년    월    일
작성자 :               (서명 또는 인)

○ ○ ○ 귀하`,
  guide: [
    { h2: '사직서란 무엇인가' },
    { p: '사직서는 근로자가 회사에 퇴사 의사를 공식적으로 알리는 문서입니다. 구두로 그만두겠다고 말하는 것과 달리, 사직서는 <strong>퇴사 의사와 퇴직 예정일을 서면으로 남기는 증빙</strong>이 됩니다. 인수인계, 퇴직금 정산, 실업급여 등 이후 절차의 기준이 되므로 정확히 작성해 두는 것이 좋습니다.' },
    { h2: '사직서는 언제 제출해야 하나' },
    { p: '근로기준법에는 명확한 사직 통보 기간이 규정돼 있지 않지만, 대부분의 회사 취업규칙은 <strong>퇴사 30일 전(약 1개월 전) 제출</strong>을 원칙으로 합니다. 민법상으로도 근로자가 사직을 통보하면 원칙적으로 1개월이 지나면 효력이 발생합니다. 원만한 인수인계와 관계 유지를 위해 최소 2~4주 전에는 제출하는 것이 좋습니다.' },
    { h2: '사직 사유는 어떻게 쓰나' },
    { p: '사직 사유는 구체적으로 쓸 의무는 없습니다. 실제로 많은 사람이 <strong>"개인 사정(일신상의 사유)"</strong>으로 간단히 기재합니다. 다만 실업급여를 받으려는 경우에는 사유가 중요합니다. 자발적 퇴사는 원칙적으로 실업급여 대상이 아니므로, 권고사직·계약만료 등 비자발적 사유라면 그 사실을 명확히 남기는 것이 유리합니다.' },
    { h3: '사직 사유 예시' },
    { ul: ['일신상의 사유로 인해 사직하고자 합니다.', '개인 사정으로 부득이 사직하게 되었습니다.', '이직으로 인해 사직서를 제출합니다.'] },
    { h2: '사직서 제출 후 절차' },
    { ol: ['사직서 제출 및 상급자 수리', '업무 인수인계 진행', '퇴직일까지 근무', '퇴직금·미사용 연차수당 정산 (14일 이내 지급 의무)', '4대보험 상실 신고, 경력증명서 발급'] },
    { h2: '작성 시 주의사항' },
    { ul: ['퇴직 희망일을 명확히 기재합니다.', '회사가 사직을 수리하기 전까지는 철회가 가능한 경우가 있으니 신중히 결정합니다.', '연차·퇴직금 정산 내역을 미리 확인합니다.', '사직서는 <strong>사본을 보관</strong>해 두는 것이 좋습니다.'] },
  ],
  faq: [
    { q: '사직서를 냈는데 회사가 안 받아주면 어떻게 되나요?', a: '민법상 근로자가 사직을 통보하면 회사의 수리 여부와 관계없이 원칙적으로 통보 후 1개월(임금 지급 형태에 따라 다름)이 지나면 근로계약이 종료됩니다. 다만 무단결근은 불이익이 있을 수 있으니 통보 기간을 지키는 것이 안전합니다.' },
    { q: '사직서 제출 후 마음이 바뀌면 철회할 수 있나요?', a: '회사가 사직서를 수리(승인)하기 전이라면 철회가 가능한 경우가 많습니다. 다만 이미 수리되었다면 회사 동의 없이는 철회가 어렵습니다.' },
    { q: '퇴직금은 언제 받나요?', a: '퇴직일로부터 14일 이내에 지급하는 것이 원칙입니다. 1년 이상 근무하고 주 15시간 이상 일했다면 퇴직금 대상입니다.' },
  ],
},
{
  id: 'employment_cert', name: '재직증명서', category: '직장', emoji: '🏢',
  desc: '현재 재직 중임을 증명하는 서류로 관공서, 은행 제출용으로 사용됩니다.',
  howto: ['재직자의 인적사항과 소속·직위를 기재합니다.', '재직 기간과 발급 용도를 적습니다.', '회사 대표자명과 직인을 날인해 발급합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">재 직 증 명 서</h2>
<table class="form-table"><tr><th>성명</th><td>&nbsp;</td><th>생년월일</th><td>&nbsp;</td></tr>
<tr><th>소속</th><td>&nbsp;</td><th>직위</th><td>&nbsp;</td></tr>
<tr><th>재직 기간</th><td colspan="3">&nbsp; 년 &nbsp; 월 &nbsp; 일 ~ 현재 재직중</td></tr>
<tr><th>용도</th><td colspan="3">&nbsp;</td></tr></table>
<p>위 사람은 당사에 위와 같이 재직하고 있음을 증명합니다.</p>
<p style="text-align:right;margin-top:40px;">발급일 : &nbsp;&nbsp;&nbsp; 년 &nbsp;&nbsp; 월 &nbsp;&nbsp; 일</p>
<p style="text-align:center;margin-top:20px;font-size:1.1rem;font-weight:700;">회사명 : ○ ○ ○ &nbsp;&nbsp; 대표 ○ ○ ○ (인)</p>`,
  txt: `재 직 증 명 서

성명 :
생년월일 :
소속 :
직위 :
재직 기간 :    년   월   일 ~ 현재 재직중
용도 :

위 사람은 당사에 위와 같이 재직하고 있음을 증명합니다.

발급일 :        년    월    일

회사명 : ○ ○ ○     대표 ○ ○ ○ (인)`,
  guide: [
    { h2: '재직증명서란' },
    { p: '재직증명서는 특정인이 <strong>현재 그 회사에 재직 중임을 회사가 공식적으로 증명하는 문서</strong>입니다. 은행 대출, 신용카드 발급, 관공서 제출, 비자 발급, 전세자금 대출 등 소득과 신분을 확인해야 하는 상황에서 널리 요구됩니다.' },
    { h2: '재직증명서 발급 방법' },
    { p: '재직증명서는 <strong>회사(인사팀 또는 총무팀)에 요청</strong>하여 발급받는 것이 원칙입니다. 회사가 재직 사실을 확인하고 대표자 직인을 날인해 발급합니다. 규모가 있는 회사는 사내 시스템이나 이메일로 신청할 수 있고, 소규모 사업장은 이 표준 양식을 작성해 대표 서명·날인을 받으면 됩니다.' },
    { h2: '재직증명서에 들어가는 항목' },
    { ul: ['재직자 성명·생년월일', '소속 부서와 직위', '재직 기간(입사일 ~ 현재)', '발급 용도(대출, 관공서 제출 등)', '회사명·대표자명·직인'] },
    { h2: '재직증명서와 경력증명서의 차이' },
    { p: '<strong>재직증명서</strong>는 "현재 재직 중"임을 증명하고, <strong>경력증명서</strong>는 "과거에 근무했던 이력"을 증명합니다. 이직·퇴직 후에는 재직증명서가 아니라 경력증명서를 발급받게 됩니다.' },
  ],
  faq: [
    { q: '퇴사한 회사에서 재직증명서를 받을 수 있나요?', a: '퇴사 후에는 "재직" 중이 아니므로 재직증명서가 아니라 경력증명서를 발급받습니다. 재직증명서는 현재 재직 중일 때만 발급됩니다.' },
    { q: '회사가 재직증명서 발급을 거부할 수 있나요?', a: '재직 사실이 명백하다면 정당한 이유 없이 거부하기 어렵습니다. 발급을 미루면 관할 노동청에 상담을 요청할 수 있습니다.' },
  ],
},
{
  id: 'career_cert', name: '경력증명서', category: '직장', emoji: '🗂️',
  desc: '이전 직장 경력을 증명하는 서류로 이직 시 제출합니다.',
  howto: ['경력자의 인적사항을 기재합니다.', '근무 기간, 담당 업무, 직위를 상세히 적습니다.', '회사 대표자 직인을 날인해 발급합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">경 력 증 명 서</h2>
<table class="form-table"><tr><th>성명</th><td>&nbsp;</td><th>생년월일</th><td>&nbsp;</td></tr>
<tr><th>근무 기간</th><td colspan="3">&nbsp; 년 &nbsp; 월 ~ &nbsp; 년 &nbsp; 월</td></tr>
<tr><th>부서/직위</th><td>&nbsp;</td><th>담당 업무</th><td>&nbsp;</td></tr></table>
<p>위 사람은 당사에서 위와 같이 근무하였음을 증명합니다.</p>
<p style="text-align:right;margin-top:40px;">발급일 : &nbsp;&nbsp;&nbsp; 년 &nbsp;&nbsp; 월 &nbsp;&nbsp; 일</p>
<p style="text-align:center;margin-top:20px;font-size:1.1rem;font-weight:700;">회사명 : ○ ○ ○ &nbsp;&nbsp; 대표 ○ ○ ○ (인)</p>`,
  txt: `경 력 증 명 서

성명 :
생년월일 :
근무 기간 :    년   월 ~    년   월
부서/직위 :
담당 업무 :

위 사람은 당사에서 위와 같이 근무하였음을 증명합니다.

발급일 :        년    월    일

회사명 : ○ ○ ○     대표 ○ ○ ○ (인)`,
  guide: [
    { h2: '경력증명서란' },
    { p: '경력증명서는 <strong>과거 특정 회사에서 근무한 이력을 증명하는 문서</strong>입니다. 이직할 때 지원 회사에 제출하거나, 경력직 채용·자격 요건 충족·연봉 협상의 근거로 사용됩니다. 근무 기간과 담당 업무가 핵심 항목입니다.' },
    { h2: '경력증명서 발급 방법' },
    { p: '경력증명서는 <strong>이전에 근무했던 회사에 요청</strong>하여 발급받습니다. 퇴사한 지 오래되었어도 회사가 존속한다면 발급 요청이 가능합니다. 회사는 근무 사실을 확인하고 대표자 직인을 날인해 발급합니다.' },
    { h2: '경력증명서에 들어가는 항목' },
    { ul: ['성명·생년월일', '근무 기간(입사일 ~ 퇴사일)', '부서·직위', '담당 업무 내용', '회사명·대표자명·직인'] },
    { h2: '회사가 없어졌을 때는' },
    { p: '회사가 폐업해 경력증명서를 받을 수 없는 경우, <strong>국민연금 가입 내역서, 건강보험 자격득실확인서, 고용보험 피보험자격 이력내역서</strong> 등으로 근무 이력을 간접 증명할 수 있습니다. 이 서류들은 공단 홈페이지에서 발급됩니다.' },
  ],
  faq: [
    { q: '폐업한 회사 경력은 어떻게 증명하나요?', a: '국민연금·건강보험·고용보험 가입 이력으로 근무 기간을 증명할 수 있습니다. 각 공단 홈페이지나 정부24에서 발급 가능합니다.' },
    { q: '경력증명서에 연봉도 나오나요?', a: '보통 근무 기간과 직위·담당 업무만 기재하며, 연봉은 포함되지 않습니다. 소득 증명이 필요하면 급여확인서나 원천징수영수증을 별도로 요청합니다.' },
  ],
},
{
  id: 'leave_request', name: '휴가신청서', category: '직장', emoji: '🌴',
  desc: '연차, 병가, 특별휴가 등 모든 휴가 신청에 사용하는 양식입니다.',
  howto: ['신청자 소속과 성명을 기재합니다.', '휴가 종류와 기간, 사유를 적습니다.', '결재란에 상급자 승인을 받습니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">휴 가 신 청 서</h2>
<table class="form-table"><tr><th>소속</th><td>&nbsp;</td><th>성명</th><td>&nbsp;</td></tr>
<tr><th>휴가 종류</th><td colspan="3">□ 연차 &nbsp; □ 병가 &nbsp; □ 경조 &nbsp; □ 기타</td></tr>
<tr><th>휴가 기간</th><td colspan="3">&nbsp; 년 &nbsp; 월 &nbsp; 일 ~ &nbsp; 년 &nbsp; 월 &nbsp; 일 ( &nbsp; 일간 )</td></tr>
<tr><th>사유</th><td colspan="3">&nbsp;</td></tr></table>
<p>위와 같이 휴가를 신청합니다.</p>
<p style="text-align:right;margin-top:40px;">신청일 : &nbsp;&nbsp;&nbsp; 년 &nbsp;&nbsp; 월 &nbsp;&nbsp; 일 &nbsp;&nbsp;&nbsp; 신청자 : ○ ○ ○ (인)</p>
<table class="form-table" style="margin-top:20px;"><tr><th>담당</th><th>팀장</th><th>부서장</th></tr><tr><td style="height:50px;">&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>`,
  txt: `휴 가 신 청 서

소속 :
성명 :
휴가 종류 : □ 연차  □ 병가  □ 경조  □ 기타
휴가 기간 :    년   월   일 ~    년   월   일 (   일간)
사유 :

위와 같이 휴가를 신청합니다.

신청일 :        년    월    일    신청자 : ○ ○ ○ (인)

결재 : 담당 /  팀장 /  부서장`,
  guide: [
    { h2: '휴가신청서란' },
    { p: '휴가신청서는 <strong>연차, 병가, 경조사 휴가 등을 사용하기 위해 회사에 제출하는 문서</strong>입니다. 휴가 사용을 공식 기록으로 남겨 근태 관리와 급여 정산의 근거가 됩니다.' },
    { h2: '연차휴가는 며칠인가' },
    { p: '근로기준법상 <strong>1년간 80% 이상 출근한 근로자는 15일의 연차유급휴가</strong>가 발생합니다. 근속 3년 차부터는 2년마다 1일씩 가산되어 최대 25일까지 늘어납니다. 1년 미만 근로자는 <strong>1개월 개근 시 1일씩</strong> 연차가 생깁니다. (5인 이상 사업장 기준)' },
    { h2: '휴가 종류' },
    { ul: ['<strong>연차</strong> — 유급, 근로자가 시기 지정 가능', '<strong>병가</strong> — 질병·부상, 회사 규정에 따라 유급/무급', '<strong>경조사 휴가</strong> — 결혼·상 등, 회사 규정에 따름', '<strong>공가</strong> — 예비군·법정 의무 등'] },
    { h2: '휴가 신청 시 주의사항' },
    { ul: ['가능하면 <strong>미리 신청</strong>해 업무 공백을 줄입니다.', '연차는 근로자가 원하는 날 사용할 권리가 있으나, 사업 운영에 큰 지장이 있으면 회사가 시기를 변경할 수 있습니다.', '사용하지 못한 연차는 <strong>연차수당</strong>으로 보상받을 수 있습니다.'] },
  ],
  faq: [
    { q: '연차를 회사가 거부할 수 있나요?', a: '연차는 근로자의 권리라 원칙적으로 거부할 수 없습니다. 다만 그 시기에 사업 운영에 막대한 지장이 있으면 회사가 시기를 다른 날로 변경 요청할 수 있습니다(시기변경권).' },
    { q: '안 쓴 연차는 어떻게 되나요?', a: '미사용 연차는 연차수당으로 지급받는 것이 원칙입니다. 단, 회사가 적법하게 연차 사용 촉진 절차를 밟았다면 수당 지급 의무가 없어질 수 있습니다.' },
  ],
},
{
  id: 'salary_cert', name: '급여확인서', category: '직장', emoji: '💰',
  desc: '월 급여액을 증명하는 서류로 대출, 임대차 계약 시 필요합니다.',
  howto: ['재직자 인적사항을 기재합니다.', '월 급여액과 연봉을 적습니다.', '회사 직인을 날인해 발급합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">급 여 확 인 서</h2>
<table class="form-table"><tr><th>성명</th><td>&nbsp;</td><th>생년월일</th><td>&nbsp;</td></tr>
<tr><th>소속/직위</th><td colspan="3">&nbsp;</td></tr>
<tr><th>월 급여액</th><td>&nbsp; 원</td><th>연봉</th><td>&nbsp; 원</td></tr>
<tr><th>용도</th><td colspan="3">&nbsp;</td></tr></table>
<p>위 사람의 급여가 위와 같음을 확인합니다.</p>
<p style="text-align:right;margin-top:40px;">발급일 : &nbsp;&nbsp;&nbsp; 년 &nbsp;&nbsp; 월 &nbsp;&nbsp; 일</p>
<p style="text-align:center;margin-top:20px;font-size:1.1rem;font-weight:700;">회사명 : ○ ○ ○ &nbsp;&nbsp; 대표 ○ ○ ○ (인)</p>`,
  txt: `급 여 확 인 서

성명 :
생년월일 :
소속/직위 :
월 급여액 :        원
연봉 :        원
용도 :

위 사람의 급여가 위와 같음을 확인합니다.

발급일 :        년    월    일

회사명 : ○ ○ ○     대표 ○ ○ ○ (인)`,
},
// ───────── 부동산 (3) ─────────
{
  id: 'lease_contract', name: '임대차계약서', category: '부동산', emoji: '🏠',
  desc: '주택·상가 임대차 계약 시 사용하는 표준 계약서 양식입니다.',
  howto: ['임대인과 임차인의 인적사항을 기재합니다.', '목적물 주소, 보증금, 월세, 계약기간을 적습니다.', '특약사항을 확인하고 양측이 서명·날인합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:6px;">부동산 임대차 계약서</h2>
<p>임대인과 임차인은 아래 표시 부동산에 관하여 다음 계약을 체결한다.</p>
<table class="form-table"><tr><th>소재지</th><td colspan="3">&nbsp;</td></tr>
<tr><th>보증금</th><td>금 &nbsp; 원정</td><th>월세</th><td>금 &nbsp; 원정</td></tr>
<tr><th>계약 기간</th><td colspan="3">&nbsp; 년 &nbsp; 월 &nbsp; 일 ~ &nbsp; 년 &nbsp; 월 &nbsp; 일</td></tr></table>
<p><strong>특약사항</strong><br>&nbsp;<br>&nbsp;</p>
<p style="text-align:right;margin-top:30px;">계약일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일</p>
<table class="form-table" style="margin-top:16px;"><tr><th>임대인</th><td>성명 &nbsp;&nbsp;&nbsp;&nbsp; (인) &nbsp;&nbsp; 연락처 &nbsp;</td></tr>
<tr><th>임차인</th><td>성명 &nbsp;&nbsp;&nbsp;&nbsp; (인) &nbsp;&nbsp; 연락처 &nbsp;</td></tr></table>`,
  txt: `부동산 임대차 계약서

임대인과 임차인은 아래 표시 부동산에 관하여 다음 계약을 체결한다.

소재지 :
보증금 : 금        원정
월세 : 금        원정
계약 기간 :    년   월   일 ~    년   월   일

특약사항 :


계약일 :    년   월   일

임대인 : 성명          (인)   연락처
임차인 : 성명          (인)   연락처 `,
  guide: [
    { h2: '임대차계약서란' },
    { p: '임대차계약서는 <strong>집이나 상가를 빌려주고 빌리는 조건을 문서로 정한 계약서</strong>입니다. 보증금, 월세, 계약 기간, 특약사항 등을 명확히 기재해 임대인과 임차인 사이의 분쟁을 예방합니다. 전입신고와 확정일자를 받으면 보증금을 법적으로 보호받을 수 있습니다.' },
    { h2: '계약 전 반드시 확인할 것' },
    { ol: ['<strong>등기부등본</strong> 확인 — 실제 소유자와 계약하는지, 근저당(빚)이 얼마나 잡혀 있는지 확인', '<strong>임대인 신분증</strong>과 등기부상 소유자가 일치하는지 확인', '<strong>선순위 보증금·대출</strong> 규모 — 경매 시 내 보증금을 돌려받을 수 있는지 판단', '건물 상태, 관리비 항목, 옵션 포함 여부'] },
    { h2: '계약서에 꼭 넣을 항목' },
    { ul: ['목적물 주소와 면적', '보증금·월세·관리비', '계약 기간과 입주일', '<strong>특약사항</strong> (수리 책임, 반려동물, 원상복구 범위 등)', '임대인·임차인 인적사항과 서명·날인'] },
    { h2: '계약 후 해야 할 일' },
    { p: '계약 직후 <strong>전입신고 + 확정일자</strong>를 받는 것이 가장 중요합니다. 이 두 가지를 갖추면 임차인은 <strong>대항력과 우선변제권</strong>을 얻어, 집이 경매로 넘어가도 보증금을 우선 변제받을 수 있습니다. 보증금이 크다면 전세보증금 반환보증 가입도 고려하세요.' },
  ],
  faq: [
    { q: '계약금만 걸고 계약을 취소하면 어떻게 되나요?', a: '계약 후 임차인이 취소하면 계약금을 포기해야 하고, 임대인이 취소하면 계약금의 2배를 배상하는 것이 일반적입니다. 계약서에 별도 특약이 있으면 그에 따릅니다.' },
    { q: '전입신고와 확정일자는 왜 중요한가요?', a: '전입신고+확정일자를 갖추면 집이 경매·공매로 넘어가도 보증금을 우선 변제받을 권리(우선변제권)가 생깁니다. 입주 당일 바로 처리하는 것이 안전합니다.' },
    { q: '계약 기간 중에 나가야 하면 어떻게 하나요?', a: '원칙적으로 계약 기간을 지켜야 하지만, 임대인과 협의하거나 새 임차인을 구해주는 방식으로 조정하는 경우가 많습니다. 중도 해지 조건을 특약에 미리 넣어두면 좋습니다.' },
  ],
},
{
  id: 'jeonse_contract', name: '전세계약서', category: '부동산', emoji: '🔑',
  desc: '전세 계약 시 사용하는 표준 계약서 양식입니다.',
  howto: ['임대인과 임차인 인적사항을 기재합니다.', '목적물과 전세보증금, 계약기간을 적습니다.', '특약사항 확인 후 양측 서명·날인합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:6px;">전세 계약서</h2>
<p>임대인과 임차인은 아래 부동산에 관하여 전세 계약을 체결한다.</p>
<table class="form-table"><tr><th>소재지</th><td colspan="3">&nbsp;</td></tr>
<tr><th>전세보증금</th><td colspan="3">금 &nbsp; 원정</td></tr>
<tr><th>계약 기간</th><td colspan="3">&nbsp; 년 &nbsp; 월 &nbsp; 일 ~ &nbsp; 년 &nbsp; 월 &nbsp; 일</td></tr></table>
<p><strong>특약사항</strong><br>&nbsp;<br>&nbsp;</p>
<p style="text-align:right;margin-top:30px;">계약일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일</p>
<table class="form-table" style="margin-top:16px;"><tr><th>임대인</th><td>성명 &nbsp;&nbsp;&nbsp;&nbsp; (인) &nbsp;&nbsp; 연락처 &nbsp;</td></tr>
<tr><th>임차인</th><td>성명 &nbsp;&nbsp;&nbsp;&nbsp; (인) &nbsp;&nbsp; 연락처 &nbsp;</td></tr></table>`,
  txt: `전세 계약서

임대인과 임차인은 아래 부동산에 관하여 전세 계약을 체결한다.

소재지 :
전세보증금 : 금        원정
계약 기간 :    년   월   일 ~    년   월   일

특약사항 :


계약일 :    년   월   일

임대인 : 성명          (인)   연락처
임차인 : 성명          (인)   연락처 `,
  guide: [
    { h2: '전세계약서란' },
    { p: '전세계약서는 <strong>목돈(전세보증금)을 맡기고 집을 빌리는 전세 계약의 조건을 정한 문서</strong>입니다. 월세가 없는 대신 보증금 규모가 크기 때문에, 보증금을 안전하게 돌려받는 것이 계약의 핵심입니다.' },
    { h2: '전세 사기 예방 체크리스트' },
    { ol: ['<strong>등기부등본</strong>으로 실소유자·근저당 확인', '<strong>전세가율</strong> 확인 — 매매가 대비 전세가가 너무 높으면(80% 이상) 깡통전세 위험', '<strong>선순위 채권</strong> 확인 — 나보다 앞선 대출·보증금이 얼마인지', '임대인 <strong>세금 체납 여부</strong> 확인 (국세완납증명)', '<strong>전세보증금 반환보증</strong>(HUG·SGI) 가입 가능 여부'] },
    { h2: '계약 후 필수 절차' },
    { p: '입주 당일 <strong>전입신고와 확정일자</strong>를 반드시 받으세요. 여기에 더해 <strong>전세보증금 반환보증보험</strong>에 가입하면, 임대인이 보증금을 돌려주지 못해도 보증기관이 대신 반환해 줍니다. 최근 전세 사기가 늘어 보증보험 가입이 강력히 권장됩니다.' },
    { h2: '전세 vs 월세' },
    { p: '전세는 매달 나가는 돈이 없지만 목돈이 묶이고 보증금 반환 위험이 있습니다. 월세는 목돈 부담이 적지만 매달 지출이 생깁니다. 본인의 자금 상황과 금리를 고려해 선택하세요.' },
  ],
  faq: [
    { q: '깡통전세가 뭔가요?', a: '집의 매매가보다 전세보증금(+선순위 대출)이 더 크거나 비슷해서, 집이 경매로 넘어가면 보증금을 다 못 돌려받는 상황을 말합니다. 전세가율이 높은 집은 특히 주의해야 합니다.' },
    { q: '전세보증금 반환보증은 꼭 들어야 하나요?', a: '의무는 아니지만 강력히 권장됩니다. 임대인이 보증금을 못 돌려줄 때 HUG·SGI 같은 보증기관이 대신 반환해 주므로 전세 사기 피해를 막을 수 있습니다.' },
  ],
},
{
  id: 'move_confirm', name: '이사확인서', category: '부동산', emoji: '🚚',
  desc: '이사 완료 및 정산 확인용 서류입니다.',
  howto: ['이사 당사자와 주소를 기재합니다.', '이사일과 관리비·공과금 정산 내역을 적습니다.', '양측이 확인 서명합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">이 사 확 인 서</h2>
<table class="form-table"><tr><th>성명</th><td>&nbsp;</td><th>연락처</th><td>&nbsp;</td></tr>
<tr><th>이전 주소</th><td colspan="3">&nbsp;</td></tr>
<tr><th>이사일</th><td>&nbsp; 년 &nbsp; 월 &nbsp; 일</td><th>정산 내역</th><td>관리비·공과금 정산 완료</td></tr></table>
<p>위와 같이 이사 및 정산이 완료되었음을 확인합니다.</p>
<p style="text-align:right;margin-top:40px;">확인일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일 &nbsp;&nbsp;&nbsp; 확인자 : ○ ○ ○ (인)</p>`,
  txt: `이 사 확 인 서

성명 :
연락처 :
이전 주소 :
이사일 :    년   월   일
정산 내역 : 관리비·공과금 정산 완료

위와 같이 이사 및 정산이 완료되었음을 확인합니다.

확인일 :    년   월   일    확인자 : ○ ○ ○ (인)`,
},
// ───────── 법률 (5) ─────────
{
  id: 'content_certification', name: '내용증명', category: '법률', emoji: '📮',
  desc: '채권 독촉, 계약 해지 통보 등에 사용하는 내용증명 양식입니다.',
  howto: ['보내는 사람과 받는 사람 정보를 기재합니다.', '통보하려는 내용을 육하원칙에 따라 명확히 작성합니다.', '3부 출력해 우체국에서 내용증명으로 발송합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">내 용 증 명</h2>
<table class="form-table"><tr><th>받는 사람</th><td>성명 &nbsp;&nbsp;&nbsp; 주소 &nbsp;</td></tr>
<tr><th>보내는 사람</th><td>성명 &nbsp;&nbsp;&nbsp; 주소 &nbsp;</td></tr></table>
<p style="margin-top:20px;"><strong>제목:</strong> &nbsp;</p>
<p class="form-reason">1. &nbsp;<br><br>2. &nbsp;<br><br>3. 위와 같이 통보하오니 조치하여 주시기 바랍니다.</p>
<p style="text-align:right;margin-top:40px;">작성일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일</p>
<p style="text-align:right;">발신인 : ○ ○ ○ (인)</p>`,
  txt: `내 용 증 명

받는 사람 : 성명       주소
보내는 사람 : 성명       주소

제목 :

1.

2.

3. 위와 같이 통보하오니 조치하여 주시기 바랍니다.

작성일 :    년   월   일
발신인 : ○ ○ ○ (인)`,
  guide: [
    { h2: '내용증명이란' },
    { p: '내용증명은 <strong>"누가, 언제, 어떤 내용의 문서를 상대에게 보냈다"는 사실을 우체국이 공적으로 증명해 주는 우편</strong>입니다. 문서 자체에 법적 강제력이 있는 것은 아니지만, 훗날 분쟁이 소송으로 갈 때 <strong>내가 정당한 요구를 언제 했는지 입증하는 강력한 증거</strong>가 됩니다.' },
    { h2: '언제 사용하나' },
    { ul: ['빌려준 돈을 갚으라고 독촉할 때', '계약 해지·해제를 통보할 때', '보증금 반환을 요구할 때', '하자·손해배상을 청구할 때', '상대의 특정 행위 중단을 요구할 때'] },
    { h2: '내용증명 작성 방법' },
    { ol: ['<strong>받는 사람·보내는 사람</strong>의 성명과 주소를 정확히 기재', '<strong>육하원칙</strong>에 따라 사실관계를 명확하게 서술', '요구사항과 <strong>기한</strong>을 구체적으로 명시 (예: "○월 ○일까지 반환")', '동일한 문서 <strong>3부</strong>를 준비 (본인·상대·우체국 보관용)'] },
    { h2: '발송 방법' },
    { p: '작성한 내용증명 3부를 들고 <strong>우체국에 방문</strong>하거나 <strong>인터넷우체국</strong>에서 온라인으로 발송할 수 있습니다. 우체국이 1부를 보관하므로, 나중에 "그런 문서 못 받았다"는 상대의 주장을 반박할 수 있습니다. 발송 후 배달 여부는 등기 조회로 확인합니다.' },
  ],
  faq: [
    { q: '내용증명을 보내면 법적 효력이 생기나요?', a: '내용증명 자체가 강제력을 갖는 것은 아닙니다. 다만 "내가 언제 어떤 요구를 했다"는 사실을 공적으로 남겨, 소송 시 유리한 증거가 되고 소멸시효 중단 효과도 있습니다.' },
    { q: '상대가 내용증명을 안 받으면 어떻게 되나요?', a: '수취 거절해도 발송 사실 자체는 증명됩니다. 반송되면 다시 보내거나, 소송에서 "정당하게 통지하려 했다"는 근거로 활용할 수 있습니다.' },
    { q: '내용증명은 어디서 보내나요?', a: '전국 우체국 방문 또는 인터넷우체국(epost.kr) 온라인으로 발송할 수 있습니다. 3부를 준비해 1부는 우체국이 보관합니다.' },
  ],
},
{
  id: 'agreement', name: '합의서', category: '법률', emoji: '🤝',
  desc: '분쟁·사고 등의 원만한 해결을 위한 합의서 양식입니다.',
  howto: ['합의 당사자 인적사항을 기재합니다.', '합의 내용과 금액, 조건을 명확히 적습니다.', '양측이 서명·날인하고 각 1부씩 보관합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">합 의 서</h2>
<table class="form-table"><tr><th>갑 (당사자1)</th><td>성명 &nbsp;&nbsp; (인) &nbsp; 연락처 &nbsp;</td></tr>
<tr><th>을 (당사자2)</th><td>성명 &nbsp;&nbsp; (인) &nbsp; 연락처 &nbsp;</td></tr></table>
<p style="margin-top:20px;"><strong>합의 내용</strong></p>
<p class="form-reason">1. &nbsp;<br><br>2. &nbsp;<br><br>3. 양 당사자는 위 내용에 합의하며, 향후 이의를 제기하지 않는다.</p>
<p style="text-align:right;margin-top:40px;">합의일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일</p>`,
  txt: `합 의 서

갑 (당사자1) : 성명    (인)  연락처
을 (당사자2) : 성명    (인)  연락처

합의 내용
1.

2.

3. 양 당사자는 위 내용에 합의하며, 향후 이의를 제기하지 않는다.

합의일 :    년   월   일`,
},
{
  id: 'loan_cert', name: '차용증', category: '법률', emoji: '📝',
  desc: '금전 대차 시 작성하는 차용증(금전소비대차) 양식입니다.',
  howto: ['채권자와 채무자 인적사항을 기재합니다.', '차용 금액, 이자, 변제일을 명확히 적습니다.', '채무자가 서명·날인합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">차 용 증</h2>
<table class="form-table"><tr><th>차용 금액</th><td colspan="3">금 &nbsp; 원정 ( ₩ &nbsp; )</td></tr>
<tr><th>이자율</th><td>연 &nbsp; %</td><th>변제일</th><td>&nbsp; 년 &nbsp; 월 &nbsp; 일</td></tr></table>
<p>채무자는 위 금액을 채권자로부터 정히 차용하였으며, 변제일까지 상환할 것을 확약합니다.</p>
<p style="text-align:right;margin-top:40px;">작성일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일</p>
<table class="form-table" style="margin-top:16px;"><tr><th>채권자</th><td>성명 &nbsp;&nbsp; (인) &nbsp; 연락처 &nbsp;</td></tr>
<tr><th>채무자</th><td>성명 &nbsp;&nbsp; (인) &nbsp; 연락처 &nbsp;</td></tr></table>`,
  txt: `차 용 증

차용 금액 : 금        원정 ( ₩        )
이자율 : 연    %
변제일 :    년   월   일

채무자는 위 금액을 채권자로부터 정히 차용하였으며,
변제일까지 상환할 것을 확약합니다.

작성일 :    년   월   일

채권자 : 성명    (인)  연락처
채무자 : 성명    (인)  연락처 `,
  guide: [
    { h2: '차용증이란' },
    { p: '차용증은 <strong>돈을 빌려주고 빌린 사실과 조건을 적은 문서</strong>입니다. 정식 명칭은 "금전소비대차 계약서"입니다. 가까운 사이라도 돈거래는 반드시 차용증을 써두어야, 나중에 "빌린 적 없다", "갚았다"는 분쟁을 막고 법적으로 돈을 청구할 수 있습니다.' },
    { h2: '차용증에 꼭 들어갈 항목' },
    { ol: ['<strong>차용 금액</strong> — 숫자와 한글을 함께 (예: 금 오백만원정 / ₩5,000,000)', '<strong>이자율</strong> — 약정하지 않으면 이자를 청구하기 어려움', '<strong>변제일(갚는 날)</strong>', '채권자·채무자의 <strong>성명, 주민번호, 주소, 연락처</strong>', '작성일과 <strong>채무자의 서명·날인</strong>'] },
    { h2: '법정 최고 이자율' },
    { p: '개인 간 금전 거래의 이자는 <strong>법정 최고이자율(연 20%, 2024년 기준)</strong>을 넘을 수 없습니다. 이를 초과한 이자 약정은 초과분이 무효입니다. 이자를 받으려면 반드시 차용증에 이자율을 명시해야 합니다.' },
    { h2: '증거력을 높이는 방법' },
    { ul: ['돈을 <strong>계좌이체</strong>로 보내 거래 내역을 남깁니다(현금 X).', '금액이 크면 <strong>공증</strong>을 받아두면 재판 없이 강제집행이 가능합니다.', '차용증은 채권자가 <strong>원본을 보관</strong>합니다.', '가능하면 <strong>증인</strong>을 두거나 인감을 날인합니다.'] },
  ],
  faq: [
    { q: '차용증 없이 빌려준 돈도 받을 수 있나요?', a: '계좌이체 내역, 문자·카톡 대화 등으로 대여 사실을 입증하면 받을 수 있습니다. 다만 차용증이 있으면 훨씬 명확하고 유리합니다.' },
    { q: '이자를 안 정하면 이자를 받을 수 있나요?', a: '개인 간 거래는 이자 약정이 없으면 원칙적으로 이자를 청구하기 어렵습니다. 이자를 받으려면 차용증에 이자율을 반드시 명시해야 합니다.' },
    { q: '공증은 꼭 받아야 하나요?', a: '의무는 아니지만, 금액이 크면 공증을 권장합니다. 공정증서로 작성하면 채무자가 안 갚을 때 소송 없이 바로 강제집행(압류 등)이 가능합니다.' },
  ],
},
{
  id: 'power_of_attorney', name: '위임장', category: '법률', emoji: '✍️',
  desc: '각종 업무를 대리인에게 위임할 때 사용하는 위임장 양식입니다.',
  howto: ['위임인과 대리인 인적사항을 기재합니다.', '위임하는 업무 범위를 구체적으로 적습니다.', '위임인이 서명·날인하고 인감증명을 첨부합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">위 임 장</h2>
<table class="form-table"><tr><th>위임인</th><td>성명 &nbsp;&nbsp; 생년월일 &nbsp;&nbsp; 연락처 &nbsp;</td></tr>
<tr><th>대리인</th><td>성명 &nbsp;&nbsp; 생년월일 &nbsp;&nbsp; 연락처 &nbsp;</td></tr></table>
<p style="margin-top:20px;"><strong>위임 내용</strong></p>
<p class="form-reason">위임인은 위 대리인에게 다음 사항의 처리를 위임합니다.<br><br>&nbsp;</p>
<p style="text-align:right;margin-top:40px;">작성일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일</p>
<p style="text-align:right;">위임인 : ○ ○ ○ (인)</p>`,
  txt: `위 임 장

위임인 : 성명    생년월일    연락처
대리인 : 성명    생년월일    연락처

위임 내용
위임인은 위 대리인에게 다음 사항의 처리를 위임합니다.


작성일 :    년   월   일
위임인 : ○ ○ ○ (인)`,
  guide: [
    { h2: '위임장이란' },
    { p: '위임장은 <strong>본인이 직접 처리하기 어려운 일을 다른 사람(대리인)에게 맡기는 문서</strong>입니다. 관공서 서류 발급, 부동산 계약, 은행 업무, 각종 신청 등에서 본인 대신 대리인이 처리할 권한을 부여할 때 사용합니다.' },
    { h2: '위임장 작성 시 핵심' },
    { ul: ['<strong>위임 내용을 구체적으로</strong> — "모든 업무"처럼 막연히 쓰지 말고 처리할 일을 명확히 특정', '위임인·대리인의 <strong>성명, 생년월일, 연락처</strong> 정확히 기재', '위임인의 <strong>서명 또는 인감 날인</strong>', '기관에 따라 <strong>인감증명서</strong> 첨부가 필요'] },
    { h2: '인감증명서가 필요한 경우' },
    { p: '부동산 거래, 금융 업무 등 중요한 일을 위임할 때는 위임장에 <strong>인감도장을 날인하고 인감증명서를 함께 제출</strong>해야 하는 경우가 많습니다. 인감증명서는 주민센터나 정부24에서 발급받으며, "위임용"으로 발급하면 됩니다.' },
    { h2: '위임장 사용 예시' },
    { ul: ['가족 대신 <strong>주민등록등본·인감증명서</strong> 발급', '본인 대신 <strong>전입신고·자동차 등록</strong>', '부동산 <strong>계약·등기</strong> 대리', '은행 <strong>계좌·대출</strong> 관련 업무'] },
  ],
  faq: [
    { q: '위임장에 꼭 인감도장을 찍어야 하나요?', a: '일반적인 업무는 서명이나 막도장도 가능하지만, 부동산·금융 등 중요한 일은 인감도장 날인과 인감증명서 첨부를 요구하는 경우가 많습니다. 제출처에 미리 확인하세요.' },
    { q: '가족도 위임장이 필요한가요?', a: '가족이라도 본인이 아닌 사람이 서류를 발급받거나 업무를 대리하려면 위임장이 필요합니다. 다만 일부 서류는 직계가족은 위임장 없이 발급 가능한 경우도 있습니다.' },
  ],
},
{
  id: 'complaint', name: '고소장', category: '법률', emoji: '⚖️',
  desc: '수사기관에 범죄 사실을 신고하는 고소장 양식입니다.',
  howto: ['고소인과 피고소인 인적사항을 기재합니다.', '고소 취지와 범죄 사실을 육하원칙으로 작성합니다.', '증거자료를 첨부해 수사기관에 제출합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">고 소 장</h2>
<table class="form-table"><tr><th>고소인</th><td>성명 &nbsp;&nbsp; 주소 &nbsp;&nbsp; 연락처 &nbsp;</td></tr>
<tr><th>피고소인</th><td>성명 &nbsp;&nbsp; 주소 &nbsp;</td></tr></table>
<p style="margin-top:20px;"><strong>고소 취지</strong><br>고소인은 피고소인을 다음 죄명으로 고소하오니 처벌하여 주시기 바랍니다.</p>
<p style="margin-top:14px;"><strong>범죄 사실</strong></p>
<p class="form-reason">&nbsp;<br><br>&nbsp;</p>
<p style="text-align:right;margin-top:40px;">작성일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일 &nbsp;&nbsp; 고소인 : ○ ○ ○ (인)</p>
<p style="text-align:center;margin-top:10px;">○ ○ 경찰서장 / ○ ○ 지방검찰청 귀중</p>`,
  txt: `고 소 장

고소인 : 성명    주소    연락처
피고소인 : 성명    주소

고소 취지
고소인은 피고소인을 다음 죄명으로 고소하오니 처벌하여 주시기 바랍니다.

범죄 사실


작성일 :    년   월   일    고소인 : ○ ○ ○ (인)

○ ○ 경찰서장 / ○ ○ 지방검찰청 귀중`,
},
// ───────── 생활 (5) ─────────
{
  id: 'self_intro', name: '자기소개서', category: '생활', emoji: '🙋',
  desc: '입사·지원용 자기소개서 기본 양식입니다.',
  howto: ['지원 분야와 인적사항을 기재합니다.', '성장과정·지원동기·입사후포부를 항목별로 작성합니다.', '분량과 맞춤법을 확인해 제출합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">자 기 소 개 서</h2>
<table class="form-table"><tr><th>성명</th><td>&nbsp;</td><th>지원 분야</th><td>&nbsp;</td></tr></table>
<p style="margin-top:16px;"><strong>1. 성장과정</strong></p><p class="form-reason">&nbsp;</p>
<p style="margin-top:10px;"><strong>2. 지원동기</strong></p><p class="form-reason">&nbsp;</p>
<p style="margin-top:10px;"><strong>3. 입사 후 포부</strong></p><p class="form-reason">&nbsp;</p>`,
  txt: `자 기 소 개 서

성명 :
지원 분야 :

1. 성장과정


2. 지원동기


3. 입사 후 포부

`,
  guide: [
    { h2: '자기소개서란' },
    { p: '자기소개서는 <strong>지원자가 자신의 경험·역량·지원 동기를 서술해 회사에 어필하는 문서</strong>입니다. 이력서가 "사실 정보"라면 자기소개서는 "스토리"입니다. 채용 담당자는 자소서로 지원자의 인성, 직무 적합성, 입사 의지를 판단합니다.' },
    { h2: '기본 항목별 작성법' },
    { h3: '1. 성장과정' },
    { p: '단순한 연대기가 아니라 <strong>지금의 나를 만든 계기와 가치관</strong>을 중심으로 씁니다. 지원 직무와 연결되는 경험을 강조하면 좋습니다.' },
    { h3: '2. 지원동기' },
    { p: '"회사가 좋아서"가 아니라 <strong>"왜 이 회사, 이 직무여야 하는지"</strong>를 구체적으로 씁니다. 회사의 사업·비전과 본인의 목표를 연결하면 설득력이 높아집니다.' },
    { h3: '3. 입사 후 포부' },
    { p: '막연한 다짐이 아니라 <strong>구체적인 기여 계획</strong>을 제시합니다. "무엇을, 어떻게 하겠다"가 드러나야 합니다.' },
    { h2: '자소서 잘 쓰는 팁' },
    { ul: ['<strong>두괄식</strong>으로 — 결론(핵심)을 앞에 배치', '<strong>구체적 사례·수치</strong>로 뒷받침 (추상적 표현 지양)', '회사·직무에 맞춰 <strong>매번 새로 작성</strong> (복붙 금지)', '<strong>맞춤법·오타</strong> 반드시 확인', '지정 분량을 지키고 소제목을 활용'] },
  ],
  faq: [
    { q: '자기소개서 분량은 어느 정도가 적당한가요?', a: '회사가 지정한 분량을 지키는 것이 원칙입니다. 지정이 없으면 항목당 500~800자, 전체 A4 1~2장 정도가 무난합니다.' },
    { q: '경력이 없는데 뭘 써야 하나요?', a: '아르바이트, 동아리, 프로젝트, 봉사활동 등 모든 경험에서 직무와 연결되는 역량(책임감, 문제해결, 협업 등)을 끌어내 씁니다. 경험의 크기보다 배운 점이 중요합니다.' },
  ],
},
{
  id: 'statement', name: '진술서', category: '생활', emoji: '🗣️',
  desc: '사건·사고 경위를 진술하는 진술서 양식입니다.',
  howto: ['진술인 인적사항을 기재합니다.', '사건 일시·장소·경위를 사실대로 작성합니다.', '진술인이 서명·날인합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">진 술 서</h2>
<table class="form-table"><tr><th>진술인</th><td>성명 &nbsp;&nbsp; 생년월일 &nbsp;&nbsp; 연락처 &nbsp;</td></tr>
<tr><th>일시/장소</th><td>&nbsp; 년 &nbsp; 월 &nbsp; 일 &nbsp; / &nbsp;</td></tr></table>
<p style="margin-top:16px;"><strong>진술 내용</strong></p>
<p class="form-reason">본인은 다음과 같이 사실대로 진술합니다.<br><br>&nbsp;<br><br>&nbsp;</p>
<p style="text-align:right;margin-top:40px;">작성일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일 &nbsp;&nbsp; 진술인 : ○ ○ ○ (인)</p>`,
  txt: `진 술 서

진술인 : 성명    생년월일    연락처
일시/장소 :    년   월   일  /

진술 내용
본인은 다음과 같이 사실대로 진술합니다.



작성일 :    년   월   일    진술인 : ○ ○ ○ (인)`,
},
{
  id: 'complaint_report', name: '민원신청서', category: '생활', emoji: '📋',
  desc: '관공서에 민원을 신청할 때 사용하는 민원신청서 양식입니다.',
  howto: ['신청인 인적사항을 기재합니다.', '민원 제목과 내용을 구체적으로 적습니다.', '해당 기관에 제출합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">민 원 신 청 서</h2>
<table class="form-table"><tr><th>신청인</th><td>성명 &nbsp;&nbsp; 연락처 &nbsp;&nbsp; 주소 &nbsp;</td></tr>
<tr><th>제목</th><td>&nbsp;</td></tr></table>
<p style="margin-top:16px;"><strong>민원 내용</strong></p>
<p class="form-reason">&nbsp;<br><br>&nbsp;</p>
<p style="text-align:right;margin-top:40px;">신청일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일 &nbsp;&nbsp; 신청인 : ○ ○ ○ (인)</p>
<p style="text-align:center;margin-top:10px;">○ ○ ○ 귀중</p>`,
  txt: `민 원 신 청 서

신청인 : 성명    연락처    주소
제목 :

민원 내용


신청일 :    년   월   일    신청인 : ○ ○ ○ (인)

○ ○ ○ 귀중`,
},
{
  id: 'donation', name: '기부금영수증', category: '생활', emoji: '🧾',
  desc: '기부금 납부 사실을 증명하는 영수증 양식입니다.',
  howto: ['기부자와 기부받는 단체 정보를 기재합니다.', '기부 금액과 일자, 용도를 적습니다.', '단체 직인을 날인해 발급합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:8px;">기 부 금 영 수 증</h2>
<table class="form-table"><tr><th>기부자</th><td>성명 &nbsp;&nbsp; 주민(사업자)번호 &nbsp;</td></tr>
<tr><th>기부 금액</th><td>금 &nbsp; 원정</td></tr>
<tr><th>기부 일자</th><td>&nbsp; 년 &nbsp; 월 &nbsp; 일</td></tr></table>
<p>위와 같이 기부금을 정히 영수하였음을 증명합니다.</p>
<p style="text-align:right;margin-top:40px;">발급일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일</p>
<p style="text-align:center;margin-top:16px;font-weight:700;">단체명 : ○ ○ ○ &nbsp;&nbsp; 대표 ○ ○ ○ (인)</p>`,
  txt: `기 부 금 영 수 증

기부자 : 성명    주민(사업자)번호
기부 금액 : 금        원정
기부 일자 :    년   월   일

위와 같이 기부금을 정히 영수하였음을 증명합니다.

발급일 :    년   월   일

단체명 : ○ ○ ○     대표 ○ ○ ○ (인)`,
},
{
  id: 'consent', name: '개인정보동의서', category: '생활', emoji: '🔒',
  desc: '개인정보 수집·이용에 대한 동의를 받는 양식입니다.',
  howto: ['수집 항목과 이용 목적, 보유 기간을 명시합니다.', '정보주체가 동의 여부를 체크합니다.', '서명·날인으로 동의를 확인합니다.'],
  bodyHTML: `<h2 style="text-align:center;letter-spacing:6px;">개인정보 수집·이용 동의서</h2>
<table class="form-table"><tr><th>수집 항목</th><td>성명, 연락처, 주소 등</td></tr>
<tr><th>이용 목적</th><td>&nbsp;</td></tr>
<tr><th>보유 기간</th><td>&nbsp;</td></tr></table>
<p style="margin-top:16px;">위 개인정보 수집·이용에 동의하십니까? &nbsp;&nbsp; □ 동의함 &nbsp;&nbsp; □ 동의하지 않음</p>
<p style="text-align:right;margin-top:40px;">동의일 : &nbsp;&nbsp; 년 &nbsp; 월 &nbsp; 일 &nbsp;&nbsp; 성명 : ○ ○ ○ (인)</p>`,
  txt: `개인정보 수집·이용 동의서

수집 항목 : 성명, 연락처, 주소 등
이용 목적 :
보유 기간 :

위 개인정보 수집·이용에 동의하십니까?
□ 동의함   □ 동의하지 않음

동의일 :    년   월   일    성명 : ○ ○ ○ (인)`,
},
];
