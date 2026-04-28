// =============================================
// Upload 페이지 - CSV 파일 업로드
// 은행/카드/증권 거래내역 CSV를 업로드해서
// 대시보드 데이터로 사용
// Phase 2에서 CODEF 실시간 연동으로 교체 예정
// =============================================

import { useState } from "react";

// 업로드 가능한 파일 종류 목록
const uploadTypes = [
  {
    key: "bank",
    label: "은행 거래내역",
    description: "입출금 내역 CSV",
    accent: "emerald",
  },
  {
    key: "card",
    label: "카드 사용내역",
    description: "카드 승인내역 CSV",
    accent: "rose",
  },
  {
    key: "investment",
    label: "증권 거래내역",
    description: "매수/매도 내역 CSV",
    accent: "blue",
  },
];

function Upload() {
  // 각 타입별 업로드된 파일 이름 저장
  // { bank: "파일명.csv", card: null, investment: null } 형태
  const [uploadedFiles, setUploadedFiles] = useState({
    bank: null,
    card: null,
    investment: null,
  });

  // 파일 선택 시 실행되는 함수
  const handleFileChange = (key, e) => {
    const file = e.target.files[0];  // 선택된 첫 번째 파일
    if (file) {
      // 해당 key의 파일 이름만 업데이트 (나머지는 유지)
      setUploadedFiles((prev) => ({ ...prev, [key]: file.name }));
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* ── 상단 타이틀 ── */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Upload</h1>
        <p className="text-sm text-gray-400 mt-1">거래내역 CSV 파일 업로드</p>
      </div>

      {/* ── 안내 배너 ── */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
        <p className="text-sm font-medium text-amber-700">Demo Mode</p>
        <p className="text-xs text-amber-600 mt-1">
          현재 더미 데이터로 동작 중이에요. CSV를 업로드하면 실제 데이터로 전환됩니다.
        </p>
      </div>

      {/* ── 업로드 카드 목록 ── */}
      <div className="space-y-4">
        {uploadTypes.map((type) => (
          <div
            key={type.key}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between"
          >
            {/* 왼쪽 - 설명 */}
            <div>
              <p className="text-sm font-semibold text-gray-800">{type.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{type.description}</p>
              {/* 업로드된 파일명 표시 */}
              {uploadedFiles[type.key] && (
                <p className="text-xs text-lime-600 mt-1">
                  ✓ {uploadedFiles[type.key]}
                </p>
              )}
            </div>

            {/* 오른쪽 - 업로드 버튼 */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                className="hidden"  // 실제 input은 숨기고 label로 클릭 유도
                onChange={(e) => handleFileChange(type.key, e)}
              />
              <span className={`
                text-xs font-medium px-4 py-2 rounded-xl border transition-colors
                ${uploadedFiles[type.key]
                  ? "border-lime-200 text-lime-600 bg-lime-50"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
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