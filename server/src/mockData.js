// =============================================
// server/src/mockData.js
// CODEF 데모 서비스(1개월 이용) 만료 이후,
// 포트폴리오 시연을 위한 Mock 응답 데이터
// 실제 CODEF API 응답 형식(result/data 구조)을 그대로 따릅니다.
// =============================================

const successResult = {
  code: "CF-00000",
  message: "성공하였습니다.",
  extraMessage: "",
};

// ── 계좌 목록 조회 Mock (getBankAccounts) ──────────────
// 실제 엔드포인트: /v1/kr/bank/p/account/account-list
const mockBankAccounts = {
  result: successResult,
  data: {
    resDepositTrust: [
      {
        resAccount: "110123456789",
        resAccountDisplay: "110-****-6789",
        resAccountName: "신한 주거래 통장",
        resAccountBalance: "1284300",
        resAccountStatus: "01",
      },
    ],
  },
};

// ── 거래내역 조회 Mock (getTransactions) ──────────────
// 실제 엔드포인트: /v1/kr/bank/p/account/transaction-list
const mockTransactions = {
  result: successResult,
  data: {
    resTrHistoryList: [
      {
        resAccountTrDate: "20260705",
        resAccountIn: "2400000",
        resAccountOut: "0",
        resAccountDesc2: "모바일",
        resAccountDesc3: "월급",
      },
      {
        resAccountTrDate: "20260703",
        resAccountIn: "0",
        resAccountOut: "285000",
        resAccountDesc2: "FB이체",
        resAccountDesc3: "현대카드",
      },
      {
        resAccountTrDate: "20260701",
        resAccountIn: "0",
        resAccountOut: "50000",
        resAccountDesc2: "타행IB",
        resAccountDesc3: "카카오페이",
      },
    ],
  },
};

// ── 카드 승인내역 조회 Mock (getCardTransactions) ──────────────
// 실제 엔드포인트: /v1/kr/card/p/account/approval-list
// (실제 응답은 data 자체가 배열)
const mockCardTransactions = {
  result: successResult,
  data: [
    {
      resUsedDate: "20260706",
      resUsedAmount: "6500",
      resInstallmentMonth: "1",
      resMemberStoreName: "스타벅스",
      resCancelYN: "0",
    },
    {
      resUsedDate: "20260704",
      resUsedAmount: "23200",
      resInstallmentMonth: "1",
      resMemberStoreName: "뉴월드식자재마트",
      resCancelYN: "0",
    },
    {
      resUsedDate: "20260702",
      resUsedAmount: "17700",
      resInstallmentMonth: "1",
      resMemberStoreName: "쿠팡이츠",
      resCancelYN: "0",
    },
  ],
};

module.exports = { mockBankAccounts, mockTransactions, mockCardTransactions };
