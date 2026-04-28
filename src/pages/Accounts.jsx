// =============================================
// Accounts 페이지 - 계좌 및 카드 목록
// 은행 계좌, 투자 계좌, 카드 정보 표시
// =============================================

import { accounts, investments, cards } from "../data/dummyData";

// 숫자를 원화 형식으로 변환
const formatKRW = (amount) => amount.toLocaleString("ko-KR") + "원";

function Accounts() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* ── 상단 타이틀 ── */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
        <p className="text-sm text-gray-400 mt-1">연결된 계좌 및 카드</p>
      </div>

      {/* ── 은행 계좌 ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">은행 계좌</h2>
        <div className="space-y-3">
          {accounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                {/* 은행명 + 계좌 종류 */}
                <p className="text-sm font-medium text-gray-800">{acc.bank}</p>
                <p className="text-xs text-gray-400">{acc.type} · {acc.accountNumber}</p>
              </div>
              {/* 잔액 */}
              <p className="text-sm font-semibold text-gray-900">{formatKRW(acc.balance)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 투자 계좌 ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">투자 계좌</h2>
        <div className="space-y-3">
          {investments.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{inv.platform}</p>
                <p className="text-xs text-gray-400">{inv.type}</p>
              </div>
              {/* 투자 금액은 파란색으로 표시 */}
              <p className="text-sm font-semibold text-blue-500">{formatKRW(inv.balance)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 카드 ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">카드</h2>
        <div className="space-y-3">
          {cards.map((card) => (
            <div key={card.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{card.company} · {card.name}</p>
                <p className="text-xs text-gray-400">매월 {card.billingDate}일 결제</p>
              </div>
              {/* 이번 달 사용액 */}
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