// =============================================
// server/src/index.js - 백엔드 서버 메인 파일
// =============================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { getBankAccounts, getTransactions, createAccount, createCardAccount, getCardTransactions } = require("./codef");

const app = express();
const PORT = process.env.PORT || 3000;

// ── 미들웨어 ──────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
}));

// ── 라우터 ────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Smart Wallet Server 정상 동작 중" });
});

app.post("/api/create-account", async (req, res) => {
  try {
    const { organization, id, password } = req.body;
    const result = await createAccount(organization, id, password);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/accounts", async (req, res) => {
  try {
    const { connectedId, organization } = req.body;
    const result = await getBankAccounts(connectedId, organization);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { connectedId, organization, account, startDate, endDate } = req.body;
    const result = await getTransactions(connectedId, organization, account, startDate, endDate);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 카드사 계정 등록
app.post("/api/create-card-account", async (req, res) => {
  try {
    const { organization, id, password, cardNo, cardPassword } = req.body;
    const result = await createCardAccount(organization, id, password, cardNo, cardPassword);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/card-transactions", async (req, res) => {
  try {
    const { connectedId, organization, startDate, endDate, cardNo, cardPassword } = req.body;
const result = await getCardTransactions(connectedId, organization, startDate, endDate, cardNo, cardPassword);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 서버 시작 ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});