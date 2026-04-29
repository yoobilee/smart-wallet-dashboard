// =============================================
// DataContext.jsx - 전역 데이터 상태 관리
// CSV로 업로드한 거래내역 + 계좌 잔액을 모든 페이지에서 공유
// =============================================

import { createContext, useContext, useState } from "react";
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

  // 현재 모드에 따라 사용할 데이터 반환
  const transactions = isDemoMode ? dummyTransactions : realTransactions;
  const accounts = isDemoMode ? dummyAccounts : realAccounts;

  // 거래 내용으로 카테고리 자동 분류하는 함수
  const categorize = (description, amount) => {
    const d = description;

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

  // 카카오뱅크 파싱 함수 (추후 구현)
  const parseKakaoBankCSV = (csvText) => {
    // TODO: 카카오뱅크 CSV 형식에 맞게 구현 예정
    return { transactions: [], balance: 0 };
  };

  // 토스뱅크 파싱 함수 (추후 구현)
  const parseTossBankCSV = (csvText) => {
    // TODO: 토스뱅크 CSV 형식에 맞게 구현 예정
    return { transactions: [], balance: 0 };
  };

  // 은행별 파서 선택
  const parseCSV = (csvText, bankType) => {
    switch (bankType) {
      case "shinhan": return parseShinhanCSV(csvText);
      case "kakao": return parseKakaoBankCSV(csvText);
      case "toss": return parseTossBankCSV(csvText);
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

  return (
    <DataContext.Provider value={{
      transactions,
      accounts,
      isDemoMode,
      totalBankBalance,
      thisMonthIncome,
      thisMonthExpense,
      loadCSVFile,
      addTransactions,
      resetToDemo,
    }}>
      {children}
    </DataContext.Provider>
  );
}

// 다른 파일에서 useData()로 간편하게 데이터 가져올 수 있게 하는 훅
export const useData = () => useContext(DataContext);