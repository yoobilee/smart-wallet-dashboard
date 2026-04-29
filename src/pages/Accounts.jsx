// =============================================
// Accounts 페이지 - 계좌 및 카드 목록
// 다크모드 적용
// =============================================

import { useData } from "../context/DataContext";

const formatKRW = (amount) => amount.toLocaleString("ko-KR") + "원";

function Accounts() {
  // DataContext에서 현재 모드에 맞는 계좌 정보 가져오기
  const { accounts, holdings, prices, transactions } = useData();

  // 계좌별 투자 총액 계산
  const accountTotals = holdings.reduce((acc, h) => {
    const value = (prices[h.code] || 0) * h.qty;
    acc[h.account] = (acc[h.account] || 0) + value;
    return acc;
  }, {});

  // 투자 계좌 목록 (계좌명 중복 제거)
  const investmentAccounts = [...new Set(holdings.map((h) => h.account))].map((name) => ({
    id: name,
    platform: name,
    balance: accountTotals[name] || 0,
  }));
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Accounts</h1>
        <p className="text-sm text-gray-400 mt-1">연결된 계좌 및 카드</p>
      </div>

      {/* 은행 계좌 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">은행 계좌</h2>
        <div className="space-y-1">
          {accounts.filter((acc) => acc.type !== "카드").map((acc) => (
            <div key={acc.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{acc.bank}</p>
                <p className="text-xs text-gray-400">{acc.type} · {acc.accountNumber}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatKRW(acc.balance)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 투자 계좌 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">투자 계좌</h2>
        <div className="space-y-1">
          {investmentAccounts.length > 0 ? (
            investmentAccounts.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{inv.platform}</p>
                  <p className="text-xs text-gray-400">NH투자증권 · 실시간 시세</p>
                </div>
                <p className="text-sm font-semibold text-lime-500">
                  {inv.balance > 0 ? formatKRW(inv.balance) : "조회 중..."}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">투자 계좌 없음</p>
          )}
        </div>
      </div>

      {/* 카드 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">카드</h2>
        <div className="space-y-1">
          {accounts.filter((acc) => acc.type === "카드").length > 0 ? (
            accounts.filter((acc) => acc.type === "카드").map((acc) => {
              const now = new Date();
              const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
              const lastDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, "0")}`;

              const thisMonthSpending = transactions
                .filter((t) =>
                  t.account === acc.bank &&
                  t.amount < 0 &&
                  t.date >= firstDay &&
                  t.date <= lastDay
                )
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

              return (
                <div key={acc.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{acc.bank}</p>
                    <p className="text-xs text-gray-400">카드</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-rose-500">-{formatKRW(thisMonthSpending)}</p>
                    <p className="text-xs text-gray-400">이번 달 사용</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">연결된 카드 없음</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default Accounts;