// 所有資料皆為虛構情境，供 Demo 展示使用，非真實個資。

export const CASE_PRINCIPAL = {
  name: '王小明',
  idMasked: 'A12****789',
  role: '前端工程師',
  employer: '大成科技股份有限公司',
  caseId: 'LD-2026-0714-A031',
}

export const AUTHORIZATION = {
  grantedAt: '2026-07-14 09:00',
  expiresAt: '2026-07-21 09:00',
  durationLabel: '7 天',
  scope: [
    { action: '讀取 LINE 對話紀錄（唯讀）', allowed: true },
    { action: '讀取出勤打卡資料（唯讀）', allowed: true },
    { action: '比對加班時數與工資明細', allowed: true },
    { action: '草擬勞資爭議調解申請書', allowed: true },
    { action: '送出申請書至勞工局調解窗口', allowed: false, note: '需本人核准後才可執行' },
    { action: '修改或刪除原始證據內容', allowed: false, note: '一律禁止' },
    { action: '逾期後繼續執行任何動作', allowed: false, note: '授權到期自動停止' },
  ],
}

export const LINE_MESSAGES = [
  { id: 'm1', time: '2026-06-02 22:14', from: '主管 李課長', text: '這個月案子趕，這幾天都留下來加班，先不要打卡加班時數喔，之後用補休處理。' },
  { id: 'm2', time: '2026-06-02 22:16', from: '王小明', text: '好的，了解，那補休大概什麼時候可以排？' },
  { id: 'm3', time: '2026-06-02 22:20', from: '主管 李課長', text: '案子結束再說啦，先專心把這波趕完。' },
  { id: 'm4', time: '2026-06-28 20:05', from: '主管 李課長', text: '公司最近在精簡人力，你這個月表現我覺得跟不上團隊步調，下週開始你不用來了，會給你一個月薪水。' },
  { id: 'm5', time: '2026-06-28 20:11', from: '王小明', text: '這樣是資遣嗎？可以請人資跟我說明資遣的法定程序和條件嗎？' },
  { id: 'm6', time: '2026-06-28 20:30', from: '主管 李課長', text: '你就當作我們好聚好散，不要搞得那麼複雜。' },
]

export const ATTENDANCE_RECORDS = [
  { date: '2026-06-01', clockIn: '09:02', clockOut: '18:05', declaredOT: 0, note: '' },
  { date: '2026-06-02', clockIn: '08:57', clockOut: '22:41', declaredOT: 0, note: '系統顯示無加班申報，惟出勤紀錄顯示留公司至 22:41' },
  { date: '2026-06-03', clockIn: '09:00', clockOut: '21:58', declaredOT: 0, note: '同上，無加班申報' },
  { date: '2026-06-04', clockIn: '09:05', clockOut: '19:30', declaredOT: 0, note: '' },
  { date: '2026-06-05', clockIn: '08:59', clockOut: '22:12', declaredOT: 0, note: '無加班申報' },
]

export const DERIVED_FINDINGS = [
  '2026/06/02–06/05 期間共 3 日下班時間晚於 21:30，惟加班申報時數皆為 0，與 LINE 對話中主管要求「先不要打卡加班時數」相符。',
  '2026/06/28 對話紀錄顯示雇主片面告知終止勞動契約，惟未說明資遣事由與預告期間，與《勞動基準法》第 11、16 條所定程序有出入之虞。',
]

export const DOCUMENT_DRAFT = {
  title: '勞資爭議調解申請書（草稿）',
  applicant: CASE_PRINCIPAL.name,
  respondent: CASE_PRINCIPAL.employer,
  disputeType: '工資（加班費）爭議、資遣爭議',
  summary:
    '申請人於本案期間受雇主指示於下班後留任加班，惟雇主要求不予申報加班時數，致加班事實與出勤系統紀錄不符；復於 2026 年 6 月底遭雇主片面告知終止勞動契約，未依法說明資遣事由與預告程序。',
  requestedRemedy: [
    '請求確認雇主應給付未申報加班時數之加班費差額',
    '請求確認終止勞動契約之合法性，如認定為非法資遣，請求資遣費及相關給付',
  ],
  evidenceRefs: ['EV-01 LINE 對話紀錄（2026/06/02, 06/28）', 'EV-02 出勤打卡紀錄（2026/06/01–06/05）'],
}
