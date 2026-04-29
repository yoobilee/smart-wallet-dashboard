// =============================================
// Upload 페이지 - CSV 파일 업로드 및 투자 계좌 수동 입력
// =============================================

import { useState } from "react";
import { useData } from "../context/DataContext";

const bankOptions = [
  { key: "shinhan", label: "신한은행",  available: true  },
  { key: "kakao",   label: "카카오뱅크", available: true  },
  { key: "toss",    label: "토스뱅크",  available: true  },
  { key: "hyundai", label: "현대카드",  available: true  },
];

function Upload() {
  const { transactions, isDemoMode, loadCSVFile, addTransactions, resetToDemo } = useData();

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
          type: selectedBank === "hyundai" ? "카드" : "입출금",
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

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* 상단 타이틀 */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Upload</h1>
        <p className="text-sm text-gray-400 mt-1">거래내역 CSV 파일 업로드</p>
      </div>

      {/* 현재 모드 표시 배너 */}
      <div className={`rounded-2xl px-5 py-4 border ${
        isDemoMode
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

        {/* 은행 선택 */}
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

        {/* 업로드된 파일 목록 */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-1">
            {uploadedFiles.map((f, i) => (
              <p key={i} className="text-xs text-lime-600 dark:text-lime-400">
                ✓ {f.name} ({bankOptions.find((b) => b.key === f.bank)?.label})
              </p>
            ))}
          </div>
        )}

        {/* 파싱 결과 */}
        {result && (
          <p className={`text-xs font-medium ${result.success ? "text-lime-600 dark:text-lime-400" : "text-rose-500"}`}>
            {result.success ? `✓ ${result.count}건의 거래내역을 불러왔어요.` : result.message}
          </p>
        )}

        {/* 파일 선택 버튼 */}
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