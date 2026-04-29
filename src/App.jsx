// =============================================
// App.jsx - 전체 레이아웃 관리
// DataProvider로 전역 데이터 상태 감싸기
// =============================================

import { useState, useEffect } from "react";
import { DataProvider } from "./context/DataContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Upload from "./pages/Upload";
import Investments from "./pages/Investments";

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
      case "investments": return <Investments />;
      default:             return <Dashboard />;
    }
  };

  return (
    // DataProvider로 전체 앱을 감싸서 모든 페이지에서 데이터 접근 가능
    <DataProvider>
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
    </DataProvider>
  );
}

export default App;