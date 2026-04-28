// =============================================
// Transactions 페이지 - 전체 거래 내역
// 다크모드 적용
// =============================================

import { useState } from "react";
import { transactions } from "../data/dummyData";

const formatKRW = (amount) => amount.toLocaleString("ko-KR") + "원";

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

function Transactions() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", ...new Set(transactions.map((t) => t.category))];

  const filtered = transactions.filter((t) => {
    const matchSearch = t.description.includes(search);
    const matchCategory = selectedCategory === "전체" || t.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-sm text-gray-400 mt-1">전체 거래 내역</p>
      </div>

      {/* 검색 + 필터 */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="거래처 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                ${selectedCategory === cat
                  ? "bg-gray-950 dark:bg-lime-400 text-white dark:text-gray-950"
                  : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 거래 내역 리스트 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">검색 결과가 없습니다.</p>
        ) : (
          <div className="space-y-1">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColor[t.category] || "bg-gray-100 text-gray-600"}`}>
                    {t.category}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.description}</p>
                    <p className="text-xs text-gray-400">{t.date} · {t.type}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${t.amount > 0 ? "text-lime-600" : "text-gray-800 dark:text-gray-100"}`}>
                  {t.amount > 0 ? "+" : ""}{formatKRW(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Transactions;