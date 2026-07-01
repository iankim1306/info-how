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
