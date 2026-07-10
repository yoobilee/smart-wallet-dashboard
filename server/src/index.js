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
  origin: ["http://localhost:5173", "https://smart-wallet-dashboard-omega.vercel.app"],
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
    console.error("/api/accounts 에러:", err.message || err);
    res.status(500).json({ error: err.message || JSON.stringify(err) });
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

// ── Yahoo Finance 시세/환율 프록시 ──────────────
// 브라우저에서 직접 Yahoo Finance를 호출하면 CORS로 막히기 때문에
// (예전엔 allorigins.win 같은 외부 프록시를 썼으나 해당 서비스가 불안정해짐)
// 서버가 대신 호출해서 그대로 전달해준다. 서버-서버 통신은 CORS 제약이 없음.
app.get("/api/yahoo", async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ error: "symbol 쿼리 파라미터가 필요합니다." });
    }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`;
    const yahooRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!yahooRes.ok) {
      return res.status(yahooRes.status).json({ error: `Yahoo Finance 응답 오류: ${yahooRes.status}` });
    }

    const data = await yahooRes.json();
    res.json(data);
  } catch (err) {
    console.error("/api/yahoo 에러:", err.message || err);
    res.status(500).json({ error: err.message });
  }
});

// ── 서버 시작 ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});