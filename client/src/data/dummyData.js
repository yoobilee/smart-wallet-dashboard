// =============================================
// 더미 데이터 - 포트폴리오 시연용
// =============================================

export const accounts = [
  { id: 1, bank: "신한은행",   type: "입출금", balance: 1240000, accountNumber: "****-****-4521" },
  { id: 2, bank: "카카오뱅크", type: "입출금", balance: 830000,  accountNumber: "3333-****-6575" },
  { id: 3, bank: "토스뱅크",   type: "입출금", balance: 120000,  accountNumber: "****-****-5678" },
  { id: 4, bank: "우리은행",   type: "저축",   balance: 3500000, accountNumber: "****-****-1234" },
  { id: 5, bank: "케이뱅크",   type: "입출금", balance: 200000,  accountNumber: "****-****-9012" },
  { id: 6, bank: "현대카드",   type: "카드",   balance: 0,       accountNumber: "****-****-621*" },
];

export const investments = [
  { id: 1, platform: "NH CMA",  type: "CMA",   balance: 500000  },
  { id: 2, platform: "NH ISA",  type: "ISA",   balance: 1200000 },
  { id: 3, platform: "토스증권", type: "주식",  balance: 350000  },
];

export const cards = [
  { id: 1, company: "현대카드", name: "ZERO MOBILE Edition2", usedThisMonth: 285000, billingDate: 12 },
];

export const transactions = [
  // 5월
  { id: 1,  date: "2026-05-10", description: "뉴월드식자재마트",    category: "식비",   amount: -23200,  type: "카드",  account: "현대카드"  },
  { id: 2,  date: "2026-05-09", description: "카공족미사역점",      category: "카페",   amount: -5900,   type: "카드",  account: "현대카드"  },
  { id: 3,  date: "2026-05-08", description: "쿠팡이츠",            category: "식비",   amount: -17700,  type: "카드",  account: "현대카드"  },
  { id: 4,  date: "2026-05-07", description: "GS25",                category: "편의점", amount: -3200,   type: "카드",  account: "현대카드"  },
  { id: 5,  date: "2026-05-06", description: "다이소",              category: "쇼핑",   amount: -5000,   type: "카드",  account: "현대카드"  },
  { id: 6,  date: "2026-05-05", description: "월급",                category: "수입",   amount: 2400000, type: "입금",  account: "신한은행"  },
  { id: 7,  date: "2026-05-04", description: "스타벅스",            category: "카페",   amount: -6500,   type: "카드",  account: "현대카드"  },
  { id: 8,  date: "2026-05-03", description: "배스킨라빈스",        category: "카페",   amount: -13500,  type: "카드",  account: "현대카드"  },
  { id: 9,  date: "2026-05-02", description: "CU",                  category: "편의점", amount: -2500,   type: "카드",  account: "현대카드"  },
  { id: 10, date: "2026-05-01", description: "카카오페이",          category: "이체",   amount: -50000,  type: "이체",  account: "카카오뱅크" },
  // 4월
  { id: 11, date: "2026-04-29", description: "현대카드",            category: "이체",   amount: -285000, type: "이체",  account: "카카오뱅크" },
  { id: 12, date: "2026-04-28", description: "쿠팡",                category: "쇼핑",   amount: -43200,  type: "카드",  account: "현대카드"  },
  { id: 13, date: "2026-04-27", description: "월급",                category: "수입",   amount: 2400000, type: "입금",  account: "신한은행"  },
  { id: 14, date: "2026-04-26", description: "배달의민족",          category: "식비",   amount: -24000,  type: "카드",  account: "현대카드"  },
  { id: 15, date: "2026-04-25", description: "올리브영",            category: "쇼핑",   amount: -32000,  type: "카드",  account: "현대카드"  },
  { id: 16, date: "2026-04-24", description: "티머니버스",          category: "교통",   amount: -1200,   type: "카드",  account: "현대카드"  },
  { id: 17, date: "2026-04-23", description: "넷플릭스",            category: "구독",   amount: -17000,  type: "카드",  account: "현대카드"  },
  { id: 18, date: "2026-04-22", description: "GS25",                category: "편의점", amount: -4800,   type: "카드",  account: "현대카드"  },
  { id: 19, date: "2026-04-21", description: "더현대서울",          category: "쇼핑",   amount: -85000,  type: "카드",  account: "현대카드"  },
  { id: 20, date: "2026-04-20", description: "스타벅스",            category: "카페",   amount: -6500,   type: "카드",  account: "현대카드"  },
  { id: 21, date: "2026-04-19", description: "코스트코",            category: "쇼핑",   amount: -145000, type: "카드",  account: "현대카드"  },
  { id: 22, date: "2026-04-18", description: "경기시내버스",        category: "교통",   amount: -1650,   type: "카드",  account: "현대카드"  },
  { id: 23, date: "2026-04-17", description: "하이오커피",          category: "카페",   amount: -2000,   type: "카드",  account: "현대카드"  },
  { id: 24, date: "2026-04-16", description: "다이소",              category: "쇼핑",   amount: -5000,   type: "카드",  account: "현대카드"  },
  { id: 25, date: "2026-04-15", description: "뉴월드식자재마트",    category: "식비",   amount: -25000,  type: "카드",  account: "현대카드"  },
  { id: 26, date: "2026-04-14", description: "쿠팡이츠",            category: "식비",   amount: -14700,  type: "카드",  account: "현대카드"  },
  { id: 27, date: "2026-04-13", description: "카카오페이증권",      category: "투자",   amount: -100000, type: "이체",  account: "카카오뱅크" },
  { id: 28, date: "2026-04-12", description: "하이오커피",          category: "카페",   amount: -2000,   type: "카드",  account: "현대카드"  },
  { id: 29, date: "2026-04-11", description: "팔로피자",            category: "식비",   amount: -27500,  type: "카드",  account: "현대카드"  },
  { id: 30, date: "2026-04-10", description: "컬리",                category: "쇼핑",   amount: -32450,  type: "카드",  account: "현대카드"  },
  { id: 31, date: "2026-04-09", description: "Apple",               category: "구독",   amount: -14000,  type: "카드",  account: "현대카드"  },
  { id: 32, date: "2026-04-08", description: "CU",                  category: "편의점", amount: -3600,   type: "카드",  account: "현대카드"  },
  { id: 33, date: "2026-04-07", description: "경기시내버스",        category: "교통",   amount: -1650,   type: "카드",  account: "현대카드"  },
  { id: 34, date: "2026-04-06", description: "토스뱅크 이자",       category: "수입",   amount: 12000,   type: "입금",  account: "토스뱅크"  },
  { id: 35, date: "2026-04-05", description: "버거킹",              category: "식비",   amount: -9500,   type: "카드",  account: "현대카드"  },
  { id: 36, date: "2026-04-04", description: "Spotify",             category: "구독",   amount: -10900,  type: "카드",  account: "현대카드"  },
  { id: 37, date: "2026-04-03", description: "카카오페이",          category: "이체",   amount: -30000,  type: "이체",  account: "카카오뱅크" },
  { id: 38, date: "2026-04-02", description: "GS25",                category: "편의점", amount: -2000,   type: "카드",  account: "현대카드"  },
  { id: 39, date: "2026-04-01", description: "뉴월드식자재마트",    category: "식비",   amount: -18000,  type: "카드",  account: "현대카드"  },
  // 3월
  { id: 40, date: "2026-03-27", description: "월급",                category: "수입",   amount: 2400000, type: "입금",  account: "신한은행"  },
  { id: 41, date: "2026-03-25", description: "현대카드",            category: "이체",   amount: -312000, type: "이체",  account: "카카오뱅크" },
  { id: 42, date: "2026-03-22", description: "올리브영",            category: "쇼핑",   amount: -45000,  type: "카드",  account: "현대카드"  },
  { id: 43, date: "2026-03-20", description: "스타벅스",            category: "카페",   amount: -13000,  type: "카드",  account: "현대카드"  },
  { id: 44, date: "2026-03-18", description: "배달의민족",          category: "식비",   amount: -32000,  type: "카드",  account: "현대카드"  },
  { id: 45, date: "2026-03-15", description: "Spotify",             category: "구독",   amount: -10900,  type: "카드",  account: "현대카드"  },
  { id: 46, date: "2026-03-12", description: "코스트코",            category: "쇼핑",   amount: -98000,  type: "카드",  account: "현대카드"  },
  { id: 47, date: "2026-03-10", description: "경기시내버스",        category: "교통",   amount: -15000,  type: "카드",  account: "현대카드"  },
  { id: 48, date: "2026-03-05", description: "다이소",              category: "쇼핑",   amount: -12000,  type: "카드",  account: "현대카드"  },
  { id: 49, date: "2026-03-03", description: "뉴월드식자재마트",    category: "식비",   amount: -45000,  type: "카드",  account: "현대카드"  },
  { id: 50, date: "2026-03-01", description: "토스뱅크 이자",       category: "수입",   amount: 11000,   type: "입금",  account: "토스뱅크"  },
  // 2월
  { id: 51, date: "2026-02-26", description: "월급",                category: "수입",   amount: 2400000, type: "입금",  account: "신한은행"  },
  { id: 52, date: "2026-02-20", description: "현대카드",            category: "이체",   amount: -298000, type: "이체",  account: "카카오뱅크" },
  { id: 53, date: "2026-02-18", description: "쿠팡",                category: "쇼핑",   amount: -67000,  type: "카드",  account: "현대카드"  },
  { id: 54, date: "2026-02-14", description: "배달의민족",          category: "식비",   amount: -28000,  type: "카드",  account: "현대카드"  },
  { id: 55, date: "2026-02-10", description: "Spotify",             category: "구독",   amount: -10900,  type: "카드",  account: "현대카드"  },
  { id: 56, date: "2026-02-07", description: "스타벅스",            category: "카페",   amount: -18500,  type: "카드",  account: "현대카드"  },
  { id: 57, date: "2026-02-05", description: "올리브영",            category: "쇼핑",   amount: -38000,  type: "카드",  account: "현대카드"  },
  { id: 58, date: "2026-02-01", description: "토스뱅크 이자",       category: "수입",   amount: 11000,   type: "입금",  account: "토스뱅크"  },
  // 1월
  { id: 59, date: "2026-01-27", description: "월급",                category: "수입",   amount: 2400000, type: "입금",  account: "신한은행"  },
  { id: 60, date: "2026-01-20", description: "현대카드",            category: "이체",   amount: -275000, type: "이체",  account: "카카오뱅크" },
  { id: 61, date: "2026-01-15", description: "Spotify",             category: "구독",   amount: -10900,  type: "카드",  account: "현대카드"  },
  { id: 62, date: "2026-01-12", description: "코스트코",            category: "쇼핑",   amount: -120000, type: "카드",  account: "현대카드"  },
  { id: 63, date: "2026-01-08", description: "배달의민족",          category: "식비",   amount: -35000,  type: "카드",  account: "현대카드"  },
  { id: 64, date: "2026-01-05", description: "스타벅스",            category: "카페",   amount: -7500,   type: "카드",  account: "현대카드"  },
  { id: 65, date: "2026-01-01", description: "토스뱅크 이자",       category: "수입",   amount: 10000,   type: "입금",  account: "토스뱅크"  },
];

export const totalCardSpending = transactions
  .filter((t) => t.account === "현대카드" && t.amount < 0)
  .reduce((sum, t) => sum + Math.abs(t.amount), 0);

export const totalBankBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
export const totalInvestmentBalance = investments.reduce((sum, inv) => sum + inv.balance, 0);
export const availableBalance = totalBankBalance;
export const totalAssets = totalBankBalance + totalInvestmentBalance;

export const thisMonthIncome = transactions
  .filter((t) => t.amount > 0 && t.date >= "2026-05-01")
  .reduce((sum, t) => sum + t.amount, 0);

export const thisMonthExpense = transactions
  .filter((t) => t.amount < 0 && t.category !== "투자" && t.category !== "이체" && t.date >= "2026-05-01")
  .reduce((sum, t) => sum + t.amount, 0);