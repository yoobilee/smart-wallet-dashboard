// =============================================
// Dashboard 페이지 - 메인 화면
// 자산 현황, 수입/지출 요약, 최근 거래 내역 표시
// =============================================

import {
  totalAssets,
  availableBalance,
  totalInvestmentBalance,
  thisMonthIncome,
  thisMonthExpense,
  totalCardSpending,
  transactions,
} from "../data/dummyData";

// 숫자를 한국 원화 형식으로 변환하는 함수
// 예: 1240000 → "1,240,000원"
const formatKRW = (amount) => {
  return Math.abs(amount).toLocaleString("ko-KR") + "원";
};

// 카테고리별 색상 지정
const categoryColor = {
  카페:   "bg-amber-100 text-amber-700",
  쇼핑:   "bg-pink-100 text-pink-700",
  편의점: "bg-orange-100 text-orange-700",
  투자:   "bg-blue-100 text-blue-700",
  구독:   "bg-purple-100 text-purple-700",
  식비:   "bg-green-100 text-green-700",
  교통:   "bg-cyan-100 text-cyan-700",
  수입:   "bg-emerald-100 text-emerald-700",
};

function Dashboard() {
  // 최근 5건만 표시
  const recentTransactions = transactions.slice(0, 5);

  // 투자 비율 계산 (자산 대비 투자 비중, 막대 그래프용)
  const investmentRatio = (totalInvestmentBalance / totalAssets) * 100;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* ── 상단 타이틀 ── */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-400 mt-1">2026년 4월 기준</p>
      </div>

      {/* ── 총 자산 카드 ── */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 space-y-4">

        {/* 총 자산 금액 */}
        <div>
          <p className="text-sm text-gray-400">총 자산</p>
          <p className="text-4xl font-bold mt-1">{formatKRW(totalAssets)}</p>
        </div>

        {/* 가용 자산 / 투자 자산 분리 막대 */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>가용 자산</span>
            <span>투자 자산</span>
          </div>

          {/* 비율 막대 그래프 */}
          <div className="flex rounded-full overflow-hidden h-2 bg-gray-700">
            {/* 가용 자산 비율 */}
            <div
              className="bg-emerald-400 transition-all duration-500"
              style={{ width: `${100 - investmentRatio}%` }}
            />
            {/* 투자 자산 비율 */}
            <div
              className="bg-blue-400"
              style={{ width: `${investmentRatio}%` }}
            />
          </div>

          {/* 금액 표시 */}
          <div className="flex justify-between text-sm">
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1" />
              <span className="text-emerald-400 font-medium">{formatKRW(availableBalance)}</span>
            </div>
            <div>
              <span className="text-blue-400 font-medium">{formatKRW(totalInvestmentBalance)}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 이번 달 요약 카드 3개 ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* 수입 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-1 shadow-sm">
          <p className="text-xs text-gray-400">이번 달 수입</p>
          <p className="text-lg font-semibold text-emerald-600">+{formatKRW(thisMonthIncome)}</p>
        </div>

        {/* 지출 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-1 shadow-sm">
          <p className="text-xs text-gray-400">이번 달 지출</p>
          <p className="text-lg font-semibold text-rose-500">-{formatKRW(thisMonthExpense)}</p>
        </div>

        {/* 카드 청구 예정 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-1 shadow-sm">
          <p className="text-xs text-gray-400">카드 청구 예정</p>
          <p className="text-lg font-semibold text-gray-800">{formatKRW(totalCardSpending)}</p>
        </div>

      </div>

      {/* ── 최근 거래 내역 ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">최근 거래</h2>

        <div className="space-y-3">
          {recentTransactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between">

              {/* 카테고리 뱃지 + 설명 */}
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColor[t.category] || "bg-gray-100 text-gray-600"}`}>
                  {t.category}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-400">{t.date}</p>
                </div>
              </div>

              {/* 금액 */}
              <p className={`text-sm font-semibold ${t.amount > 0 ? "text-emerald-600" : "text-gray-800"}`}>
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