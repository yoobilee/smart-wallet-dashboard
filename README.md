# 💰 Smart Wallet Dashboard

개인 자산을 한눈에 관리하는 대시보드입니다.

## 🛠 기술 스택

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square&logo=recharts&logoColor=white)

> 백엔드(Node.js/Express, CODEF API 연동)는 AI의 도움을 받아 구현했습니다.

## 🔗 배포

- **프론트엔드**: [Vercel](https://smart-wallet-dashboard-omega.vercel.app)
- **백엔드**: [Render](https://smart-wallet-dashboard-server.onrender.com)

> ⚠️ 백엔드는 Render 무료 플랜으로 운영 중입니다. 15분 이상 요청이 없으면 슬립 모드로 전환되어 첫 요청 시 50초 이상 지연될 수 있습니다.

## ✨ 주요 기능

- 📊 **Dashboard** - 총 자산(가용/저축/투자 분리), 이번 달 수입/지출, 월별 추이 차트, 지출 목표 게이지
- 🏦 **Accounts** - 은행/저축/투자/카드/페이 계좌 통합 관리
- 📋 **Transactions** - 카테고리 자동 분류, 날짜 범위/수입출/카테고리 필터
- 📈 **Investments** - 실시간 주식 시세 + 환율 변환, 시장 지표 티커 배너
- 🔔 **Subscriptions** - 구독 서비스 캘린더, 결제일 도트 표시, 다국가 통화 + 환율 자동 변환
- 📤 **Upload** - CSV 업로드 + CODEF API 자동 연동 + 수동 잔고 입력

## 🏦 지원 CSV 파일

| 기관 | 형식 | 계좌 타입 |
|---|---|---|
| 카카오뱅크 | txt (공백 구분) | 입출금/저축 선택 |
| 토스뱅크 | CSV | 입출금/저축 선택 |
| 카카오페이 | CSV | - |
| 우리은행 | CSV | 입출금/저축 선택 |
| 케이뱅크 | CSV | 입출금/저축 선택 |

## 🤖 CODEF API 자동 연동

| 기관 | 연동 항목 | 상태 |
|---|---|---|
| 신한은행 | 잔액 + 거래내역 | ✅ 연동 완료 |
| 현대카드 | 승인내역 | ✅ 연동 완료 |
| 카카오뱅크 | - | ❌ 간편인증(카카오톡) 방식으로 CODEF 미지원 |
| 토스뱅크 | - | ❌ 앱 전용 서비스로 ID/PW 로그인 불가 |
| 케이뱅크 | - | ❌ 2023년 3월 개인뱅킹 웹 서비스 종료로 CODEF 지원 중단 |
| NH투자증권 | - | ❌ 공동인증서 필수 + Open API가 Windows 전용 DLL 기반 |

## 🗺 로드맵

- [x] 더미 데이터 기반 대시보드 UI
- [x] 다크모드 토글
- [x] CSV 업로드 및 파싱 (카카오뱅크, 토스뱅크, 카카오페이, 우리은행, 케이뱅크)
- [x] 카테고리 자동 분류 및 지출이체 구분
- [x] 다계좌 연동 및 실제 잔액 반영
- [x] 가용/저축/투자 자산 분리
- [x] 계좌 타입 선택 (입출금/저축)
- [x] 투자 페이지 - Yahoo Finance 실시간 시세 연동 (한국/미국 주식)
- [x] 시장 지표 티커 배너 (KOSPI, KOSDAQ, NASDAQ, S&P500, USD/KRW)
- [x] 할부 처리 자동 계산
- [x] 투자 계좌 예수금 통합
- [x] 수동 잔고 입력 기능 (은행/투자 예수금/페이)
- [x] 이번 달 지출 목표 게이지
- [x] Transactions 날짜 범위/카테고리/수입출 필터
- [x] 백엔드 서버 (Node.js + Express)
- [x] CODEF API 신한은행 자동 연동
- [x] CODEF API 현대카드 자동 연동
- [x] 앱 시작 시 CODEF 자동 갱신
- [x] 월별 수입/지출 추이 차트
- [x] 구독 관리 페이지 (캘린더, 다국가 통화, 결제 주기)
- [x] 다크모드 전환 transition 개선
- [x] Render 백엔드 배포
- [x] Vercel 프론트엔드 배포
- [x] 더미 데이터 갱신
- [x] Accounts 페이지 파비콘 추가
- [x] Sidebar 모드 표시 개선
- [x] 코드 리팩토링 (constants.js, utils.js 분리)
- [x] Transactions 날짜 필터 버그 수정
- [x] CODEF 연동 중 버튼 비활성화 처리
- [ ] 네이버페이/카카오페이 거래내역 자동 동기화 (현실적 제약으로 보류)

## 👤 Developer

Developed by **yoobi lee**