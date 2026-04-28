// =============================================
// Upload 페이지 - CSV 파일 업로드
// 다크모드 적용
// =============================================

import { useState } from "react";

const uploadTypes = [
  { key: "bank",       label: "은행 거래내역", description: "입출금 내역 CSV"    },
  { key: "card",       label: "카드 사용내역", description: "카드 승인내역 CSV"  },
  { key: "investment", label: "증권 거래내역", description: "매수/매도 내역 CSV" },
];

function Upload() {
  const [uploadedFiles, setUploadedFiles] = useState({
    bank: null, card: null, investment: null,
  });

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [key]: file.name }));
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Upload</h1>
        <p className="text-sm text-gray-400 mt-1">거래내역 CSV 파일 업로드</p>
      </div>

      {/* 안내 배너 */}
      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 rounded-2xl px-5 py-4">
        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Demo Mode</p>
        <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
          현재 더미 데이터로 동작 중이에요. CSV를 업로드하면 실제 데이터로 전환됩니다.
        </p>
      </div>

      {/* 업로드 카드 목록 */}
      <div className="space-y-4">
        {uploadTypes.map((type) => (
          <div key={type.key} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{type.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{type.description}</p>
              {uploadedFiles[type.key] && (
                <p className="text-xs text-lime-600 mt-1">✓ {uploadedFiles[type.key]}</p>
              )}
            </div>
            <label className="cursor-pointer">
              <input type="file" accept=".csv" className="hidden" onChange={(e) => handleFileChange(type.key, e)} />
              <span className={`
                text-xs font-medium px-4 py-2 rounded-xl border transition-colors
                ${uploadedFiles[type.key]
                  ? "border-lime-200 text-lime-600 bg-lime-50 dark:bg-lime-950 dark:border-lime-900"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                }
              `}>
                {uploadedFiles[type.key] ? "재업로드" : "파일 선택"}
              </span>
            </label>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Upload;