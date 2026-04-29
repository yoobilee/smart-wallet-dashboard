// =============================================
// Upload 페이지 - CSV 파일 업로드 및 파싱
// 신한은행 CSV 형식 지원
// 여러 파일 업로드 시 자동으로 합쳐줌
// =============================================

import { useState } from "react";
import { useData } from "../context/DataContext";

const uploadTypes = [
  { key: "bank", label: "은행 거래내역", description: "신한은행 CSV (거래일자, 거래시간, 적요, 출금, 입금, 내용, 잔액, 거래점)" },
];

function Upload() {
  // DataContext에서 필요한 함수 가져오기
  const { transactions, isDemoMode, loadCSVFile, addTransactions, resetToDemo } = useData();

  // 업로드 상태 관리
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);  // 파싱 결과 메시지

  // 파일 선택 시 실행
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);  // 여러 파일 선택 가능
    if (files.length === 0) return;

    setIsLoading(true);
    setResult(null);

    try {
      let totalParsed = 0;

      // 선택된 파일들 순서대로 파싱
      for (const file of files) {
        const parsed = await loadCSVFile(file);
        addTransactions(parsed);
        totalParsed += parsed.length;
        setUploadedFiles((prev) => [...prev, file.name]);
      }

      // 파싱 결과 메시지
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

      {/* 업로드 카드 */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">신한은행 거래내역</p>
          <p className="text-xs text-gray-400 mt-0.5">여러 파일을 한꺼번에 선택하면 자동으로 합쳐줍니다</p>
        </div>

        {/* 업로드된 파일 목록 */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-1">
            {uploadedFiles.map((name, i) => (
              <p key={i} className="text-xs text-lime-600 dark:text-lime-400">✓ {name}</p>
            ))}
          </div>
        )}

        {/* 파싱 결과 메시지 */}
        {result && (
          <p className={`text-xs font-medium ${result.success ? "text-lime-600 dark:text-lime-400" : "text-rose-500"}`}>
            {result.success
              ? `✓ ${result.count}건의 거래내역을 불러왔어요.`
              : result.message
            }
          </p>
        )}

        {/* 파일 선택 버튼 */}
        <label className="cursor-pointer inline-block">
          <input
            type="file"
            accept=".csv,.txt"
            multiple  // 여러 파일 선택 가능
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <span className={`
            text-xs font-medium px-4 py-2 rounded-xl border transition-colors inline-block
            ${isLoading
              ? "border-gray-200 text-gray-400 cursor-wait"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
            }
          `}>
            {isLoading ? "파일 읽는 중..." : "CSV 파일 선택"}
          </span>
        </label>
      </div>

      {/* 더미 데이터로 초기화 버튼 */}
      {!isDemoMode && (
        <button
          onClick={resetToDemo}
          className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
        >
          더미 데이터로 초기화
        </button>
      )}

    </div>
  );
}

export default Upload;