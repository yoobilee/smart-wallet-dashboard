// =============================================
// DataContext.jsx - 전역 데이터 상태 관리
// CSV로 업로드한 거래내역을 모든 페이지에서 공유
// =============================================

import { createContext, useContext, useState } from "react";
import { transactions as dummyTransactions } from "../data/dummyData";

// Context 생성 - 전역으로 데이터를 공유할 수 있는 그릇
const DataContext = createContext(null);

export function DataProvider({ children }) {
  // isDemoMode: true면 더미 데이터, false면 업로드한 실제 데이터 사용
  const [isDemoMode, setIsDemoMode] = useState(true);

  // 업로드된 실제 거래내역 저장
  const [realTransactions, setRealTransactions] = useState([]);

  // 현재 모드에 따라 사용할 거래내역 반환
  const transactions = isDemoMode ? dummyTransactions : realTransactions;

// 거래 내용으로 카테고리 자동 분류하는 함수
const categorize = (description, amount) => {
  const d = description;

  // 수입 (입금)
  if (amount > 0) {
    if (d.includes("급여") || d.includes("월급")) return "수입";
    if (d.includes("이자")) return "수입";
    return "이체"; // 입금은 기본적으로 이체
  }

  // 카페
  if (["스타벅스", "커피", "카페", "이디야", "빽다방", "메가커피", "투썸"].some((k) => d.includes(k))) return "카페";

  // 식비
  if (["식당", "맥도날드", "버거킹", "롯데리아", "KFC", "맘스터치", "배달", "요기요", "배민", "쿠팡이츠", "김밥", "편의점식"].some((k) => d.includes(k))) return "식비";

  // 편의점
  if (["GS25", "CU", "세븐일레븐", "이마트24", "미니스톱"].some((k) => d.includes(k))) return "편의점";

  // 쇼핑
  if (["쿠팡", "올리브영", "무신사", "지그재그", "마켓컬리", "SSG", "11번가", "G마켓", "옥션", "위메프", "티몬"].some((k) => d.includes(k))) return "쇼핑";

  // 교통
  if (["교통", "버스", "지하철", "택시", "카카오택시", "우버", "티머니", "기차", "KTX", "SRT"].some((k) => d.includes(k))) return "교통";

  // 구독
  if (["넷플릭스", "유튜브", "스포티파이", "왓챠", "웨이브", "애플", "구글", "네이버플러스"].some((k) => d.includes(k))) return "구독";

  // 의료
  if (["병원", "약국", "의원", "클리닉", "치과", "한의원"].some((k) => d.includes(k))) return "의료";

  // 투자
  if (["증권", "투자", "펀드", "ETF", "주식"].some((k) => d.includes(k))) return "투자";

  // 네이버페이/카카오페이 이체
  if (["네이버페이", "카카오페이", "토스", "페이코"].some((k) => d.includes(k))) return "이체";

  // FB이체, 타행이체 등 이체 키워드
  if (["이체", "FB", "타행", "모바일", "CD송금"].some((k) => d.includes(k))) return "이체";

  // 기본값
  return "이체";
};

// 신한은행 텍스트 파싱 함수 (PDF 복붙 → 메모장 저장 형식)
const parseShinhanCSV = (csvText) => {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");

  // 첫 번째 행은 헤더이므로 제외
  const dataLines = lines.slice(1);

  const parsed = dataLines.map((line, index) => {
    // 공백으로 분리
    const cols = line.trim().split(/\s+/);

    // 날짜(0), 시간(1), 적요(2), 출금(3), 입금(4) 는 고정
    // 잔액은 뒤에서 두 번째, 거래점은 마지막
    // 내용은 그 사이 나머지
    const date   = cols[0] || "";
    const outAmt = parseInt(cols[3]?.replace(/,/g, "") || "0");
    const inAmt  = parseInt(cols[4]?.replace(/,/g, "") || "0");

    // 잔액은 뒤에서 두 번째 (숫자+쉼표 형식)
    // 내용은 5번째부터 잔액 전까지
    const balanceIndex = cols.length - 2;
    const memo = cols.slice(5, balanceIndex).join(" ");

    const amount = inAmt > 0 ? inAmt : -outAmt;

    // 날짜 형식 변환 (20260428 → 2026-04-28)
    const formattedDate = date.length === 8
      ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
      : date;

    return {
      id: `real-${index}`,
      date: formattedDate,
      description: memo,
      // categorize 함수로 자동 분류
      category: categorize(memo, amount),
      amount,
      type: inAmt > 0 ? "입금" : "출금",
      account: "신한은행",
    };
  }).filter((t) => t.amount !== 0);

  return parsed;
};

  // CSV 파일을 읽어서 파싱하는 함수
  const loadCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // 신한은행 CSV는 EUC-KR 인코딩일 수 있어서 텍스트 디코딩
        const text = e.target.result;
        const parsed = parseShinhanCSV(text);
        resolve(parsed);
      };
      reader.onerror = reject;
      reader.readAsText(file, "UTF-8");  // 신한은행 CSV 인코딩
    });
  };

  // 여러 파일을 한꺼번에 업로드할 때 기존 데이터에 합치는 함수
  const addTransactions = (newTransactions) => {
    setRealTransactions((prev) => {
      // 날짜 기준 내림차순 정렬
      const merged = [...prev, ...newTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return merged;
    });
    setIsDemoMode(false);  // 실제 데이터 모드로 전환
  };

  // 더미 데이터로 초기화
  const resetToDemo = () => {
    setRealTransactions([]);
    setIsDemoMode(true);
  };

  return (
    <DataContext.Provider value={{
      transactions,
      isDemoMode,
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