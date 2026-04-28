// =============================================
// 더미 데이터 - 실제 계좌 연동 전까지 사용할 가짜 데이터
// Phase 2에서 CODEF API 데이터로 교체 예정
// =============================================

// 계좌 목록
export const accounts = [
  { id: 1, bank: "카카오뱅크", type: "입출금", balance: 1240000, accountNumber: "3333-****-4521" },
  { id: 2, bank: "국민은행",   type: "입출금", balance: 830000,  accountNumber: "****-**-1234-56" },
  { id: 3, bank: "토스뱅크",  type: "저축",   balance: 3500000, accountNumber: "****-****-5678" },
];

// 투자(증권) 계좌 - 실제 사용 불가 금액
export const investments = [
  { id: 1, platform: "토스증권", type: "국내주식", balance: 2150000 },
  { id: 2, platform: "카카오페이증권", type: "ETF", balance: 980000 },
];

// 카드 목록
export const cards = [
  { id: 1, company: "신한카드", name: "Deep Dream", usedThisMonth: 320000, billingDate: 15 },
  { id: 2, company: "현대카드", name: "ZERO Edition3", usedThisMonth: 158000, billingDate: 25 },
];

// 최근 거래 내역
export const transactions = [
  { id: 1,  date: "2026-04-28", description: "스타벅스",       category: "카페",   amount: -6500,   type: "카드",  card: "신한카드" },
  { id: 2,  date: "2026-04-27", description: "월급",           category: "수입",   amount: 2400000, type: "입금",  account: "카카오뱅크" },
  { id: 3,  date: "2026-04-26", description: "쿠팡",           category: "쇼핑",   amount: -43200,  type: "카드",  card: "현대카드" },
  { id: 4,  date: "2026-04-25", description: "GS25",           category: "편의점", amount: -4800,   type: "카드",  card: "신한카드" },
  { id: 5,  date: "2026-04-24", description: "카카오페이증권", category: "투자",   amount: -100000, type: "이체",  account: "카카오뱅크" },
  { id: 6,  date: "2026-04-23", description: "넷플릭스",       category: "구독",   amount: -17000,  type: "카드",  card: "신한카드" },
  { id: 7,  date: "2026-04-22", description: "올리브영",       category: "쇼핑",   amount: -32000,  type: "카드",  card: "현대카드" },
  { id: 8,  date: "2026-04-21", description: "버거킹",         category: "식비",   amount: -9500,   type: "카드",  card: "신한카드" },
  { id: 9,  date: "2026-04-20", description: "교통카드 충전",  category: "교통",   amount: -50000,  type: "이체",  account: "카카오뱅크" },
  { id: 10, date: "2026-04-19", description: "토스뱅크 이자",  category: "수입",   amount: 12000,   type: "입금",  account: "토스뱅크" },
];

// =============================================
// 계산된 요약 데이터 (Dashboard에서 사용)
// =============================================

// 전체 은행 잔액 합계
export const totalBankBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

// 전체 투자 금액 합계
export const totalInvestmentBalance = investments.reduce((sum, inv) => sum + inv.balance, 0);

// 실제 사용 가능 금액 (은행 잔액 - 투자 이체분은 이미 빠져있으므로 은행 잔액 그대로)
export const availableBalance = totalBankBalance;

// 총 자산 (은행 + 투자)
export const totalAssets = totalBankBalance + totalInvestmentBalance;

// 이번 달 카드 지출 합계
export const totalCardSpending = cards.reduce((sum, card) => sum + card.usedThisMonth, 0);

// 이번 달 수입 합계
export const thisMonthIncome = transactions
  .filter(t => t.amount > 0)
  .reduce((sum, t) => sum + t.amount, 0);

// 이번 달 지출 합계 (카드+이체 포함, 투자 제외)
export const thisMonthExpense = transactions
  .filter(t => t.amount < 0 && t.category !== "투자")
  .reduce((sum, t) => sum + t.amount, 0);