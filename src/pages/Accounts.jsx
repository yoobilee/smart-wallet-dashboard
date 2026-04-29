// =============================================
// Accounts 페이지 - 계좌 및 카드 목록
// 다크모드 적용
// =============================================

import { investments, cards } from "../data/dummyData";
import { useData } from "../context/DataContext";

const formatKRW = (amount) => amount.toLocaleString("ko-KR") + "원";

function Accounts() {
  // DataContext에서 현재 모드에 맞는 계좌 정보 가져오기
  const { accounts } = useData();
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
          {accounts.map((acc) => (
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
          {investments.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{inv.platform}</p>
                <p className="text-xs text-gray-400">{inv.type}</p>
              </div>
              <p className="text-sm font-semibold text-lime-500">{formatKRW(inv.balance)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 카드 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">카드</h2>
        <div className="space-y-1">
          {cards.map((card) => (
            <div key={card.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{card.company} · {card.name}</p>
                <p className="text-xs text-gray-400">매월 {card.billingDate}일 결제</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-rose-500">-{formatKRW(card.usedThisMonth)}</p>
                <p className="text-xs text-gray-400">이번 달 사용</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Accounts;