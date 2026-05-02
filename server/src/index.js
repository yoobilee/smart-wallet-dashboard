// =============================================
// server/src/index.js - 백엔드 서버 메인 파일
// Express 서버 설정 및 라우터 연결
// =============================================

const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const { getBankAccounts, getTransactions } = require("./codef");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── 미들웨어 설정 ──────────────────────────
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
}));

// ── 라우터 ────────────────────────────────
// 서버 상태 확인
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Smart Wallet Server 정상 동작 중" });
});

// 계좌 목록 조회
app.post("/api/accounts", async (req, res) => {
  try {
    const { connectedId, organization } = req.body;
    const result = await getBankAccounts(connectedId, organization);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 거래내역 조회
app.post("/api/transactions", async (req, res) => {
  try {
    const { connectedId, organization, account, startDate, endDate } = req.body;
    const result = await getTransactions(connectedId, organization, account, startDate, endDate);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 서버 시작 ─────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});