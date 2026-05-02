// =============================================
// Transactions 페이지 - 전체 거래 내역
// 미니멀 필터 UI - 검색/정렬/개수 한 줄, 필터 한 줄
// =============================================

import { useState, useMemo, useRef, useEffect } from "react";
import { useData } from "../context/DataContext";
import { ArrowUpDown, ChevronDown } from "lucide-react";

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
  이체:   "bg-gray-100 text-gray-500",
  의료:   "bg-red-100 text-red-500",
  기타:   "bg-gray-100 text-gray-500",
  생활:   "bg-teal-100 text-teal-600",
  지출이체: "bg-orange-100 text-orange-600",
};

const bankFavicons = {
  신한은행:   "https://www.google.com/s2/favicons?domain=bank.shinhan.com&sz=32",
  카카오뱅크: "https://www.google.com/s2/favicons?domain=kakaobank.com&sz=32",
  토스뱅크:   "https://www.google.com/s2/favicons?domain=tossbank.com&sz=32",
  현대카드:   "https://www.google.com/s2/favicons?domain=hyundaicard.com&sz=32",
  NH투자증권: "https://www.google.com/s2/favicons?domain=nhqv.com&sz=32",
  카카오페이: "https://www.google.com/s2/favicons?domain=kakaopay.com&sz=32",
  우리은행: "https://www.google.com/s2/favicons?domain=wooribank.com&sz=32",
};

const sortOptions = [
  { key: "date_desc",   label: "최신순"       },
  { key: "date_asc",    label: "오래된순"      },
  { key: "amount_desc", label: "금액 높은순"   },
  { key: "amount_asc",  label: "금액 낮은순"   },
  { key: "name_asc",    label: "이름 오름차순" },
  { key: "name_desc",   label: "이름 내림차순" },
];

const limitOptions = [20, 50, 100];

// 커스텀 드롭다운 컴포넌트
function Dropdown({ value, options, onChange, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.key === value) || options.find((o) => o === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-400 transition-colors"
      >
        {label && <span className="text-gray-400">{label}</span>}
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {selected?.label || selected}
        </span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg z-10 min-w-32 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.key || opt}
              onClick={() => { onChange(opt.key || opt); setOpen(false); }}
              className={`
                w-full text-left text-xs px-4 py-2.5 transition-colors
                ${(opt.key || opt) === value
                  ? "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              {opt.label || opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Transactions() {
  const { transactions } = useData();

  const [search, setSearch]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [typeFilter, setTypeFilter]         = useState("전체");   // 전체/수입/지출
  const [cardFilter, setCardFilter]         = useState("전체");   // 전체/체크카드/신용카드
  const [sortKey, setSortKey]               = useState("date_desc");
  const [limit, setLimit]                   = useState(20);

  const categories = ["전체", ...new Set(transactions.map((t) => t.category))];
  const limitDropdownOptions = limitOptions.map((l) => ({ key: l, label: `${l}개` }));

  const filtered = useMemo(() => {
    let result = transactions.filter((t) => {
      const matchSearch   = t.description.includes(search);
      const matchCategory = selectedCategory === "전체" || t.category === selectedCategory;
      const matchType     = typeFilter === "전체"
        || (typeFilter === "수입" && t.amount > 0)
        || (typeFilter === "지출" && t.amount < 0);
      const matchCard     = cardFilter === "전체"
        || (cardFilter === "체크카드" && t.account !== "현대카드" && t.amount < 0)
        || (cardFilter === "신용카드" && t.account === "현대카드");
      return matchSearch && matchCategory && matchType && matchCard;
    });

    result = [...result].sort((a, b) => {
      switch (sortKey) {
        case "date_desc":   return new Date(b.date) - new Date(a.date);
        case "date_asc":    return new Date(a.date) - new Date(b.date);
        case "amount_desc": return Math.abs(b.amount) - Math.abs(a.amount);
        case "amount_asc":  return Math.abs(a.amount) - Math.abs(b.amount);
        case "name_asc":    return a.description.localeCompare(b.description, "ko");
        case "name_desc":   return b.description.localeCompare(a.description, "ko");
        default:            return 0;
      }
    });

    return result.slice(0, limit);
  }, [transactions, search, selectedCategory, typeFilter, cardFilter, sortKey, limit]);

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">

      {/* 상단 타이틀 */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-sm text-gray-400 mt-1">전체 거래 내역</p>
      </div>

      {/* 첫 번째 줄 - 검색 + 정렬 + 개수 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="거래처 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />
        <Dropdown
          value={sortKey}
          options={sortOptions}
          onChange={setSortKey}
          label={<ArrowUpDown size={11} />}
        />
        <Dropdown
          value={limit}
          options={limitDropdownOptions}
          onChange={(v) => setLimit(Number(v))}
        />
      </div>

      {/* 두 번째 줄 - 수입/지출 | 체크/신용 | 카테고리 */}
      <div className="flex gap-2 items-center flex-wrap">

        {/* 수입/지출 */}
        {["전체", "수입", "지출"].map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`
              text-xs px-3 py-1.5 rounded-full font-medium transition-colors
              ${typeFilter === type
                ? type === "수입" ? "bg-lime-500 text-white"
                : type === "지출" ? "bg-rose-500 text-white"
                : "bg-gray-950 dark:bg-lime-400 text-white dark:text-gray-950"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400"
              }
            `}
          >
            {type}
          </button>
        ))}

        {/* 구분선 */}
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

        {/* 체크카드/신용카드 */}
        {["전체", "체크카드", "신용카드"].map((type) => (
          <button
            key={type}
            onClick={() => setCardFilter(type)}
            className={`
              text-xs px-3 py-1.5 rounded-full font-medium transition-colors
              ${cardFilter === type
                ? type === "체크카드" ? "bg-blue-500 text-white"
                : type === "신용카드" ? "bg-purple-500 text-white"
                : "bg-gray-950 dark:bg-lime-400 text-white dark:text-gray-950"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400"
              }
            `}
          >
            {type}
          </button>
        ))}

        {/* 구분선 */}
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

        {/* 카테고리 드롭다운 */}
        <Dropdown
          value={selectedCategory}
          options={categories.map((c) => ({ key: c, label: c }))}
          onChange={setSelectedCategory}
        />

        {/* 건수 표시 */}
        <p className="text-xs text-gray-400 ml-auto">{filtered.length}건</p>
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
                    <p className="text-xs text-gray-400">{t.date} · {t.account}</p>
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