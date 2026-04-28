// =============================================
// App.jsx - 전체 레이아웃 관리
// 사이드바 + 현재 페이지를 나란히 배치
// activePage 상태에 따라 페이지 전환
// =============================================

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Upload from "./pages/Upload";

function App() {
  // activePage: 현재 보여줄 페이지 이름 저장
  const [activePage, setActivePage] = useState("dashboard");

  // activePage 값에 따라 해당 페이지 컴포넌트 반환
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
    <div className="flex min-h-screen bg-gray-50">

      {/* 왼쪽 사이드바 */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}  // 메뉴 클릭 시 페이지 전환
      />

      {/* 오른쪽 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;