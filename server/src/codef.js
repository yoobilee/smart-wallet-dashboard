// =============================================
// server/src/codef.js - CODEF API 연동 모듈
// 계좌 조회, 거래내역 조회 등
// =============================================

const { EasyCodef, EasyCodefConstant, EasyCodefUtil } = require("easycodef-node");
const { mockBankAccounts, mockTransactions, mockCardTransactions } = require("./mockData");

// codef 인스턴스 생성 및 설정
const codef = new EasyCodef();
codef.setPublicKey(process.env.CODEF_PUBLIC_KEY);
codef.setClientInfoForDemo(
  process.env.CODEF_DEMO_CLIENT_ID,
  process.env.CODEF_DEMO_CLIENT_SECRET
);

// CODEF 데모 서비스는 최초 1회, 1개월만 이용 가능해 만료됨.
// 재계약(정식 전환) 전까지는 USE_MOCK_CODEF=true로 두고 Mock 응답을 사용.
// 재계약 시 환경변수만 false로 바꾸면 아래 실제 연동 로직이 그대로 살아남.
const USE_MOCK = process.env.USE_MOCK_CODEF === "true";
const SERVICE_TYPE = EasyCodefConstant.SERVICE_TYPE_DEMO;

// ── 계좌 목록 조회 ──────────────────────────
const getBankAccounts = async (connectedId, organization) => {
  if (USE_MOCK) return mockBankAccounts;

  const parameter = { connectedId, organization };

  const result = await codef.requestProduct(
    "/v1/kr/bank/p/account/account-list",
    SERVICE_TYPE,
    parameter
  );

  return result;
};

// ── 거래내역 조회 ──────────────────────────
const getTransactions = async (connectedId, organization, account, startDate, endDate) => {
  if (USE_MOCK) return mockTransactions;

  const parameter = {
    connectedId,
    organization,
    account,
    startDate,
    endDate,
    orderBy: "0",  // 0: 최신순
    inquiryType: "0",  // 0: 전체
    countPerPage: "100",
  };

  const result = await codef.requestProduct(
    "/v1/kr/bank/p/account/transaction-list",
    SERVICE_TYPE,
    parameter
  );

  return result;
};

// ── 계정 등록 (connectedId 발급) ──────────────
// 새 계좌 연동 시 사용
const createAccount = async (organization, id, password) => {
  const accountList = [{
    countryCode: "KR",
    businessType: "BK",
    clientType: "P",
    organization,
    loginType: "1",
    id,
    password: EasyCodefUtil.encryptRSA(process.env.CODEF_PUBLIC_KEY, password),
  }];

  const result = await codef.createAccount(
    EasyCodefConstant.SERVICE_TYPE_DEMO,
    { accountList }
  );

  return result;
};

const createCardAccount = async (organization, id, password, cardNo, cardPassword) => {
  const accountList = [{
    countryCode: "KR",
    businessType: "CD",
    clientType: "P",
    organization,
    loginType: "1",
    id,
    password: EasyCodefUtil.encryptRSA(process.env.CODEF_PUBLIC_KEY, password),
    cardNo,
    cardPassword: EasyCodefUtil.encryptRSA(process.env.CODEF_PUBLIC_KEY, cardPassword),
  }];

  const result = await codef.createAccount(
    EasyCodefConstant.SERVICE_TYPE_DEMO,
    { accountList }
  );
  return result;
};

// ── 카드 승인내역 조회 ──────────────────────────
const getCardTransactions = async (connectedId, organization, startDate, endDate, cardNo, cardPassword) => {
  if (USE_MOCK) return mockCardTransactions;

  const parameter = {
    connectedId,
    organization,
    startDate,
    endDate,
    orderBy:      "0",
    inquiryType:  "1",
    ...(cardNo       && { cardNo }),
    ...(cardPassword && { cardPassword: EasyCodefUtil.encryptRSA(process.env.CODEF_PUBLIC_KEY, cardPassword) }),
  };

  const result = await codef.requestProduct(
    "/v1/kr/card/p/account/approval-list",
    SERVICE_TYPE,
    parameter
  );

  return result;
};

module.exports = { getBankAccounts, getTransactions, createAccount, createCardAccount, getCardTransactions };