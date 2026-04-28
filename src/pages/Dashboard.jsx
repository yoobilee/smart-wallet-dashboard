// =============================================
// Dashboard 페이지 - 메인 화면
// 자산 현황, 수입/지출 요약, 최근 거래 내역, 도넛 차트
// =============================================

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  totalAssets,
  availableBalance,
  totalInvestmentBalance,
  thisMonthIncome,
  thisMonthExpense,
  totalCardSpending,
  transactions,
} from "../data/dummyData";

// 숫자를 한국 원화 형식으로 변환
const formatKRW = (amount) => {
  return Math.abs(amount).toLocaleString("ko-KR") + "원";
};

// 카테고리별 색상
const categoryColor = {
  카페:   "bg-amber-100 text-amber-600",
  쇼핑:   "bg-pink-100 text-pink-600",
  편의점: "bg-orange-100 text-orange-600",
  투자:   "bg-lime-100 text-lime-600",
  구독:   "bg-purple-100 text-purple-600",
  식비:   "bg-green-100 text-green-600",
  교통:   "bg-cyan-100 text-cyan-600",
  수입:   "bg-lime-100 text-lime-700",
};

// 도넛 차트 색상 팔레트
const CHART_COLORS = ["#a3e635", "#f472b6", "#fb923c", "#22d3ee", "#a78bfa", "#4ade80", "#fbbf24"];

// 카테고리별 지출 합계 계산 (수입/투자 제외)
const categoryData = Object.entries(
  transactions
    .filter((t) => t.amount < 0 && t.category !== "투자")
    .reduce((acc, t) => {
      // 카테고리별로 금액 합산
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {})
).map(([name, value]) => ({ name, value }));

function Dashboard() {
  const recentTransactions = transactions.slice(0, 5);
  const investmentRatio = (totalInvestmentBalance / totalAssets) * 100;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* ── 상단 타이틀 ── */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-400 mt-1">2026년 4월 기준</p>
      </div>

      {/* ── 총 자산 카드 ── */}
      <div className="bg-gray-950 text-white rounded-2xl p-6 space-y-5">
        <div>
          <p className="text-sm text-gray-400">총 자산</p>
          <p className="text-5xl font-bold mt-2 tracking-tight">{formatKRW(totalAssets)}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>가용 자산</span>
            <span>투자 자산</span>
          </div>
          <div className="flex rounded-full overflow-hidden h-1.5 bg-gray-800">
            <div className="bg-lime-400 transition-all duration-500" style={{ width: `${100 - investmentRatio}%` }} />
            <div className="bg-lime-200" style={{ width: `${investmentRatio}%` }} />
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="text-lime-400 font-semibold">{formatKRW(availableBalance)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lime-200 font-semibold">{formatKRW(totalInvestmentBalance)}</span>
              <span className="w-2 h-2 rounded-full bg-lime-200" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 이번 달 요약 + 도넛 차트 ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* 왼쪽 - 수입/지출/카드 요약 */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">이번 달 수입</p>
            <p className="text-xl font-bold text-lime-600 mt-1">+{formatKRW(thisMonthIncome)}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">이번 달 지출</p>
            <p className="text-xl font-bold text-rose-500 mt-1">-{formatKRW(thisMonthExpense)}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">카드 청구 예정</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{formatKRW(totalCardSpending)}</p>
          </div>
        </div>

        {/* 오른쪽 - 도넛 차트 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">지출 카테고리</h2>

          {/* recharts 도넛 차트 */}
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}  // 안쪽 반지름 (도넛 구멍)
                outerRadius={70}  // 바깥 반지름
                dataKey="value"
                paddingAngle={3}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatKRW(value), "지출"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* 범례 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                <span className="text-xs text-gray-500 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── 최근 거래 내역 ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">최근 거래</h2>
        <div className="space-y-1">
          {recentTransactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-default"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColor[t.category] || "bg-gray-100 text-gray-600"}`}>
                  {t.category}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-400">{t.date}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${t.amount > 0 ? "text-lime-600" : "text-gray-800"}`}>
                {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("ko-KR")}원
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;