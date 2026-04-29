import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { totalCardSpending as dummyCardSpending } from "../data/dummyData";
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
};

const CHART_COLORS = ["#a3e635", "#f472b6", "#fb923c", "#22d3ee", "#a78bfa", "#4ade80", "#fbbf24"];

function Dashboard() {
  // DataContext에서 현재 모드에 맞는 거래내역 가져오기
  const { transactions, totalBankBalance, thisMonthIncome, thisMonthExpense, isDemoMode, totalInvestmentBalance } = useData();

  // 실제 데이터 모드일 때는 투자/카드 더미 데이터 제외
  const totalCardSpending = isDemoMode ? dummyCardSpending : 0;
  const totalAssets = totalBankBalance + totalInvestmentBalance;
  const availableBalance = totalBankBalance;

  // 카테고리별 지출 합계 계산 (여기로 이동!)
  const categoryData = Object.entries(
    transactions
      .filter((t) => t.amount < 0 && t.category !== "투자")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  const recentTransactions = transactions.slice(0, 5);
  const investmentRatio = (totalInvestmentBalance / totalAssets) * 100;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview</h1>
        <p className="text-sm text-gray-400 mt-1">2026년 4월 기준</p>
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
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">이번 달 수입</p>
            <p className="text-xl font-bold text-lime-600 mt-1">+{formatKRW(thisMonthIncome)}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">이번 달 지출</p>
            <p className="text-xl font-bold text-rose-500 mt-1">-{formatKRW(thisMonthExpense)}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400">카드 청구 예정</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{formatKRW(totalCardSpending)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">지출 카테고리</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3} stroke="none">
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatKRW(value), "지출"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #1f2937", backgroundColor: "#111827", color: "#fff", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 거래 */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">최근 거래</h2>
        <div className="space-y-1">
          {recentTransactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
              <div className="flex items-center gap-3">
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