# 💳 Smart Wallet Dashboard

개인 자산을 한눈에 관리하는 웹 기반 금융 대시보드

## 📌 프로젝트 소개

토스, 뱅크샐러드 같은 자산관리 서비스는 모바일 전용이 대부분입니다.
Smart Wallet Dashboard는 **PC 웹에서 미니멀하게 자산을 확인**할 수 있는 개인용 금융 대시보드입니다.

## ✨ 주요 기능

- **Overview** — 총 자산, 가용 자산 / 투자 자산 시각적 분리, 이번 달 수입·지출 요약
- **Accounts** — 은행 계좌, 투자 계좌, 카드 목록 및 잔액 확인
- **Transactions** — 전체 거래 내역, 카테고리 필터 및 검색
- **Upload** — CSV 파일 업로드로 거래 내역 연동 (Phase 2: CODEF API 실시간 연동 예정)

## 🛠 기술 스택

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Yahoo Finance](https://img.shields.io/badge/Yahoo%20Finance-6001D2?style=for-the-badge&logo=yahoo&logoColor=white)

## 🚀 로컬 실행

```bash
npm install
npm run dev
```

## 📂 프로젝트 구조

| 경로 | 설명 |
|---|---|
| `src/components/` | 재사용 UI 컴포넌트 (Sidebar 등) |
| `src/pages/` | 각 페이지 (Dashboard, Accounts, Transactions, Upload) |
| `src/data/` | 더미 데이터 |
| `src/assets/` | 이미지 등 정적 파일 |

## 🗺 로드맵

- [x] 더미 데이터 기반 대시보드 UI
- [x] 지출 카테고리 도넛 차트
- [x] 다크모드 토글
- [x] CSV 업로드 및 파싱 (신한은행, 카카오뱅크, 토스뱅크, 현대카드, 카카오페이)
- [x] 카테고리 자동 분류 및 지출이체 구분
- [x] 다계좌 연동 및 실제 잔액 반영
- [x] 투자 페이지 - Yahoo Finance 실시간 시세 연동
- [x] 할부 처리 자동 계산
- [x] 투자 계좌 예수금 연동
- [x] 이번 달 지출 목표 게이지
- [x] Transactions 필터/정렬/검색 개선
- [ ] 우리은행 파서 추가
- [ ] 수동 잔고 입력 기능
- [ ] CODEF API 실시간 계좌 연동
- [ ] 백엔드 서버 추가 (Node.js)
- [ ] 한국투자증권 API 주식 자동 동기화

---

Developed by [Yoobi Lee](https://github.com/yoobilee)