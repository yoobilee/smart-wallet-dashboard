// =============================================
// Upload 페이지 - CSV 파일 업로드 및 수동 잔고 입력
// =============================================

import { useState } from "react";
import { useData } from "../context/DataContext";

const bankOptions = [
  { key: "shinhan", label: "신한은행", available: true },
  { key: "kakao", label: "카카오뱅크", available: true },
  { key: "toss", label: "토스뱅크", available: true },
  { key: "hyundai", label: "현대카드", available: true },
  { key: "kakaopay", label: "카카오페이", available: true },
  { key: "woori", label: "우리은행", available: true },
];

function Upload() {
  const {
    transactions, isDemoMode, loadCSVFile, addTransactions, resetToDemo,
    monthlyGoal, setMonthlyGoal,
    manualBalances, setManualBalances,
  } = useData();

  // 목표 입력 상태
  const [goalInput, setGoalInput] = useState(monthlyGoal > 0 ? monthlyGoal.toString() : "");

  // 수동 잔고 입력 상태
  const [manualInputs, setManualInputs] = useState({
    웰컴은행: manualBalances.웰컴은행 > 0 ? manualBalances.웰컴은행.toString() : "",
    사이다뱅크: manualBalances.사이다뱅크 > 0 ? manualBalances.사이다뱅크.toString() : "",
    하나멤버스: manualBalances.하나멤버스 > 0 ? manualBalances.하나멤버스.toString() : "",
    NH_CMA: manualBalances.NH_CMA > 0 ? manualBalances.NH_CMA.toString() : "",
    NH_ISA: manualBalances.NH_ISA > 0 ? manualBalances.NH_ISA.toString() : "",
    토스증권: manualBalances.토스증권 > 0 ? manualBalances.토스증권.toString() : "",
    유안타: manualBalances.유안타 > 0 ? manualBalances.유안타.toString() : "",
    카카오페이증권: manualBalances.카카오페이증권 > 0 ? manualBalances.카카오페이증권.toString() : "",
    네이버페이: manualBalances.네이버페이 > 0 ? manualBalances.네이버페이.toString() : "",
    카카오페이머니: manualBalances.카카오페이머니 > 0 ? manualBalances.카카오페이머니.toString() : "",
  });
  const [manualSaved, setManualSaved] = useState(false);

  const [selectedBank, setSelectedBank] = useState("shinhan");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    setResult(null);

    try {
      let totalParsed = 0;
      for (const file of files) {
        const { transactions: parsed, balance } = await loadCSVFile(file, selectedBank);
        const accountInfo = {
          id: selectedBank,
          bank: bankOptions.find((b) => b.key === selectedBank)?.label,
          type: selectedBank === "hyundai" ? "카드"
            : selectedBank === "woori" ? "저축"
              : "입출금",
          balance,
          accountNumber: "****-****-****",
        };
        addTransactions(parsed, accountInfo);
        totalParsed += parsed.length;
        setUploadedFiles((prev) => [...prev, { name: file.name, bank: selectedBank }]);
      }
      setResult({ success: true, count: totalParsed });
    } catch (err) {
      setResult({ success: false, message: "파일을 읽는 중 오류가 발생했어요." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSave = () => {
    setManualBalances({
      웰컴은행: parseInt(manualInputs.웰컴은행 || "0"),
      사이다뱅크: parseInt(manualInputs.사이다뱅크 || "0"),
      하나멤버스: parseInt(manualInputs.하나멤버스 || "0"),
      NH_CMA: parseInt(manualInputs.NH_CMA || "0"),
      NH_ISA: parseInt(manualInputs.NH_ISA || "0"),
      토스증권: parseInt(manualInputs.토스증권 || "0"),
      유안타: parseInt(manualInputs.유안타 || "0"),
      카카오페이증권: parseInt(manualInputs.카카오페이증권 || "0"),
      네이버페이: parseInt(manualInputs.네이버페이 || "0"),
      카카오페이머니: parseInt(manualInputs.카카오페이머니 || "0"),
    });
    setManualSaved(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* 상단 타이틀 */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Upload</h1>
        <p className="text-sm text-gray-400 mt-1">거래내역 CSV 파일 업로드</p>
      </div>

      {/* 현재 모드 표시 배너 */}
      <div className={`rounded-2xl px-5 py-4 border ${isDemoMode
          ? "bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900"
          : "bg-lime-50 dark:bg-lime-950 border-lime-100 dark:border-lime-900"
        }`}>
        <p className={`text-sm font-medium ${isDemoMode ? "text-amber-700 dark:text-amber-400" : "text-lime-700 dark:text-lime-400"}`}>
          {isDemoMode ? "Demo Mode" : "실제 데이터 모드"}
        </p>
        <p className={`text-xs mt-1 ${isDemoMode ? "text-amber-600 dark:text-amber-500" : "text-lime-600 dark:text-lime-500"}`}>
          {isDemoMode
            ? "현재 더미 데이터로 동작 중이에요. CSV를 업로드하면 실제 데이터로 전환됩니다."
            : `총 ${transactions.length}건의 거래내역이 로드되었어요.`
          }
        </p>
      </div>

      {/* 은행/카드 CSV 업로드 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">은행 · 카드 거래내역</p>

        <div className="flex gap-2 flex-wrap">
          {bankOptions.map((bank) => (
            <button
              key={bank.key}
              onClick={() => bank.available && setSelectedBank(bank.key)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium border transition-colors
                ${!bank.available
                  ? "border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : selectedBank === bank.key
                    ? "bg-gray-950 dark:bg-lime-400 text-white dark:text-gray-950 border-transparent"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400"
                }
              `}
            >
              {bank.label}
              {!bank.available && <span className="ml-1 text-xs">(준비중)</span>}
            </button>
          ))}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-1">
            {uploadedFiles.map((f, i) => (
              <p key={i} className="text-xs text-lime-600 dark:text-lime-400">
                ✓ {f.name} ({bankOptions.find((b) => b.key === f.bank)?.label})
              </p>
            ))}
          </div>
        )}

        {result && (
          <p className={`text-xs font-medium ${result.success ? "text-lime-600 dark:text-lime-400" : "text-rose-500"}`}>
            {result.success ? `✓ ${result.count}건의 거래내역을 불러왔어요.` : result.message}
          </p>
        )}

        <label className="cursor-pointer inline-block">
          <input type="file" accept=".csv,.txt" multiple className="hidden" onChange={handleFileChange} disabled={isLoading} />
          <span className={`
            text-xs font-medium px-4 py-2 rounded-xl border transition-colors inline-block
            ${isLoading
              ? "border-gray-200 text-gray-400 cursor-wait"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400"
            }
          `}>
            {isLoading ? "파일 읽는 중..." : "파일 선택"}
          </span>
        </label>
      </div>

      {/* 수동 잔고 입력 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-5">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">수동 잔고 입력</p>
          <p className="text-xs text-gray-400 mt-0.5">CSV 연동이 안 되는 계좌는 직접 입력해주세요</p>
        </div>

        {/* 은행 */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">은행</p>
          {[["웰컴은행", "웰컴은행"], ["사이다뱅크", "사이다뱅크"], ["하나멤버스", "하나멤버스"]].map(([key, label]) => (
            <div key={key} className="flex items-center gap-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 w-28">{label}</p>
              <input
                type="number"
                placeholder="잔액 입력"
                value={manualInputs[key]}
                onChange={(e) => setManualInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
              />
              <span className="text-sm text-gray-400">원</span>
            </div>
          ))}
        </div>

        {/* 투자 예수금 */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">투자 예수금</p>
          {[
            ["NH_CMA", "NH CMA"],
            ["NH_ISA", "NH ISA"],
            ["토스증권", "토스증권"],
            ["유안타", "유안타"],
            ["카카오페이증권", "카카오페이 증권"],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 w-28">{label}</p>
              <input
                type="number"
                placeholder="예수금 입력"
                value={manualInputs[key]}
                onChange={(e) => setManualInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
              />
              <span className="text-sm text-gray-400">원</span>
            </div>
          ))}
        </div>

        {/* 페이 */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">페이</p>
          {[
            ["네이버페이", "네이버페이"],
            ["카카오페이머니", "카카오페이 머니"],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 w-28">{label}</p>
              <input
                type="number"
                placeholder="잔액 입력"
                value={manualInputs[key]}
                onChange={(e) => setManualInputs((prev) => ({ ...prev, [key]: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
              />
              <span className="text-sm text-gray-400">원</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleManualSave}
          className="text-xs font-medium px-4 py-2.5 rounded-xl bg-gray-950 dark:bg-lime-400 text-white dark:text-gray-950 transition-colors"
        >
          {manualSaved ? "✓ 저장됨" : "저장"}
        </button>
      </div>

      {/* 이번 달 지출 목표 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">이번 달 지출 목표</p>
          <p className="text-xs text-gray-400 mt-0.5">설정한 목표를 넘기면 Dashboard에서 빨간색으로 표시돼요</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="예: 500000"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-gray-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400"
          />
          <span className="text-sm text-gray-400">원</span>
          <button
            onClick={() => setMonthlyGoal(parseInt(goalInput.replace(/,/g, "") || "0"))}
            className="text-xs font-medium px-4 py-2.5 rounded-xl bg-gray-950 dark:bg-lime-400 text-white dark:text-gray-950 transition-colors"
          >
            저장
          </button>
        </div>
        {monthlyGoal > 0 && (
          <p className="text-xs text-gray-400">
            현재 목표: <span className="text-gray-700 dark:text-gray-200 font-medium">{monthlyGoal.toLocaleString("ko-KR")}원</span>
          </p>
        )}
      </div>

      {/* 더미 데이터로 초기화 */}
      {!isDemoMode && (
        <button onClick={resetToDemo} className="text-xs text-gray-400 hover:text-rose-500 transition-colors">
          더미 데이터로 초기화
        </button>
      )}

    </div>
  );
}

export default Upload;