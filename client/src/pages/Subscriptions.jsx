// =============================================
// Subscriptions 페이지 - 정기구독 관리
// =============================================

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const CATEGORY_OPTIONS = ["엔터테인먼트", "쇼핑", "음악", "클라우드", "업무", "게임", "기타"];

const CURRENCY_OPTIONS = [
  { code: "KRW", label: "₩ 원" },
  { code: "USD", label: "$ 달러" },
  { code: "INR", label: "₹ 루피" },
  { code: "JPY", label: "¥ 엔" },
  { code: "EUR", label: "€ 유로" },
];

const categoryColor = {
  엔터테인먼트: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  쇼핑: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  음악: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  클라우드: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  업무: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  게임: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  기타: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const getFavicon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("쿠팡") || n.includes("와우")) return "https://www.google.com/s2/favicons?domain=coupang.com&sz=32";
  if (n.includes("카카오") || n.includes("이모티콘") || n.includes("톡서랍")) return "https://www.google.com/s2/favicons?domain=kakao.com&sz=32";
  if (n.includes("icloud") || n.includes("apple") || n.includes("애플")) return "https://www.google.com/s2/favicons?domain=apple.com&sz=32";
  if (n.includes("kurly") || n.includes("컬리")) return "https://www.google.com/s2/favicons?domain=kurly.com&sz=32";
  if (n.includes("youtube") || n.includes("유튜브")) return "https://www.google.com/s2/favicons?domain=youtube.com&sz=32";
  if (n.includes("claude") || n.includes("anthropic") || n.includes("클로드")) return "https://www.google.com/s2/favicons?domain=anthropic.com&sz=32";
  if (n.includes("naver") || n.includes("네이버")) return "https://www.google.com/s2/favicons?domain=naver.com&sz=32";
  if (n.includes("cloudflare")) return "https://www.google.com/s2/favicons?domain=cloudflare.com&sz=32";
  if (n.includes("spotify") || n.includes("스포티파이")) return "https://www.google.com/s2/favicons?domain=spotify.com&sz=32";
  if (n.includes("netflix") || n.includes("넷플릭스")) return "https://www.google.com/s2/favicons?domain=netflix.com&sz=32";
  if (n.includes("nintendo") || n.includes("닌텐도")) return "https://www.google.com/s2/favicons?domain=nintendo.com&sz=32";
  return null;
};

const formatKRW = (amount) => Math.round(amount).toLocaleString("ko-KR") + "원";
const currencySymbol = (code) => ({ KRW: "₩", USD: "$", INR: "₹", JPY: "¥", EUR: "€" }[code] || "");

// ── 커스텀 드롭다운 ──────────────────────────────
function Dropdown({ value, options, onChange, placeholder, dropUp = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-400 transition-all duration-300 whitespace-nowrap"
      >
        <span className={selected ? "text-gray-800 dark:text-gray-100" : "text-gray-400"}>
          {selected?.label || placeholder || "선택"}
        </span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute left-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg z-20 overflow-y-auto transition-all duration-300"
          style={{
            ...(dropUp ? { bottom: "100%", marginBottom: "4px" } : { top: "100%", marginTop: "4px" }),
            maxHeight: "200px",
            minWidth: "140px",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left text-sm px-4 py-2.5 transition-colors whitespace-nowrap
                ${opt.value === value
                  ? "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────
function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem("subscriptions");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "와우 멤버십", category: "쇼핑", amount: 7890, currency: "KRW", day: 1, month: null, cycle: 1 },
      { id: 2, name: "이모티콘 플러스", category: "엔터테인먼트", amount: 1900, currency: "KRW", day: 1, month: null, cycle: 1 },
      { id: 3, name: "톡서랍 플러스", category: "엔터테인먼트", amount: 990, currency: "KRW", day: 1, month: null, cycle: 1 },
      { id: 4, name: "iCloud+", category: "클라우드", amount: 1.99, currency: "USD", day: 9, month: null, cycle: 1 },
      { id: 5, name: "컬리멤버스", category: "쇼핑", amount: 1900, currency: "KRW", day: 10, month: null, cycle: 1 },
      { id: 6, name: "Youtube Premium", category: "엔터테인먼트", amount: 189, currency: "INR", day: 9, month: null, cycle: 1 },
      { id: 7, name: "Claude", category: "업무", amount: 20, currency: "USD", day: 28, month: null, cycle: 1 },
      { id: 8, name: "네이버플러스 멤버십", category: "쇼핑", amount: 4900, currency: "KRW", day: 22, month: null, cycle: 1 },
      { id: 9, name: "Cloudflare", category: "클라우드", amount: 0, currency: "USD", day: 28, month: null, cycle: 1 },
      { id: 10, name: "Spotify", category: "음악", amount: 10900, currency: "KRW", day: 15, month: null, cycle: 1 },
      { id: 11, name: "Nintendo Switch Online", category: "게임", amount: 4900, currency: "KRW", day: 19, month: 2, cycle: 12 },
    ];
  });

  const [editMode, setEditMode] = useState(false);
  const [newSub, setNewSub] = useState({ name: "", category: "", amount: "", currency: "KRW", day: 1, month: 1, cycle: 1 });
  const [hoveredDay, setHoveredDay] = useState(null);
  const [rates, setRates] = useState({ USD: 1450, INR: 17, JPY: 9.5, EUR: 1600 });

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const dayOptions = Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: `${i + 1}일` }));
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}월` }));

  useEffect(() => {
    const fetchRates = async () => {
      const symbols = { USD: "USDKRW=X", INR: "INRKRW=X", JPY: "JPYKRW=X", EUR: "EURKRW=X" };
      const newRates = { ...rates };
      await Promise.all(
        Object.entries(symbols).map(async ([code, symbol]) => {
          try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            const res = await fetch(proxyUrl);
            const data = await res.json();
            const rate = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
            if (rate) newRates[code] = rate;
          } catch { }
        })
      );
      setRates(newRates);
    };
    fetchRates();
  }, []);

  const toKRW = (amount, currency) =>
    currency === "KRW" ? amount : amount * (rates[currency] || 1);

  const save = (updated) => {
    setSubscriptions(updated);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
  };

  const addSub = () => {
    if (!newSub.name || !newSub.category) return;
    save([...subscriptions, {
      ...newSub,
      id: Date.now(),
      amount: parseFloat(newSub.amount) || 0,
      month: newSub.cycle !== 1 ? newSub.month : null,
    }]);
    setNewSub({ name: "", category: "", amount: "", currency: "KRW", day: 1, month: 1, cycle: 1 });
  };

  const removeSub = (id) => save(subscriptions.filter((s) => s.id !== id));
  const totalMonthly = subscriptions.reduce((sum, s) => sum + toKRW(s.amount, s.currency) / (s.cycle || 1), 0);

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); };

  // 연간 구독은 해당 월에만 표시
  const subsByDay = subscriptions.reduce((acc, s) => {
    const showThisMonth = s.cycle === 12
      ? s.month === calMonth + 1
      : true;
    if (showThisMonth) {
      if (!acc[s.day]) acc[s.day] = [];
      acc[s.day].push(s);
    }
    return acc;
  }, {});

  const weeks = ["일", "월", "화", "수", "목", "금", "토"];
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* 타이틀 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-sm text-gray-400 mt-1">정기구독 관리</p>
        </div>
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="text-xs font-medium px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 transition-colors"
        >
          {editMode ? "편집 완료" : "편집"}
        </button>
      </div>

      {/* 총 월 구독료 */}
      <div className="bg-gray-950 text-white rounded-2xl p-6 dark:bg-gray-900 dark:border dark:border-gray-800">
        <p className="text-sm text-gray-400">월 평균 구독료</p>
        <p className="text-4xl font-bold mt-2 tracking-tight">{formatKRW(totalMonthly)}</p>
        <p className="text-xs text-gray-500 mt-2">{subscriptions.length}개 서비스 구독 중</p>
      </div>

      {/* 캘린더 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          className="py-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft size={15} className="text-gray-400" />
          </button>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300" style={{ margin: "0 24px" }}>
            {calYear}년 {calMonth + 1}월
          </h2>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronRight size={15} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }} className="mb-1">
            {weeks.map((w) => (
              <div key={w} className={`text-center text-xs font-medium py-2
                ${w === "일" ? "text-rose-400" : w === "토" ? "text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>
                {w}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {cells.map((day, i) => {
              const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
              const daySubs = day ? (subsByDay[day] || []) : [];
              const isSun = i % 7 === 0;
              const isSat = i % 7 === 6;
              const isRight = i % 7 >= 5;

              return (
                <div key={i} style={{ height: "72px" }} className="flex flex-col items-center pt-2 gap-1.5">
                  {day && (
                    <>
                      <span className={`text-xs font-medium
                      ${isToday
                          ? "text-lime-500 dark:text-lime-400 font-bold underline underline-offset-2 decoration-lime-400"
                          : isSun ? "text-rose-400"
                            : isSat ? "text-blue-400"
                              : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {day}
                      </span>

                      {daySubs.length > 0 && (
                        <div
                          className="relative flex gap-0.5 cursor-default"
                          onMouseEnter={() => setHoveredDay(i)}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          {daySubs.map((s) => (
                            <div key={s.id} className="w-2 h-2 rounded-full bg-lime-400 dark:bg-lime-500" />
                          ))}

                          {hoveredDay === i && (
                            <div
                              className="absolute top-5 z-50 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 shadow-xl"
                              style={{
                                width: "180px",
                                ...(isRight ? { right: 0 } : { left: "50%", transform: "translateX(-50%)" })
                              }}
                            >
                              {daySubs.map((sub) => (
                                <div key={sub.id} className="flex items-center gap-2 py-1">
                                  {getFavicon(sub.name) ? (
                                    <img src={getFavicon(sub.name)} alt={sub.name} className="w-4 h-4 rounded-sm flex-shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{sub.name}</p>
                                    <p className="text-xs text-gray-400">
                                      {sub.currency !== "KRW"
                                        ? `${currencySymbol(sub.currency)}${sub.amount} · ${formatKRW(toKRW(sub.amount, sub.currency))}`
                                        : formatKRW(sub.amount)
                                      }
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 구독 목록 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-1">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">구독 목록</h2>
        {subscriptions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">구독 중인 서비스가 없습니다.</p>
        ) : (
          [...subscriptions].sort((a, b) => a.day - b.day).map((s) => (
            <div key={s.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                {getFavicon(s.name) ? (
                  <img src={getFavicon(s.name)} alt={s.name} className="w-4 h-4 rounded-sm" onError={(e) => e.target.style.display = "none"} />
                ) : (
                  <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-700" />
                )}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColor[s.category] || categoryColor["기타"]}`}>
                  {s.category}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{s.name}</p>
                  <p className="text-xs text-gray-400">
                    {s.cycle === 12
                      ? `매년 ${s.month}월 ${s.day}일`
                      : s.cycle > 1 ? `${s.cycle}개월마다 · ${s.month}월 ${s.day}일 기준`
                        : `매월 ${s.day}일`
                    }
                    {s.currency !== "KRW" && ` · ${currencySymbol(s.currency)}${s.amount}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{formatKRW(toKRW(s.amount, s.currency))}</p>
                  {s.currency !== "KRW" && (
                    <p className="text-xs text-gray-400">{currencySymbol(s.currency)}{s.amount}</p>
                  )}
                </div>
                {editMode && (
                  <button onClick={() => removeSub(s.id)} className="text-xs text-rose-400 hover:text-rose-600 transition-colors">삭제</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 구독 추가 */}
      {editMode && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">구독 추가</p>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              placeholder="서비스명"
              value={newSub.name}
              onChange={(e) => setNewSub((prev) => ({ ...prev, name: e.target.value }))}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
            <Dropdown
              value={newSub.category}
              placeholder="카테고리"
              options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
              onChange={(v) => setNewSub((prev) => ({ ...prev, category: v }))}
              dropUp
            />
            <Dropdown
              value={newSub.currency}
              options={CURRENCY_OPTIONS.map((c) => ({ value: c.code, label: c.label }))}
              onChange={(v) => setNewSub((prev) => ({ ...prev, currency: v }))}
              dropUp
            />
            <input
              type="number"
              placeholder="금액"
              value={newSub.amount}
              onChange={(e) => setNewSub((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-24 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
            <Dropdown
              value={newSub.cycle}
              options={[
                { value: 1, label: "매월" },
                { value: 3, label: "3개월" },
                { value: 6, label: "6개월" },
                { value: 12, label: "연간" },
              ]}
              onChange={(v) => setNewSub((prev) => ({ ...prev, cycle: v }))}
              dropUp
            />
            {newSub.cycle !== 1 && (
              <Dropdown
                value={newSub.month}
                options={monthOptions}
                onChange={(v) => setNewSub((prev) => ({ ...prev, month: v }))}
                dropUp
              />
            )}
            <Dropdown
              value={newSub.day}
              options={dayOptions}
              onChange={(v) => setNewSub((prev) => ({ ...prev, day: v }))}
              dropUp
            />
            <button
              onClick={addSub}
              className="px-4 py-2 rounded-xl bg-gray-950 dark:bg-lime-400 text-white dark:text-gray-950 text-sm font-medium transition-colors"
            >
              추가
            </button>
          </div>
          {newSub.currency !== "KRW" && parseFloat(newSub.amount) > 0 && (
            <p className="text-xs text-gray-400">
              ≈ {formatKRW(toKRW(parseFloat(newSub.amount), newSub.currency))} (실시간 환율 기준)
            </p>
          )}
        </div>
      )}

    </div>
  );
}

export default Subscriptions;