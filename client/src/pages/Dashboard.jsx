// =============================================
// Dashboard 페이지 - 메인 화면
// 자산 현황, 수입/지출 요약, 최근 거래 내역, 도넛 차트
// =============================================

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  totalCardSpending as dummyCardSpending,
} from "../data/dummyData";
import { useData } from "../context/DataContext";

const formatKRW = (amount) => Math.abs(amount).toLocaleString("ko-KR") + "원";

const categoryColor = {
  카페: "bg-amber-100 text-amber-600",
  쇼핑: "bg-pink-100 text-pink-600",
  편의점: "bg-orange-100 text-orange-600",
  투자: "bg-lime-100 text-lime-600",
  구독: "bg-purple-100 text-purple-600",
  식비: "bg-green-100 text-green-600",
  교통: "bg-cyan-100 text-cyan-600",
  수입: "bg-lime-100 text-lime-700",
  이체: "bg-gray-100 text-gray-500",
  의료: "bg-red-100 text-red-500",
  기타: "bg-gray-100 text-gray-500",
  생활: "bg-teal-100 text-teal-600",
  지출이체: "bg-orange-100 text-orange-600",
};

const bankFavicons = {
  신한은행: "https://www.google.com/s2/favicons?domain=bank.shinhan.com&sz=32",
  카카오뱅크: "https://www.google.com/s2/favicons?domain=kakaobank.com&sz=32",
  토스뱅크: "https://www.google.com/s2/favicons?domain=tossbank.com&sz=32",
  현대카드: "https://www.google.com/s2/favicons?domain=hyundaicard.com&sz=32",
  NH투자증권: "https://www.google.com/s2/favicons?domain=nhqv.com&sz=32",
  카카오페이: "https://www.google.com/s2/favicons?domain=kakaopay.com&sz=32",
  우리은행: "https://www.google.com/s2/favicons?domain=wooribank.com&sz=32",
};

const CHART_COLORS = ["#a3e635", "#f472b6", "#fb923c", "#22d3ee", "#a78bfa", "#4ade80", "#fbbf24", "#94a3b8", "#f87171"];

function Dashboard() {
  const { transactions, totalBankBalance, thisMonthIncome, thisMonthExpense, isDemoMode, totalInvestmentBalance, monthlyGoal } = useData();

  // 현재 날짜 기반으로 날짜 표시
  const now = new Date();
  const currentMonthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월 기준`;

  // 이번 달 범위
  const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const lastDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, "0")}`;

  // 카드 청구 예정액 (현대카드 - 이번 달 1일~말일 사용액, 매월 5일 청구)
  const totalCardSpending = isDemoMode
    ? dummyCardSpending
    : transactions
      .filter((t) => t.account === "현대카드" && t.amount < 0 && t.date >= firstDay && t.date <= lastDay)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalAssets = totalBankBalance + totalInvestmentBalance;
  const availableBalance = totalBankBalance;
  const investmentRatio = totalAssets > 0 ? (totalInvestmentBalance / totalAssets) * 100 : 0;

  // 도넛 차트 데이터 (지출 카테고리별)
  const categoryData = Object.entries(
    transactions
      .filter((t) => t.amount < 0 && t.category !== "투자" && t.category !== "이체")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* 상단 타이틀 */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview</h1>
        <p className="text-sm text-gray-400 mt-1">{currentMonthLabel}</p>
      </div>

      {/* 총 자산 카드 */}
      <div className="bg-gray-950 text-white rounded-2xl p-6 space-y-5 dark:bg-gray-900 dark:border dark:border-gray-800">
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

      {/* 요약 + 차트 */}
      <div className="grid grid-cols-2 gap-4">

        {/* 왼쪽 - 수입/지출/카드 요약 */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">이번 달 수입</p>
            <p className="text-xl font-bold text-lime-600 mt-1">+{formatKRW(thisMonthIncome)}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">이번 달 지출</p>
            <p className="text-xl font-bold text-rose-500 mt-1">-{formatKRW(thisMonthExpense)}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">현대카드 청구 예정 <span className="text-gray-300">· 매월 5일</span></p>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{formatKRW(totalCardSpending)}</p>
          </div>
        </div>

        {/* 오른쪽 - 도넛 차트 */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">지출 카테고리</h2>

          <div className="flex items-center gap-4 flex-1">
            {/* 차트 */}
            <div className="w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    dataKey="value"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [formatKRW(value), props.payload.name]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #1f2937", backgroundColor: "#111827", color: "#fff", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 범례 */}
            <div className="flex flex-col gap-1.5 flex-1">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{entry.name}</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{formatKRW(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 이번 달 지출 목표 게이지 */}
      {monthlyGoal > 0 && (() => {
        const spent = Math.abs(thisMonthExpense);
        const ratio = Math.min((spent / monthlyGoal) * 100, 100);
        const overRatio = spent > monthlyGoal ? ((spent - monthlyGoal) / monthlyGoal) * 100 : 0;
        const isOver = spent > monthlyGoal;

        const categorySpending = Object.entries(
          transactions
            .filter((t) => t.amount < 0 && t.category !== "이체")
            .reduce((acc, t) => {
              acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
              return acc;
            }, {})
        )
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }));

        return (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">이번 달 지출 목표</h2>
              <p className={`text-xs font-medium ${isOver ? "text-rose-500" : "text-gray-400"}`}>
                {isOver ? `목표 초과 +${formatKRW(spent - monthlyGoal)}` : `${Math.round(ratio)}% 사용`}
              </p>
            </div>

            <div className="flex items-end gap-6">

              {/* 세로 게이지 */}
              <div className="relative group cursor-default">
                <div className="flex items-end h-32">
                  <div className="w-8 h-full flex flex-col justify-end rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {isOver && (
                      <div className="w-full bg-rose-400 transition-all duration-700" style={{ height: `${Math.min(overRatio, 100)}%` }} />
                    )}
                    <div
                      className={`w-full transition-all duration-700 ${isOver ? "bg-rose-300" : "bg-lime-400"}`}
                      style={{ height: `${ratio}%` }}
                    />
                  </div>
                </div>

                {/* 호버 툴팁 */}
                <div className="absolute left-12 bottom-0 hidden group-hover:block z-10 min-w-44">
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-lg">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2.5">카테고리별 지출</p>
                    <div className="space-y-2">
                      {categorySpending.map(({ name, value }) => (
                        <div key={name} className="flex items-center justify-between gap-8">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{name}</p>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{formatKRW(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 텍스트 정보 */}
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs text-gray-400">사용액</p>
                  <p className={`text-2xl font-bold mt-0.5 ${isOver ? "text-rose-500" : "text-gray-800 dark:text-white"}`}>
                    {formatKRW(spent)}
                  </p>
                </div>
                <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
                <div>
                  <p className="text-xs text-gray-400">목표</p>
                  <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatKRW(monthlyGoal)}
                  </p>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 최근 거래 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">최근 거래</h2>
        <div className="space-y-1">
          {recentTransactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
              <div className="flex items-center gap-3">
                {/* 은행 로고 */}
                {t.account && bankFavicons[t.account] && (
                  <img
                    src={bankFavicons[t.account]}
                    alt={t.account}
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    onError={(e) => e.target.style.display = "none"}
                  />
                )}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColor[t.category] || "bg-gray-100 text-gray-600"}`}>
                  {t.category}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.description}</p>
                  <p className="text-xs text-gray-400">{t.date}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${t.amount > 0 ? "text-lime-600" : "text-gray-800 dark:text-gray-100"}`}>
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