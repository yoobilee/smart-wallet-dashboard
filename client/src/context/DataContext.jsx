// =============================================
// DataContext.jsx - 전역 데이터 상태 관리
// =============================================

import { createContext, useContext, useState, useEffect } from "react";
import { transactions as dummyTransactions, accounts as dummyAccounts } from "../data/dummyData";

// ── 상수 ───────────────────────────────────────
const MY_NAME = "이유비";
const SHINHAN_TRANSFER_TYPES = ["모바일", "타행IB", "FB이체"];
const CODEF_START_DATE = "20260401";
const CODEF_END_DATE = "20260502";
const BACKEND_URL = "http://localhost:3000";

const CATEGORY_KEYWORDS = {
  카페: ["스타벅스", "커피", "카페", "이디야", "빽다방", "메가커피", "투썸", "할리스", "폴바셋", "커피빈", "엔젤리너스", "뚜레쥬르", "파리바게뜨", "던킨", "논오프", "공차", "더벤티", "매머드커피", "블루보틀", "디저트", "베이커리", "하이오커피", "빙수", "케이크"],
  식비: ["식당", "맥도날드", "버거킹", "롯데리아", "KFC", "맘스터치", "배달", "요기요", "배민", "쿠팡이츠", "김밥", "피자", "팔로피자", "도미노", "파파존스", "BBQ", "굽네", "BHC", "교촌", "서브웨이", "샌드위치", "포케", "초밥", "스시", "일식", "중식", "한식", "분식", "국밥", "칼국수", "냉면", "떡볶이", "치킨", "삼겹살", "고기", "식자재", "뉴월드", "마트", "배스킨", "아이스크림", "버거", "도넛"],
  편의점: ["GS25", "CU", "세븐일레븐", "이마트24", "미니스톱", "코리아세븐", "씨유"],
  쇼핑: ["쿠팡", "올리브영", "무신사", "지그재그", "마켓컬리", "SSG", "11번가", "G마켓", "옥션", "위메프", "티몬", "다이소", "아성", "이케아", "자라", "유니클로", "H&M", "에이블리", "브랜디", "롯데마트", "이마트", "홈플러스", "코스트코", "트레이더스", "계란", "무인", "슈퍼", "시장"],
  교통: ["교통", "버스", "지하철", "택시", "카카오택시", "우버", "티머니", "기차", "KTX", "SRT", "코레일", "항공", "공항", "주유", "주차", "톨게이트", "하이패스"],
  구독: ["넷플릭스", "유튜브", "스포티파이", "왓챠", "웨이브", "애플", "구글", "네이버플러스", "멜론", "지니", "디즈니", "라프텔", "밀리의서재", "리디", "GamsGo", "멤버스", "membership", "카카오 - 주식회사", "이모티콘"],
  의료: ["병원", "약국", "의원", "클리닉", "치과", "한의원", "피부과", "안과", "정형외과", "내과", "외과", "산부인과", "소아과", "약", "의료", "건강"],
  생활: ["런드리", "세탁", "클리닝", "청소", "수선", "미용", "헤어", "네일", "마사지", "스파"],
  투자: ["증권", "투자", "펀드", "ETF", "주식", "NH투자", "미래에셋", "삼성증권", "키움", "신한투자", "KB증권"],
  이체: ["네이버페이충전", "네이버페이", "카카오페이", "토스", "페이코", "FB이체", "타행이체", "CD송금", "현대카드", "신한카드", "삼성카드", "KB카드", "롯데카드", "우리카드", "이유비"],
};

// ── 순수 함수 ──────────────────────────────────
const categorize = (description, amount) => {
  const d = description || "";
  if (amount > 0) {
    if (d.includes("급여") || d.includes("월급")) return "수입";
    if (d.includes("이자")) return "수입";
    if (d.includes("컴즈")) return "수입";
    return "수입";
  }
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => d.includes(k))) return category;
  }
  return "기타";
};

const getTransferCategory = (memo, isTransfer, amount) => {
  if (!isTransfer) return null;
  if (amount > 0) return memo.includes(MY_NAME) ? "이체" : null;
  return memo.includes(MY_NAME) ? "이체" : "지출이체";
};

const getThisMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return {
    start: `${year}-${month}-01`,
    end: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
  };
};

const categorizeShinhan = (shinhanType, memo, amount) => {
  if (amount < 0) {
    const isPaymentCharge = ["네이버페이충전", "네이버페이", "카카오페이", "현대카드", MY_NAME].some((k) => memo.includes(k));
    const isPersonalTransfer = SHINHAN_TRANSFER_TYPES.includes(shinhanType);
    const transferCategory = getTransferCategory(memo, isPersonalTransfer, amount);
    return isPaymentCharge ? "이체" : transferCategory ?? categorize(memo, amount);
  }
  if (amount > 0) {
    const isSelfTransfer = ["CD송금", "타행IB", "타행MB", "타행PC", "타행FB"].includes(shinhanType) && memo.includes(MY_NAME);
    return isSelfTransfer ? "이체" : categorize(memo, amount);
  }
  return "기타";
};

const formatDate8 = (d) =>
  d?.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : (d || "");

// CODEF 응답 파싱 헬퍼
const parseCodefResponse = (raw) =>
  typeof raw === "string" ? JSON.parse(raw) : raw;

// CODEF API POST 헬퍼
const codefPost = async (endpoint, body) => {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseCodefResponse(await res.json());
};

// ── Context ────────────────────────────────────
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [realTransactions, setRealTransactions] = useState([]);
  const [realAccounts, setRealAccounts] = useState([]);
  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem("holdings");
    return saved ? JSON.parse(saved) : [];
  });
  const [prices, setPrices] = useState({});
  const [monthlyGoal, setMonthlyGoal] = useState(() =>
    parseInt(localStorage.getItem("monthlyGoal") || "0")
  );
  const [manualBalances, setManualBalances] = useState(() => {
    const saved = localStorage.getItem("manualBalances");
    return saved ? JSON.parse(saved) : {
      웰컴은행: 0, 사이다뱅크: 0, 하나멤버스: 0,
      NH_CMA: 0, NH_ISA: 0, 토스증권: 0, 유안타: 0, 카카오페이증권: 0,
      네이버페이: 0, 카카오페이머니: 0,
    };
  });

  const transactions = isDemoMode ? dummyTransactions : realTransactions;
  const accounts = isDemoMode ? dummyAccounts : realAccounts;

  // ── 파서 ───────────────────────────────────────
  const parseShinhanCSV = (csvText) => {
    const lines = csvText.split("\n").filter((l) => l.trim());
    const dataLines = lines.slice(1);
    let latestBalance = 0;

    const parsed = dataLines.map((line, index) => {
      const cols = line.trim().split(/\s+/);
      const date = cols[0] || "";
      const outAmt = parseInt(cols[3]?.replace(/,/g, "") || "0");
      const inAmt = parseInt(cols[4]?.replace(/,/g, "") || "0");
      const balanceIndex = cols.length - 2;
      const balance = parseInt(cols[balanceIndex]?.replace(/,/g, "") || "0");
      const memo = cols.slice(5, balanceIndex).join(" ");
      const amount = inAmt > 0 ? inAmt : -outAmt;
      const shinhanType = cols[2] || "";

      if (index === 0) latestBalance = balance;

      return {
        id: `real-${index}`,
        date: formatDate8(date),
        description: memo,
        category: categorizeShinhan(shinhanType, memo, amount),
        amount,
        type: inAmt > 0 ? "입금" : "출금",
        account: "신한은행",
        balance,
      };
    }).filter((t) => t.amount !== 0);

    return { transactions: parsed, balance: latestBalance };
  };

  const parseKakaoBankCSV = (csvText) => {
    const lines = csvText.split("\n").filter((l) => l.trim());
    const dataLines = lines.slice(1);
    let latestBalance = 0;

    const parsed = dataLines.map((line, index) => {
      const cols = line.trim().split(/\s+/);
      const date = cols[0] || "";
      const amount = parseInt(cols[2]?.replace(/,/g, "") || "0");
      const balance = parseInt(cols[3]?.replace(/,/g, "") || "0");
      const memo = cols.slice(4, cols.length - 1).join(" ");
      const txType = cols[cols.length - 1] || "";

      if (index === 0) latestBalance = balance;

      const isTransfer = txType.includes("이체") || txType.includes("일반입금");
      const isPaymentCharge = ["카카오페이", "현대카드", "네이버페이", MY_NAME].some((k) => memo.includes(k));
      const transferCategory = isPaymentCharge ? "이체" : getTransferCategory(memo, isTransfer, amount);
      const category = transferCategory ?? categorize(memo, amount);

      return {
        id: `kakao-${index}`,
        date: date.length >= 8 ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}` : date,
        description: memo,
        category,
        amount,
        type: amount > 0 ? "입금" : "출금",
        account: "카카오뱅크",
      };
    }).filter((t) => t.amount !== 0);

    return { transactions: parsed, balance: latestBalance };
  };

  const parseTossBankCSV = (csvText) => {
    const lines = csvText.split("\n").filter((l) => l.trim());
    const dataLines = lines.slice(1);
    let latestBalance = 0;

    const parsed = dataLines.map((line, index) => {
      const cols = line.split(",").map((c) => c.trim().replace(/₩/g, "").replace(/"/g, ""));
      const date = cols[0] || "";
      const amount = parseFloat(cols[5]?.replace(/,/g, "").replace(/\s/g, "") || "0");
      const balanceRaw = cols[7]?.match(/^\d+$/) ? cols[6] + cols[7] : cols[6];
      const balance = parseInt(balanceRaw?.replace(/[^0-9]/g, "") || "0");
      const memo = (cols[7] || cols[1] || "").trim();

      if (index === 0) latestBalance = balance;

      const isTransfer = ["이체", "송금"].some((k) => (cols[2] || "").includes(k));
      const transferCategory = getTransferCategory(memo || cols[1], isTransfer, amount);
      const category = transferCategory ?? categorize(memo || cols[1], amount);

      return {
        id: `toss-${index}`,
        date: date.slice(0, 10).replace(/\./g, "-"),
        description: memo || cols[1],
        category,
        amount,
        type: amount > 0 ? "입금" : "출금",
        account: "토스뱅크",
      };
    }).filter((t) => t.amount !== 0);

    return { transactions: parsed, balance: latestBalance };
  };

  const parseHyundaiCardCSV = (csvText) => {
    const lines = csvText.split("\n").filter((l) => l.trim());
    const dataLines = lines.slice(1);

    const parsed = dataLines.map((line, index) => {
      const cols = [];
      let current = "", inQuotes = false;
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; }
        else if (char === "," && !inQuotes) { cols.push(current.trim()); current = ""; }
        else { current += char; }
      }
      cols.push(current.trim());

      const memo = cols[4] || "";
      const amount = parseInt(cols[5]?.replace(/,/g, "") || "0");
      const installment = parseInt(cols[7] || "1");
      const monthlyAmount = installment > 1 ? Math.round(amount / installment) : amount;

      if (cols[10] === "취소") return null;

      return {
        id: `hyundai-${index}`,
        date: (cols[0] || "").replace("년 ", "-").replace("월 ", "-").replace("일", "").trim(),
        description: memo,
        category: categorize(memo, -amount),
        amount: -monthlyAmount,
        type: "카드",
        account: "현대카드",
      };
    }).filter((t) => t !== null && t.amount !== 0);

    return { transactions: parsed, balance: 0 };
  };

  const parseKakaoPayCSV = (csvText) => {
    const lines = csvText.split("\n").filter((l) => l.trim());
    const dataLines = lines.slice(1);
    let latestBalance = 0;

    const parsed = dataLines.map((line, index) => {
      const cols = line.split(",").map((c) => c.trim().replace(/"/g, ""));
      const txType = cols[1] || "";
      const amount = parseInt(cols[2]?.replace(/,/g, "") || "0");
      const balance = parseInt(cols[3]?.replace(/,/g, "") || "0");
      const memo = cols[5] || cols[4] || "";
      const isDebit = txType.includes("[-]");
      const finalAmount = isDebit ? -amount : amount;

      latestBalance = balance;

      return {
        id: `kakaopay-${index}`,
        date: (cols[0] || "").slice(0, 10),
        description: memo || txType,
        category: txType.includes("충전") ? "이체" : categorize(memo, finalAmount),
        amount: finalAmount,
        type: isDebit ? "결제" : "충전",
        account: "카카오페이",
      };
    }).filter((t) => t.amount !== 0);

    return { transactions: parsed, balance: latestBalance };
  };

  const parseWooriBankCSV = (csvText) => {
    const lines = csvText.split("\n").filter((l) => l.trim());
    const dataLines = lines.slice(1);
    let latestBalance = 0;

    const parsed = dataLines.map((line, index) => {
      const cols = [];
      let current = "", inQuotes = false;
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; }
        else if (char === "," && !inQuotes) { cols.push(current.trim()); current = ""; }
        else { current += char; }
      }
      cols.push(current.trim());

      const memo = cols[4] || cols[1] || "";
      const outAmt = parseInt(cols[5]?.replace(/,/g, "") || "0");
      const inAmt = parseInt(cols[6]?.replace(/,/g, "") || "0");
      const balance = parseInt(cols[7]?.replace(/,/g, "") || "0");
      const amount = inAmt > 0 ? inAmt : -outAmt;

      latestBalance = balance;

      return {
        id: `woori-${index}`,
        date: (cols[0] || "").slice(0, 10).replace(/\./g, "-"),
        description: memo,
        category: categorize(memo, amount),
        amount,
        type: inAmt > 0 ? "입금" : "출금",
        account: "우리은행",
      };
    }).filter((t) => t.amount !== 0);

    return { transactions: parsed, balance: latestBalance };
  };

  const parseCSV = (csvText, bankType) => {
    const parsers = {
      shinhan: parseShinhanCSV,
      kakao: parseKakaoBankCSV,
      toss: parseTossBankCSV,
      hyundai: parseHyundaiCardCSV,
      kakaopay: parseKakaoPayCSV,
      woori: parseWooriBankCSV,
    };
    return (parsers[bankType] || parseShinhanCSV)(csvText);
  };

  const loadCSVFile = (file, bankType) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(parseCSV(e.target.result, bankType));
      reader.onerror = reject;
      reader.readAsText(file, "UTF-8");
    });

  // ── 거래내역 + 계좌 추가 ───────────────────────
  const addTransactions = (newTransactions, accountInfo) => {
    setRealTransactions((prev) =>
      [...prev, ...newTransactions].sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    if (accountInfo) {
      setRealAccounts((prev) => {
        const exists = prev.find((acc) => acc.bank === accountInfo.bank);
        return exists
          ? prev.map((acc) => acc.bank === accountInfo.bank ? { ...acc, balance: accountInfo.balance } : acc)
          : [...prev, accountInfo];
      });
    }
    setIsDemoMode(false);
  };

  const resetToDemo = () => { setRealTransactions([]); setRealAccounts([]); setIsDemoMode(true); };

  // ── CODEF API 연동 ─────────────────────────────
  const fetchFromCodef = async () => {
    try {
      // 1. 신한은행 계좌 조회
      const accountData = await codefPost("/api/accounts", {
        connectedId: import.meta.env.VITE_CODEF_CONNECTED_ID_SHINHAN,
        organization: "0088",
      });

      if (accountData.result?.code !== "CF-00000") {
        alert(`CODEF 계좌 오류: ${accountData.result?.message}`);
        return;
      }

      const depositAccounts = accountData.data?.resDepositTrust || [];
      const mainAccount = depositAccounts[0];

      if (!mainAccount) { alert("신한은행 입출금 계좌를 찾을 수 없어요."); return; }

      // 신한은행 잔액 업데이트
      const shinhanBalance = parseInt(mainAccount.resAccountBalance || "0");
      setRealAccounts((prev) => {
        const exists = prev.find((a) => a.bank === "신한은행");
        return exists
          ? prev.map((a) => a.bank === "신한은행" ? { ...a, balance: shinhanBalance, accountNumber: mainAccount.resAccountDisplay } : a)
          : [...prev, { id: "shinhan-codef", bank: "신한은행", type: "입출금", balance: shinhanBalance, accountNumber: mainAccount.resAccountDisplay }];
      });

      // 2. 신한은행 거래내역 조회
      const txData = await codefPost("/api/transactions", {
        connectedId: import.meta.env.VITE_CODEF_CONNECTED_ID_SHINHAN,
        organization: "0088",
        account: mainAccount.resAccount,
        startDate: CODEF_START_DATE,
        endDate: CODEF_END_DATE,
      });

      if (txData.result?.code !== "CF-00000") {
        alert(`CODEF 거래내역 오류: ${txData.result?.message}`);
        return;
      }

      const txList = txData.data?.resTrHistoryList || [];
      const parsedShinhan = txList.map((tx, index) => {
        const amount = parseInt(tx.resAccountIn || "0") > 0
          ? parseInt(tx.resAccountIn)
          : -parseInt(tx.resAccountOut || "0");
        const shinhanType = tx.resAccountDesc2 || "";
        const memo = tx.resAccountDesc3 || "";

        return {
          id: `shinhan-codef-${index}`,
          date: formatDate8(tx.resAccountTrDate || ""),
          description: memo,
          category: categorizeShinhan(shinhanType, memo, amount),
          amount,
          type: amount > 0 ? "입금" : "출금",
          account: "신한은행",
        };
      }).filter((t) => t.amount !== 0);

      setRealTransactions((prev) => {
        const filtered = prev.filter((t) => !t.id.startsWith("shinhan-codef-"));
        return [...filtered, ...parsedShinhan].sort((a, b) => new Date(b.date) - new Date(a.date));
      });
      setIsDemoMode(false);

      // 3. 현대카드 승인내역 조회
      const cardData = await codefPost("/api/card-transactions", {
        connectedId: import.meta.env.VITE_CODEF_CONNECTED_ID_HYUNDAI,
        organization: "0302",
        startDate: CODEF_START_DATE,
        endDate: CODEF_END_DATE,
        cardNo: import.meta.env.VITE_CODEF_CARD_NO_HYUNDAI,
        cardPassword: import.meta.env.VITE_CODEF_CARD_PW_HYUNDAI,
      });

      let parsedCard = [];
      if (cardData.result?.code === "CF-00000") {
        const cardList = Array.isArray(cardData.data) ? cardData.data : [];

        parsedCard = cardList
          .filter((tx) => tx.resCancelYN !== "1")
          .map((tx, index) => {
            const amount = parseInt(tx.resUsedAmount || "0");
            const installment = parseInt(tx.resInstallmentMonth || "1");
            const monthlyAmt = installment > 1 ? Math.round(amount / installment) : amount;
            const memo = tx.resMemberStoreName || "";

            return {
              id: `hyundai-codef-${index}`,
              date: formatDate8(tx.resUsedDate || ""),
              description: memo,
              category: categorize(memo, -monthlyAmt),
              amount: -monthlyAmt,
              type: "카드",
              account: "현대카드",
            };
          }).filter((t) => t.amount !== 0);

        setRealTransactions((prev) => {
          const filtered = prev.filter((t) => !t.id.startsWith("hyundai-codef-"));
          return [...filtered, ...parsedCard].sort((a, b) => new Date(b.date) - new Date(a.date));
        });
        setRealAccounts((prev) => {
          const exists = prev.find((a) => a.bank === "현대카드");
          return exists
            ? prev
            : [...prev, { id: "hyundai-codef", bank: "현대카드", type: "카드", balance: 0, accountNumber: "****-****-****" }];
        });
      }

      alert(`업데이트 완료!\n신한은행 잔액: ${shinhanBalance.toLocaleString("ko-KR")}원\n신한은행 거래내역: ${parsedShinhan.length}건\n현대카드: ${parsedCard.length}건`);

    } catch (err) {
      console.error("CODEF API 오류:", err);
      alert("CODEF API 연결 실패. 백엔드 서버가 실행 중인지 확인해주세요.");
    }
  };

  // ── 계산 ───────────────────────────────────────
  const totalBankBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
    + (manualBalances.웰컴은행 || 0)
    + (manualBalances.사이다뱅크 || 0)
    + (manualBalances.하나멤버스 || 0);

  const totalInvestmentBalance = holdings.reduce((sum, h) => sum + (prices[h.code] || 0) * h.qty, 0)
    + (manualBalances.NH_CMA || 0)
    + (manualBalances.NH_ISA || 0)
    + (manualBalances.토스증권 || 0)
    + (manualBalances.유안타 || 0)
    + (manualBalances.카카오페이증권 || 0);

  const { start: thisMonthStart, end: thisMonthEnd } = getThisMonthRange();

  const thisMonthIncome = transactions
    .filter((t) => t.amount > 0 && t.category !== "이체" && t.date >= thisMonthStart && t.date <= thisMonthEnd)
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpense = transactions
    .filter((t) =>
      t.amount < 0 &&
      t.category !== "투자" &&
      t.category !== "이체" &&
      t.date >= thisMonthStart &&
      t.date <= thisMonthEnd
    )
    .reduce((sum, t) => sum + t.amount, 0);

  // ── localStorage 동기화 ────────────────────────
  useEffect(() => { localStorage.setItem("holdings", JSON.stringify(holdings)); }, [holdings]);
  useEffect(() => { localStorage.setItem("monthlyGoal", monthlyGoal); }, [monthlyGoal]);
  useEffect(() => { localStorage.setItem("manualBalances", JSON.stringify(manualBalances)); }, [manualBalances]);

  return (
    <DataContext.Provider value={{
      transactions, accounts, isDemoMode,
      loadCSVFile, addTransactions, resetToDemo,
      totalBankBalance, thisMonthIncome, thisMonthExpense, totalInvestmentBalance,
      holdings, setHoldings, prices, setPrices,
      monthlyGoal, setMonthlyGoal,
      manualBalances, setManualBalances,
      fetchFromCodef,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);