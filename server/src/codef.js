// =============================================
// server/src/codef.js - CODEF API 연동 모듈
// 계좌 조회, 거래내역 조회 등
// =============================================

const { EasyCodef, EasyCodefConstant } = require("easycodef-node");

// codef 인스턴스 생성 및 설정
const codef = new EasyCodef();
codef.setPublicKey(process.env.CODEF_PUBLIC_KEY);
codef.setClientInfoForDemo(
  process.env.CODEF_CLIENT_ID,
  process.env.CODEF_CLIENT_SECRET
);

const SERVICE_TYPE = EasyCodefConstant.SERVICE_TYPE_SANDBOX;

// ── 계좌 목록 조회 ──────────────────────────
const getBankAccounts = async (connectedId, organization) => {
  const parameter = {
    connectedId,
    organization,
  };

  const result = await codef.requestProduct(
    "/v1/kr/bank/p/account/account-list",
    SERVICE_TYPE,
    parameter
  );

  return result;
};

// ── 거래내역 조회 ──────────────────────────
const getTransactions = async (connectedId, organization, account, startDate, endDate) => {
  const parameter = {
    connectedId,
    organization,
    account,
    startDate,  // YYYYMMDD
    endDate,    // YYYYMMDD
  };

  const result = await codef.requestProduct(
    "/v1/kr/bank/p/account/transaction-list",
    SERVICE_TYPE,
    parameter
  );

  return result;
};

module.exports = { getBankAccounts, getTransactions };