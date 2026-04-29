// =============================================
// Sidebar 컴포넌트 - 왼쪽 네비게이션 메뉴
// 다크모드 토글 버튼 추가
// =============================================

import { LayoutDashboard, Wallet, ArrowLeftRight, Upload, Sun, Moon, TrendingUp } from "lucide-react";

const navItems = [
  { label: "Overview",     key: "dashboard",    icon: LayoutDashboard },
  { label: "Accounts",     key: "accounts",     icon: Wallet          },
  { label: "Transactions", key: "transactions", icon: ArrowLeftRight  },
  { label: "Investments",  key: "investments",  icon: TrendingUp      },
  { label: "Upload",       key: "upload",       icon: Upload          },
];

function Sidebar({ activePage, onNavigate, darkMode, onToggleDark }) {
  return (
    <aside className="w-48 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col px-3 py-8">

      {/* ── 로고 영역 ── */}
      <div className="mb-10 px-3">
        <h1 className="text-base font-bold text-gray-900 dark:text-white">Smart Wallet</h1>
        <p className="text-xs text-gray-400 mt-0.5">Personal Finance</p>
      </div>

      {/* ── 메뉴 목록 ── */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`
                flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${activePage === item.key
                  ? "bg-gray-950 dark:bg-lime-400 text-white dark:text-gray-950"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }
              `}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── 하단 영역 ── */}
      <div className="mt-auto px-3 space-y-3">

        {/* 다크모드 토글 버튼 */}
        <button
          onClick={onToggleDark}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          {darkMode
            ? <><Sun size={14} /> Light Mode</>
            : <><Moon size={14} /> Dark Mode</>
          }
        </button>

        {/* Demo Mode 표시 */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
          Demo Mode
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;