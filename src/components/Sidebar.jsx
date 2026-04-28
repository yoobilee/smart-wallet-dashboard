// =============================================
// Sidebar 컴포넌트 - 왼쪽 네비게이션 메뉴
// activePage: 현재 어떤 페이지인지 표시
// onNavigate: 페이지 이동 함수
// =============================================

// 네비게이션 메뉴 목록
// label: 화면에 표시될 이름
// key: 페이지 구분용 고유값
const navItems = [
  { label: "Overview",     key: "dashboard"    },
  { label: "Accounts",     key: "accounts"     },
  { label: "Transactions", key: "transactions" },
  { label: "Upload",       key: "upload"       },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col px-4 py-8">

      {/* ── 로고 영역 ── */}
      <div className="mb-10 px-2">
        <h1 className="text-lg font-bold text-gray-900">Smart Wallet</h1>
        <p className="text-xs text-gray-400 mt-0.5">Personal Finance</p>
      </div>

      {/* ── 메뉴 목록 ── */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`
              text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${activePage === item.key
                ? "bg-gray-900 text-white"        // 현재 페이지 - 진한 배경
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"  // 나머지
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* ── 하단 더미 모드 표시 ── */}
      <div className="mt-auto px-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Demo Mode
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;