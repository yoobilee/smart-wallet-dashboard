# 💰 Smart Wallet Dashboard

개인 자산을 한눈에 관리하는 대시보드입니다.

## 🛠 기술 스택

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)

> 백엔드(Node.js/Express, CODEF API 연동)는 AI의 도움을 받아 구현했습니다.

## ✨ 주요 기능

- 📊 대시보드 - 총 자산, 이번 달 수입/지출, 지출 목표 게이지
- 🏦 계좌 관리 - 은행/저축/투자/페이 계좌 통합 관리
- 📋 거래내역 - 카테고리 자동 분류, 필터/정렬/검색
- 📈 투자 - 실시간 주식 시세 + 환율 변환 (한국/미국 주식)
- 📤 업로드 - CSV 파일 업로드 + CODEF API 자동 연동 + 수동 잔고 입력

## 🏦 지원 CSV 파일

| 기관 | 형식 |
|---|---|
| 신한은행 | txt (공백 구분) |
| 카카오뱅크 | txt (공백 구분) |
| 토스뱅크 | CSV |
| 현대카드 | CSV |
| 카카오페이 | CSV |
| 우리은행 | CSV |
| 케이뱅크 | CSV |

## 🤖 CODEF API 자동 연동

| 기관 | 연동 항목 |
|---|---|
| 신한은행 | 잔액 + 거래내역 자동 동기화 |
| 현대카드 | 승인내역 자동 동기화 |

## 🗺 로드맵

- [x] 더미 데이터 기반 대시보드 UI
- [x] 지출 카테고리 도넛 차트 (이번 달 필터)
- [x] 다크모드 토글
- [x] CSV 업로드 및 파싱 (신한은행, 카카오뱅크, 토스뱅크, 현대카드, 카카오페이, 우리은행, 케이뱅크)
- [x] 카테고리 자동 분류 및 지출이체 구분
- [x] 다계좌 연동 및 실제 잔액 반영
- [x] 투자 페이지 - Yahoo Finance 실시간 시세 연동 (한국/미국 주식)
- [x] 할부 처리 자동 계산
- [x] 투자 계좌 예수금 통합
- [x] 수동 잔고 입력 기능 (은행/투자 예수금/페이)
- [x] 이번 달 지출 목표 게이지
- [x] Transactions 필터/정렬/검색 개선
- [x] Vercel 배포
- [x] 백엔드 서버 (Node.js + Express)
- [x] CODEF API 신한은행 자동 연동
- [x] CODEF API 현대카드 자동 연동
- [x] CODEF 날짜 자동화
- [ ] 카카오뱅크/토스뱅크 CODEF 연동 (웹서비스 미지원으로 보류)
- [ ] NH투자증권 연동
- [ ] 네이버페이/카카오페이 거래내역 자동 동기화