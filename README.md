# portfolio
📌 프로젝트 소개
이 프로젝트는 **Next.js 15 (React 19)**와 **Spring Boot 3.4.3 (Java 17)**을 기반으로
웹 프론트엔드와 백엔드가 완전히 분리된 구조의 웹 애플리케이션입니다.
RESTful API 기반의 백엔드 서버와 React 기반의 동적 UI를 활용하여 SPA + SSR 환경을 구현하였으며,
보안 및 인증에는 Spring Security와 JWT(Json Web Token) 기반 인증을 적용했습니다.

🚀 사용 기술 스택
💻 프론트엔드
Next.js 15.2.4 (React 19)

TypeScript

SPA + SSR 혼합 구조

Axios, SWR 등 사용 가능

🧰 백엔드
Spring Boot 3.4.3

Java 17

Spring WebFlux – 논블로킹 비동기 API 처리

Spring Security + JWT 인증

라이브러리: com.nimbusds:nimbus-jose-jwt

JPA & QueryDSL – 복잡한 쿼리 및 페이징 처리 최적화

MyBatis (사용했다면 명시)

MySQL Connector: mysql:mysql-connector-java

🔐 보안 및 인증
JWT 기반 사용자 인증 및 인가 처리

토큰 재발급 및 만료 처리 기능 포함

API 접근 권한 분리 (예: 관리자/일반 사용자)

🌐 주요 기능
사용자 로그인 및 회원가입

게시판/CRUD 기능 (예시)

관리자 전용 페이지

서버 사이드 렌더링 기반 검색엔진 최적화(SEO)

비동기 데이터 처리 및 캐싱 전략 적용
