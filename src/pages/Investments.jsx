// =============================================
// Investments 페이지 - 보유 주식 현황
// Yahoo Finance API로 실시간 시세 조회
// 종목코드 + 보유수량 입력하면 평가금액 자동 계산
// =============================================

import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";

// 초기 보유 종목 (캡쳐에서 확인한 데이터)
const initialHoldings = [
  // CMA 계좌
  { id: 1, account: "NH CMA", name: "TIGER 단기채권액티브", code: "272580", qty: 48, avgPrice: 56200 },
  { id: 2, account: "NH CMA", name: "우리금융지주", code: "316140", qty: 2, avgPrice: 25957 },
  // ISA 계좌
  { id: 3, account: "NH ISA", name: "KODEX 26-12 금융채", code: "0117L0", qty: 560, avgPrice: 10020 },
  { id: 4, account: "NH ISA", name: "KODEX 200", code: "069500", qty: 5, avgPrice: 88490 },
  { id: 5, account: "NH ISA", name: "TIGER 미국나스닥100", code: "133690", qty: 3, avgPrice: 166228 },
  { id: 6, account: "NH ISA", name: "메리츠금융지주", code: "138040", qty: 3, avgPrice: 112800 },
  { id: 7, account: "NH ISA", name: "펄어비스", code: "263750", qty: 2, avgPrice: 69200 },
  { id: 8, account: "NH ISA", name: "TIGER 미국S&P500", code: "360750", qty: 16, avgPrice: 25151 },
  { id: 9, account: "NH ISA", name: "TIGER 미국배당다우존스", code: "458730", qty: 73, avgPrice: 14440 },
  { id: 10, account: "NH ISA", name: "KODEX CD금리액티브", code: "459580", qty: 1, avgPrice: 1074862 },
];

// 숫자를 원화 형식으로 변환
const formatKRW = (amount) => Math.abs(amount).toLocaleString("ko-KR") + "원";

function Investments() {
  const { holdings, setHoldings, prices, setPrices } = useData();

  // holdings가 비어있으면 초기 데이터로 설정
  useEffect(() => {
    if (holdings.length === 0) {
      setHoldings(initialHoldings);
    }
  }, []);   // 종목코드 → 현재가
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [editMode, setEditMode] = useState(false);  // 종목 편집 모드

  // Yahoo Finance API로 현재가 조회 (CORS 프록시 사용)
  const fetchPrice = async (code) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${code}.KS`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      return price || null;
    } catch {
      return null;
    }
  };

  // 모든 종목 시세 조회
  const fetchAllPrices = async () => {
    setLoading(true);
    const newPrices = {};

    for (const h of holdings) {
      const price = await fetchPrice(h.code);
      if (price) newPrices[h.code] = price;
    }

    setPrices(newPrices);
    setLastUpdated(new Date().toLocaleTimeString("ko-KR"));
    setLoading(false);
  };

  // 페이지 로드 시 자동으로 시세 조회
  useEffect(() => {
    fetchAllPrices();
  }, []);

  // 계좌별 그룹화
  const accounts = [...new Set(holdings.map((h) => h.account))];

  // 계좌별 총 평가금액
  const accountTotal = (accountName) =>
    holdings
      .filter((h) => h.account === accountName)
      .reduce((sum, h) => sum + (prices[h.code] || 0) * h.qty, 0);

  // 전체 투자 총액
  const totalInvestment = holdings.reduce(
    (sum, h) => sum + (prices[h.code] || 0) * h.qty, 0
  );

  // 수량 변경
  const handleQtyChange = (id, value) => {
    setHoldings((prev) =>
      prev.map((h) => h.id === id ? { ...h, qty: parseInt(value) || 0 } : h)
    );
  };

  // 종목 추가
  const addHolding = () => {
    setHoldings((prev) => [
      ...prev,
      { id: Date.now(), account: "NH ISA", name: "", code: "", qty: 0, avgPrice: 0 }
    ]);
  };

  // 종목 삭제
  const removeHolding = (id) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* 상단 타이틀 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Investments</h1>
          <p className="text-sm text-gray-400 mt-1">
            {lastUpdated ? `마지막 업데이트: ${lastUpdated}` : "시세 불러오는 중..."}
          </p>
        </div>

        {/* 새로고침 버튼 */}
        <button
          onClick={fetchAllPrices}
          disabled={loading}
          className="text-xs font-medium px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 transition-colors disabled:opacity-50"
        >
          {loading ? "조회 중..." : "시세 갱신"}
        </button>
      </div>

      {/* 총 투자 자산 카드 */}
      <div className="bg-gray-950 text-white rounded-2xl p-6 dark:bg-gray-900 dark:border dark:border-gray-800 space-y-3">
        <div>
          <p className="text-sm text-gray-400">총 투자 자산</p>
          <p className="text-5xl font-bold mt-2 tracking-tight">
            {totalInvestment > 0 ? formatKRW(totalInvestment) : "조회 중..."}
          </p>
        </div>

        {/* 총 수익 계산 */}
        {Object.keys(prices).length > 0 && (() => {
          const totalCost = holdings.reduce((sum, h) => sum + h.avgPrice * h.qty, 0);
          const totalProfit = totalInvestment - totalCost;
          const totalRate = totalCost > 0 ? (totalProfit / totalCost * 100).toFixed(2) : 0;
          const isProfit = totalProfit >= 0;
          return (
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-gray-400">총 수익</p>
                <p className={`text-lg font-semibold ${isProfit ? "text-rose-400" : "text-blue-400"}`}>
                  {isProfit ? "+" : ""}{totalProfit.toLocaleString("ko-KR")}원
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">수익률</p>
                <p className={`text-lg font-semibold ${isProfit ? "text-rose-400" : "text-blue-400"}`}>
                  {isProfit ? "+" : ""}{totalRate}%
                </p>
              </div>
            </div>
          );
        })()}

        <p className="text-xs text-gray-500">Yahoo Finance 실시간 시세 기준</p>
      </div>

      {/* 계좌별 보유 종목 */}
      {accounts.map((accountName) => (
        <div key={accountName} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">

          {/* 계좌명 + 평가금액 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{accountName}</h2>
            <div className="text-right">
              <p className="text-sm font-bold text-lime-600">
                {accountTotal(accountName) > 0 ? formatKRW(accountTotal(accountName)) : "-"}
              </p>
              {/* 계좌별 수익률 */}
              {Object.keys(prices).length > 0 && (() => {
                const cost = holdings
                  .filter((h) => h.account === accountName)
                  .reduce((sum, h) => sum + h.avgPrice * h.qty, 0);
                const profit = accountTotal(accountName) - cost;
                const rate = cost > 0 ? (profit / cost * 100).toFixed(2) : 0;
                const isProfit = profit >= 0;
                return (
                  <p className={`text-xs font-medium mt-0.5 ${isProfit ? "text-rose-500" : "text-blue-500"}`}>
                    {isProfit ? "+" : ""}{rate}% · {isProfit ? "+" : ""}{profit.toLocaleString("ko-KR")}원
                  </p>
                );
              })()}
            </div>
          </div>

          {/* 종목 리스트 */}
          <div className="space-y-1">
            {holdings
              .filter((h) => h.account === accountName)
              .map((h) => {
                const currentPrice = prices[h.code];
                const evalAmount = currentPrice ? currentPrice * h.qty : null;

                // 후
                return (
                  <div key={h.id} className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">

                    {/* 왼쪽 - 종목명 + 코드/수량 */}
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{h.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{h.code} · {h.qty}주</p>
                    </div>

                    {/* 오른쪽 - 평가금액 + 수익률 */}
                    <div className="text-right">
                      {/* 평가금액 */}
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {evalAmount ? formatKRW(evalAmount) : "조회 중..."}
                      </p>

                      {/* 수익률 + 수익금액 */}
                      {currentPrice && (() => {
                        const profitRate = ((currentPrice - h.avgPrice) / h.avgPrice * 100).toFixed(2);
                        const profitAmt = (currentPrice - h.avgPrice) * h.qty;
                        const isProfit = profitAmt >= 0;
                        return (
                          <p className={`text-xs font-medium mt-0.5 ${isProfit ? "text-rose-500" : "text-blue-500"}`}>
                            {isProfit ? "+" : ""}{profitRate}% · {isProfit ? "+" : ""}{profitAmt.toLocaleString("ko-KR")}원
                          </p>
                        );
                      })()}
                    </div>

                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* 편집 모드 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          {editMode ? "편집 완료" : "종목 편집"}
        </button>
        {editMode && (
          <button
            onClick={addHolding}
            className="text-xs text-lime-600 hover:text-lime-500 transition-colors"
          >
            + 종목 추가
          </button>
        )}
      </div>

      {/* 편집 모드 - 종목 수량 변경 */}
      {editMode && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">종목 편집</p>
          {holdings.map((h) => (
            // 후
            <div key={h.id} className="flex items-center gap-2 flex-wrap">
              {/* 계좌 선택 */}
              <select
                value={h.account}
                onChange={(e) => setHoldings((prev) => prev.map((item) => item.id === h.id ? { ...item, account: e.target.value } : item))}
                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none"
              >
                <option value="NH CMA">NH CMA</option>
                <option value="NH ISA">NH ISA</option>
              </select>
              {/* 종목명 */}
              <input
                type="text"
                placeholder="종목명"
                value={h.name}
                onChange={(e) => setHoldings((prev) => prev.map((item) => item.id === h.id ? { ...item, name: e.target.value } : item))}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none"
              />
              {/* 종목코드 */}
              <input
                type="text"
                placeholder="종목코드"
                value={h.code}
                onChange={(e) => setHoldings((prev) => prev.map((item) => item.id === h.id ? { ...item, code: e.target.value } : item))}
                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none"
              />
              {/* 수량 */}
              <input
                type="number"
                placeholder="수량"
                value={h.qty}
                onChange={(e) => handleQtyChange(h.id, e.target.value)}
                className="w-16 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none"
              />
              {/* 매입가 */}
              <input
                type="number"
                placeholder="매입가"
                value={h.avgPrice}
                onChange={(e) => setHoldings((prev) => prev.map((item) => item.id === h.id ? { ...item, avgPrice: parseInt(e.target.value) || 0 } : item))}
                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none"
              />
              {/* 삭제 */}
              <button
                onClick={() => removeHolding(h.id)}
                className="text-xs text-rose-400 hover:text-rose-600 transition-colors"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Investments;