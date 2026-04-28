// =============================================
// App.jsx - 전체 레이아웃 관리
// 다크모드 토글 상태 관리 추가
// =============================================

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Upload from "./pages/Upload";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  // 다크모드 상태 (로컬스토리지에 저장해서 새로고침해도 유지)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // darkMode 바뀔 때마다 <html> 태그에 dark 클래스 추가/제거
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":    return <Dashboard />;
      case "accounts":     return <Accounts />;
      case "transactions": return <Transactions />;
      case "upload":       return <Upload />;
      default:             return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* 왼쪽 사이드바 */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((prev) => !prev)}
      />

      {/* 오른쪽 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;