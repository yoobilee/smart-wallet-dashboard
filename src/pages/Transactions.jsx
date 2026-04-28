// =============================================
// Transactions 페이지 - 전체 거래 내역
// 카테고리/타입 필터, 검색 기능 포함
// =============================================

import { useState } from "react";
import { transactions } from "../data/dummyData";

// 숫자를 원화 형식으로 변환
const formatKRW = (amount) => amount.toLocaleString("ko-KR") + "원";

// 카테고리별 색상
const categoryColor = {
  카페:   "bg-amber-100 text-amber-700",
  쇼핑:   "bg-pink-100 text-pink-700",
  편의점: "bg-orange-100 text-orange-700",
  투자:   "bg-blue-100 text-blue-700",
  구독:   "bg-purple-100 text-purple-700",
  식비:   "bg-green-100 text-green-700",
  교통:   "bg-cyan-100 text-cyan-700",
  수입:   "bg-lime-100 text-emerald-700",
};

function Transactions() {
  // 검색어 상태
  const [search, setSearch] = useState("");
  // 선택된 카테고리 필터 상태 ("전체" 가 기본값)
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 전체 카테고리 목록 (중복 제거)
  const categories = ["전체", ...new Set(transactions.map((t) => t.category))];

  // 필터링된 거래 내역
  // 1. 검색어로 필터 (description에 검색어 포함 여부)
  // 2. 카테고리로 필터
  const filtered = transactions.filter((t) => {
    const matchSearch = t.description.includes(search);
    const matchCategory = selectedCategory === "전체" || t.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* ── 상단 타이틀 ── */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <p className="text-sm text-gray-400 mt-1">전체 거래 내역</p>
      </div>

      {/* ── 검색 + 필터 영역 ── */}
      <div className="space-y-3">

        {/* 검색창 */}
        <input
          type="text"
          placeholder="거래처 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}  // 입력할 때마다 search 상태 업데이트
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
        />

        {/* 카테고리 필터 버튼 목록 */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                ${selectedCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 거래 내역 리스트 ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

        {/* 필터 결과 없을 때 */}
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">검색 결과가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">

                {/* 카테고리 뱃지 + 설명 */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColor[t.category] || "bg-gray-100 text-gray-600"}`}>
                    {t.category}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.description}</p>
                    <p className="text-xs text-gray-400">{t.date} · {t.type}</p>
                  </div>
                </div>

                {/* 금액 */}
                <p className={`text-sm font-semibold ${t.amount > 0 ? "text-lime-600" : "text-gray-800"}`}>
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