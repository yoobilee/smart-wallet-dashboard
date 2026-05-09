// =============================================
// Subscriptions 페이지 - 정기구독 관리
// =============================================

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const formatKRW = (amount) => amount.toLocaleString("ko-KR") + "원";

const CATEGORY_OPTIONS = ["엔터테인먼트", "음악", "클라우드", "업무", "게임", "기타"];

const categoryColor = {
  엔터테인먼트: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  음악: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  클라우드: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  업무: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  게임: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  기타: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const subFavicons = {
  넷플릭스: "https://www.google.com/s2/favicons?domain=netflix.com&sz=32",
  "유튜브 프리미엄": "https://www.google.com/s2/favicons?domain=youtube.com&sz=32",
  Spotify: "https://www.google.com/s2/favicons?domain=spotify.com&sz=32",
  애플: "https://www.google.com/s2/favicons?domain=apple.com&sz=32",
  구글: "https://www.google.com/s2/favicons?domain=google.com&sz=32",
  디즈니: "https://www.google.com/s2/favicons?domain=disneyplus.com&sz=32",
  왓챠: "https://www.google.com/s2/favicons?domain=watcha.com&sz=32",
  웨이브: "https://www.google.com/s2/favicons?domain=wavve.com&sz=32",
  GamsGo: "https://www.google.com/s2/favicons?domain=gamsgo.com&sz=32",
  Cloudflare: "https://www.google.com/s2/favicons?domain=cloudflare.com&sz=32",
};

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem("subscriptions");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "넷플릭스", category: "엔터테인먼트", amount: 17000, day: 4 },
      { id: 2, name: "유튜브 프리미엄", category: "엔터테인먼트", amount: 14900, day: 9 },
      { id: 3, name: "Spotify", category: "음악", amount: 10900, day: 15 },
    ];
  });

  const [editMode, setEditMode] = useState(false);
  const [newSub, setNewSub] = useState({ name: "", category: "기타", amount: 0, day: 1 });
  const [hoveredDay, setHoveredDay] = useState(null);

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const save = (updated) => {
    setSubscriptions(updated);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
  };

  const addSub = () => {
    if (!newSub.name) return;
    const updated = [...subscriptions, { ...newSub, id: Date.now(), amount: parseInt(newSub.amount) || 0 }];
    save(updated);
    setNewSub({ name: "", category: "기타", amount: 0, day: 1 });
  };

  const removeSub = (id) => save(subscriptions.filter((s) => s.id !== id));
  const totalMonthly = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); };

  const subsByDay = subscriptions.reduce((acc, s) => {
    if (!acc[s.day]) acc[s.day] = [];
    acc[s.day].push(s);
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
        <p className="text-sm text-gray-400">월 총 구독료</p>
        <p className="text-4xl font-bold mt-2 tracking-tight">{formatKRW(totalMonthly)}</p>
        <p className="text-xs text-gray-500 mt-2">{subscriptions.length}개 서비스 구독 중</p>
      </div>

      {/* 캘린더 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className="py-4 border-b border-gray-100 dark:border-gray-800">
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
          {/* 요일 헤더 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }} className="mb-1">
            {weeks.map((w) => (
              <div key={w} className={`text-center text-xs font-medium py-2
                ${w === "일" ? "text-rose-400" : w === "토" ? "text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>
                {w}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {cells.map((day, i) => {
              const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
              const daySubs = day ? (subsByDay[day] || []) : [];
              const isSun = i % 7 === 0;
              const isSat = i % 7 === 6;
              const isRight = i % 7 >= 5;

              return (
                <div
                  key={i}
                  style={{ height: "72px" }}
                  className="flex flex-col items-center pt-2 gap-1.5"
                >
                  {day && (
                    <>
                      {/* 날짜 숫자 */}
                      <span className={`text-xs font-medium
        ${isToday ? "text-lime-500 dark:text-lime-400 font-bold"
                          : isSun ? "text-rose-400"
                            : isSat ? "text-blue-400"
                              : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {day}
                        {isToday && <span className="inline-block w-1 h-1 rounded-full bg-lime-400 ml-0.5 mb-0.5 align-middle" />}
                      </span>

                      {/* 도트 + 툴팁 */}
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
                                width: "160px",
                                ...(isRight ? { right: 0 } : { left: "50%", transform: "translateX(-50%)" })
                              }}
                            >
                              {daySubs.map((sub) => (
                                <div key={sub.id} className="flex items-center gap-2 py-1">
                                  {subFavicons[sub.name] ? (
                                    <img src={subFavicons[sub.name]} alt={sub.name} className="w-4 h-4 rounded-sm flex-shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                                  )}
                                  <div>
                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{sub.name}</p>
                                    <p className="text-xs text-gray-400">{formatKRW(sub.amount)}</p>
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
                {subFavicons[s.name] ? (
                  <img src={subFavicons[s.name]} alt={s.name} className="w-4 h-4 rounded-sm" onError={(e) => e.target.style.display = "none"} />
                ) : (
                  <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-700" />
                )}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColor[s.category] || categoryColor["기타"]}`}>
                  {s.category}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{s.name}</p>
                  <p className="text-xs text-gray-400">매월 {s.day}일</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{formatKRW(s.amount)}</p>
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
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="서비스명"
              value={newSub.name}
              onChange={(e) => setNewSub((prev) => ({ ...prev, name: e.target.value }))}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
            <select
              value={newSub.category}
              onChange={(e) => setNewSub((prev) => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none"
            >
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              placeholder="금액"
              value={newSub.amount || ""}
              onChange={(e) => setNewSub((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-28 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
            <input
              type="number"
              placeholder="결제일"
              min="1"
              max="31"
              value={newSub.day || ""}
              onChange={(e) => setNewSub((prev) => ({ ...prev, day: parseInt(e.target.value) || 1 }))}
              className="w-20 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
            <button
              onClick={addSub}
              className="px-4 py-2 rounded-xl bg-gray-950 dark:bg-lime-400 text-white dark:text-gray-950 text-sm font-medium transition-colors"
            >
              추가
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Subscriptions;