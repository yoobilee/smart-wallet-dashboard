// =============================================
// Sidebar 컴포넌트 - 왼쪽 네비게이션 메뉴
// lucide-react 아이콘 + 텍스트 조합
// =============================================

import { LayoutDashboard, Wallet, ArrowLeftRight, Upload } from "lucide-react";

// 네비게이션 메뉴 목록
// icon: lucide-react 아이콘 컴포넌트
const navItems = [
  { label: "Overview",     key: "dashboard",    icon: LayoutDashboard },
  { label: "Accounts",     key: "accounts",     icon: Wallet          },
  { label: "Transactions", key: "transactions", icon: ArrowLeftRight  },
  { label: "Upload",       key: "upload",       icon: Upload          },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-48 min-h-screen bg-white border-r border-gray-100 flex flex-col px-3 py-8">

      {/* ── 로고 영역 ── */}
      <div className="mb-10 px-3">
        <h1 className="text-base font-bold text-gray-900">Smart Wallet</h1>
        <p className="text-xs text-gray-400 mt-0.5">Personal Finance</p>
      </div>

      {/* ── 메뉴 목록 ── */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          // Icon 변수에 아이콘 컴포넌트 저장 (대문자로 시작해야 JSX에서 컴포넌트로 인식)
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`
                flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${activePage === item.key
                  ? "bg-gray-950 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              {/* 아이콘 */}
              <Icon size={16} />
              {/* 텍스트 */}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── 하단 Demo Mode 표시 ── */}
      <div className="mt-auto px-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
          Demo Mode
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;