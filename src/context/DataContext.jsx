// =============================================
// DataContext.jsx - 전역 데이터 상태 관리
// CSV로 업로드한 거래내역 + 계좌 잔액을 모든 페이지에서 공유
// =============================================

import { createContext, useContext, useState, useEffect } from "react";
import { transactions as dummyTransactions, accounts as dummyAccounts } from "../data/dummyData";

// Context 생성
const DataContext = createContext(null);

export function DataProvider({ children }) {
  // isDemoMode: true면 더미 데이터, false면 실제 데이터
  const [isDemoMode, setIsDemoMode] = useState(true);

  // 업로드된 실제 거래내역
  const [realTransactions, setRealTransactions] = useState([]);

  // 업로드된 계좌 목록 (잔액 포함)
  const [realAccounts, setRealAccounts] = useState([]);

  // 보유 종목 상태 (localStorage에서 불러오기)
  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem("holdings");
    return saved ? JSON.parse(saved) : [];
  });

  // 종목별 현재가 상태
  const [prices, setPrices] = useState({});

  // 현재 모드에 따라 사용할 데이터 반환
  const transactions = isDemoMode ? dummyTransactions : realTransactions;
  const accounts = isDemoMode ? dummyAccounts : realAccounts;

  // 거래 내용으로 카테고리 자동 분류하는 함수
  const categorize = (description, amount) => {
    const d = description || "";  // undefined 방지

    // 수입 (입금)
    if (amount > 0) {
      if (d.includes("급여") || d.includes("월급")) return "수입";
      if (d.includes("이자")) return "수입";
      return "이체";
    }

    // 카페
    if (["스타벅스", "커피", "카페", "이디야", "빽다방", "메가커피", "투썸"].some((k) => d.includes(k))) return "카페";

    // 식비
    if (["식당", "맥도날드", "버거킹", "롯데리아", "KFC", "맘스터치", "배달", "요기요", "배민", "쿠팡이츠", "김밥"].some((k) => d.includes(k))) return "식비";

    // 편의점
    if (["GS25", "CU", "세븐일레븐", "이마트24", "미니스톱"].some((k) => d.includes(k))) return "편의점";

    // 쇼핑
    if (["쿠팡", "올리브영", "무신사", "지그재그", "마켓컬리", "SSG", "11번가", "G마켓", "옥션"].some((k) => d.includes(k))) return "쇼핑";

    // 교통
    if (["교통", "버스", "지하철", "택시", "카카오택시", "우버", "티머니", "기차", "KTX", "SRT"].some((k) => d.includes(k))) return "교통";

    // 구독
    if (["넷플릭스", "유튜브", "스포티파이", "왓챠", "웨이브", "애플", "구글", "네이버플러스"].some((k) => d.includes(k))) return "구독";

    // 의료
    if (["병원", "약국", "의원", "클리닉", "치과", "한의원"].some((k) => d.includes(k))) return "의료";

    // 투자
    if (["증권", "투자", "펀드", "ETF", "주식"].some((k) => d.includes(k))) return "투자";

    // 이체
    if (["네이버페이", "카카오페이", "토스", "페이코", "이체", "FB", "타행", "모바일", "CD송금"].some((k) => d.includes(k))) return "이체";

    return "이체";
  };

  // 신한은행 텍스트 파싱 함수
  const parseShinhanCSV = (csvText) => {
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");
    const dataLines = lines.slice(1);

    let latestBalance = 0;  // 가장 최근 잔액 저장용

    const parsed = dataLines.map((line, index) => {
      const cols = line.trim().split(/\s+/);

      const date = cols[0] || "";
      const outAmt = parseInt(cols[3]?.replace(/,/g, "") || "0");
      const inAmt = parseInt(cols[4]?.replace(/,/g, "") || "0");

      // 잔액 컬럼 (뒤에서 두 번째)
      const balanceIndex = cols.length - 2;
      const balance = parseInt(cols[balanceIndex]?.replace(/,/g, "") || "0");
      const memo = cols.slice(5, balanceIndex).join(" ");
      const amount = inAmt > 0 ? inAmt : -outAmt;

      // 첫 번째 행(가장 최근)의 잔액을 현재 잔액으로 사용
      if (index === 0) latestBalance = balance;

      const formattedDate = date.length === 8
        ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
        : date;

      return {
        id: `real-${index}`,
        date: formattedDate,
        description: memo,
        category: categorize(memo, amount),
        amount,
        type: inAmt > 0 ? "입금" : "출금",
        account: "신한은행",
        balance,
      };
    }).filter((t) => t.amount !== 0);

    return { transactions: parsed, balance: latestBalance };
  };

  // 카카오뱅크 파싱 함수
  const parseKakaoBankCSV = (csvText) => {
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");

    // 첫 번째 행은 헤더이므로 제외
    const dataLines = lines.slice(1);

    let latestBalance = 0;

    const parsed = dataLines.map((line, index) => {
      const cols = line.trim().split(/\s+/);

      // 카카오뱅크 컬럼 순서:
      // 0: 거래일시, 1: 구분, 2: 거래금액, 3: 거래후잔액, 4~: 거래내용, 마지막: 거래구분
      const date = cols[0] || "";
      const amount = parseInt(cols[2]?.replace(/,/g, "") || "0");
      const balance = parseInt(cols[3]?.replace(/,/g, "") || "0");

      // 거래내용은 4번째부터 마지막 전까지
      const memo = cols.slice(4, cols.length - 1).join(" ");

      // 첫 번째 행 잔액을 현재 잔액으로 사용
      if (index === 0) latestBalance = balance;

      // 날짜 형식 변환 (20260425042121 → 2026-04-25)
      const formattedDate = date.length >= 8
        ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
        : date;

      return {
        id: `kakao-${index}`,
        date: formattedDate,
        description: memo,
        category: categorize(memo, amount),
        amount,
        type: amount > 0 ? "입금" : "출금",
        account: "카카오뱅크",
      };
    }).filter((t) => t.amount !== 0);

    return { transactions: parsed, balance: latestBalance };
  };

  // 토스뱅크 파싱 함수 (엑셀 → CSV 저장 형식)
  const parseTossBankCSV = (csvText) => {
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");

    // 첫 번째 행은 헤더이므로 제외
    const dataLines = lines.slice(1);

    let latestBalance = 0;

    const parsed = dataLines.map((line, index) => {
      const cols = line.split(",").map((col) => col.trim().replace(/₩/g, "").replace(/"/g, ""));

      // 토스뱅크 컬럼 순서:
      // 0: 거래일시, 1: 적요, 2: 거래유형, 3: 거래기관, 4: 계좌번호, 5: 거래금액, 6: 거래후잔액, 7: 메모
      const date = cols[0] || "";
      const amount = parseFloat(cols[5]?.replace(/,/g, "").replace(/\s/g, "") || "0");
      // 잔액은 cols[6] + cols[7] 합쳐야 함 (쉼표로 쪼개진 경우)
      const balanceRaw = cols[7] !== undefined && cols[7].match(/^\d+$/)
        ? cols[6] + cols[7]  // 쪼개진 경우 합치기
        : cols[6];
      const balance = parseInt(balanceRaw?.replace(/[^0-9]/g, "") || "0");
      const memo = (cols[7] || cols[1] || "").trim();

      if (index === 0) latestBalance = balance;

      // 날짜 형식 변환 (2026.04.01 05:34:05 → 2026-04-01)
      const formattedDate = date.slice(0, 10).replace(/\./g, "-");

      return {
        id: `toss-${index}`,
        date: formattedDate,
        description: memo || cols[1],
        category: categorize(memo || cols[1], amount),
        amount,
        type: amount > 0 ? "입금" : "출금",
        account: "토스뱅크",
      };
    }).filter((t) => t.amount !== 0);

    return { transactions: parsed, balance: latestBalance };
  };

  // 현대카드 파싱 함수 (엑셀 → CSV 저장 형식)
  const parseHyundaiCardCSV = (csvText) => {
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");

    // 첫 번째 행은 헤더이므로 제외
    const dataLines = lines.slice(1);

    const parsed = dataLines.map((line, index) => {
      // CSV 파싱 - 큰따옴표로 감싸진 필드 처리
      const cols = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          cols.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      cols.push(current.trim());

      // 현대카드 컬럼 순서:
      // 0: 승인일, 1: 승인시각, 2: 카드구분, 3: 카드종류, 4: 가맹점명
      // 5: 승인금액, 6: 이용구분, 7: 할부개월, 8: 승인번호, 9: 취소일, 10: 승인구분
      const dateRaw = cols[0] || "";
      const memo = cols[4] || "";
      const amount = parseInt(cols[5]?.replace(/,/g, "") || "0");
      const installment = parseInt(cols[7] || "1");  // 할부개월 (일시불이면 1)
      // 할부 건은 월 청구액으로 계산
      const monthlyAmount = installment > 1 ? Math.round(amount / installment) : amount;
      const status = cols[10] || "";

      // 취소 건은 제외
      if (status === "취소") return null;

      // 날짜 형식 변환 (2026년 04월 29일 → 2026-04-29)
      const formattedDate = dateRaw
        .replace("년 ", "-")
        .replace("월 ", "-")
        .replace("일", "")
        .trim();

      return {
        id: `hyundai-${index}`,
        date: formattedDate,
        description: memo,
        category: categorize(memo, -amount),  // 카드는 항상 지출
        amount: -monthlyAmount,
        type: "카드",
        account: "현대카드",
      };
    }).filter((t) => t !== null && t.amount !== 0);

    // 카드는 잔액 개념이 없으므로 balance 0 반환
    return { transactions: parsed, balance: 0 };
  };

  // 은행별 파서 선택
  const parseCSV = (csvText, bankType) => {
    switch (bankType) {
      case "shinhan": return parseShinhanCSV(csvText);
      case "kakao": return parseKakaoBankCSV(csvText);
      case "toss": return parseTossBankCSV(csvText);
      case "hyundai": return parseHyundaiCardCSV(csvText);
      default: return parseShinhanCSV(csvText);
    }
  };

  // CSV 파일 읽기
  const loadCSVFile = (file, bankType) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const result = parseCSV(text, bankType);
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsText(file, "UTF-8");
    });
  };

  // 거래내역 + 계좌 잔액 추가
  const addTransactions = (newTransactions, accountInfo) => {
    // 거래내역 합치기 (날짜 기준 내림차순 정렬)
    setRealTransactions((prev) => {
      const merged = [...prev, ...newTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return merged;
    });

    // 계좌 정보 추가 또는 업데이트
    if (accountInfo) {
      setRealAccounts((prev) => {
        // 같은 은행 계좌가 이미 있으면 잔액 업데이트, 없으면 추가
        const exists = prev.find((acc) => acc.bank === accountInfo.bank);
        if (exists) {
          return prev.map((acc) =>
            acc.bank === accountInfo.bank ? { ...acc, balance: accountInfo.balance } : acc
          );
        }
        return [...prev, accountInfo];
      });
    }

    setIsDemoMode(false);
  };

  // 투자 계좌 수동 추가
  const addInvestment = (investmentInfo) => {
    setRealAccounts((prev) => {
      const exists = prev.find((acc) => acc.id === investmentInfo.id);
      if (exists) {
        return prev.map((acc) =>
          acc.id === investmentInfo.id ? { ...acc, ...investmentInfo } : acc
        );
      }
      return [...prev, investmentInfo];
    });
    setIsDemoMode(false);
  };

  // 더미 데이터로 초기화
  const resetToDemo = () => {
    setRealTransactions([]);
    setRealAccounts([]);
    setIsDemoMode(true);
  };

  // 총 은행 잔액 계산
  const totalBankBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // 이번 달 수입 합계
  const thisMonthIncome = transactions
    .filter((t) => t.amount > 0 && t.category !== "이체")
    .reduce((sum, t) => sum + t.amount, 0);

  // 이번 달 지출 합계
  const thisMonthExpense = transactions
    .filter((t) => t.amount < 0 && t.category !== "투자" && t.category !== "이체")
    .reduce((sum, t) => sum + t.amount, 0);

  // 총 투자 자산 계산 (보유수량 × 현재가 합계)
  const totalInvestmentBalance = holdings.reduce(
    (sum, h) => sum + (prices[h.code] || 0) * h.qty, 0
  );

  // holdings 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("holdings", JSON.stringify(holdings));
  }, [holdings]);

  return (
    <DataContext.Provider value={{
      transactions,
      accounts,
      isDemoMode,
      loadCSVFile,
      addTransactions,
      resetToDemo,
      totalBankBalance,
      thisMonthIncome,
      thisMonthExpense,
      holdings,
      setHoldings,
      prices,
      setPrices,
      totalInvestmentBalance,
    }}>
      {children}
    </DataContext.Provider>
  );
}

// 다른 파일에서 useData()로 간편하게 데이터 가져올 수 있게 하는 훅
export const useData = () => useContext(DataContext);