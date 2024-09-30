# Cook Network Project

<details>
<summary>목차 바로가기</summary>
<div markdown="1">

1. [프로젝트 소개](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#프로젝트-소개)
2. [개발 기간](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#개발기간)
3. [프로젝트 구조](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#프로젝트-구조)
   - [프론트엔드 구조](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#프로트엔드-구조)
   - [백엔드 구조](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#백엔드-구조)
4. [주요 기능](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#주요기능)
5. [설치 및 설정](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#설치-및-실행)
6. [개발 모드 실행](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#개발-모드-실행)
7. [프로덕션 빌드 및 실행](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#프로덕션-빌드-및-실행)
8. [기술 스택](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#기술-스택)
9. [협업 가이드라인](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#협업-가이드라인)
10. [주의사항](https://github.com/JINSUKO/CookNetwork?tab=readme-ov-file#주의사항)


</div>
</details>

## 프로젝트 소개

 AI 기능 기반 레시피 공유 플랫폼입니다. 사용자들이 레시피를 쉽게 공유할 수 있고, ML 기능을 이용하여 음식 사진을 통해 유사한 레시피를 추천해주는 기능을 제공합니다.

## 개발 기간

 - 2024.07.03 - 2024.10.04
 - 주제 선정
 - 개발

## 프로젝트 구조

클라이언트-서버 아키텍처를 기반으로 구축되었습니다.

<details>
<summary>프로트엔드 구조</summary>
<div markdown="1">

1. 프론트:
- vite
- React.js
- react-bootstrap

2. 주요 컴포넌트:
   - 레이아웃 관련 컴포넌트
   - 데이터 표시 컴포넌트: 배너 슬라이드, 레시피 캐러셀, 검색 결과 표시 등
   - 사용자 인터페이스 컴포넌트: 검색 바, 사용자 정보 모달, 사용자 이름 수정 등

3. 페이지 컴포넌트:
   - 로그인/회원가입 페이지
   - 레시피 상세 페이지
   - 레시피 목록 페이지
   - 사용자 마이페이지
   - 채팅 모달 페이지

4. 상태 관리 및 API 통신:
   - Fetch API를 사용한 인터셉터 큐를 구현하여 토큰 인증 요청을 관리

</div>
</details>

<details>
<summary>백엔드 구조</summary>
<div markdown="1">

1. 서버:
- Node.js와 Express.js 프레임워크
- Python과 FastAPi를 사용하여 구현

2. 데이터베이스:
MariaDB: 주요 정보 관리
- 사용자 정보
- 레시피 정보
- 카테고리
- 재료
- 북마크
- 채팅 메시지

Redis Cloud:
- 로그인 토큰 정보 관리

Cloudinary:
- 이미지 파일 저장 및 제공

3. 주요 모듈:
   - 인증 관련 모듈: JWT 및 Redis Cloud를 이용한 유저 인증, Nodemailer 회원가입 인증
   - 채팅 모듈: socket.io 실시간 채팅, OpenAI와 LangChain API를 이용한 채팅 봇
   - 라우터 모듈: 서버 로직 API 구현
   - 이미지 관리 모듈: Cloudinary 서비스로 이미지 파일 관리

4. API 엔드포인트:
   - 사용자 관리: 회원가입, 로그인, 로그아웃, 유저정보 업데이트
   - 레시피 관리: 레시피 조회, 검색, 카테고리별 조회, 등록
   - 카테고리 관리: 카테고리 조회 및 사용자별 카테고리 설정

</div>
</details>

### 주요 기능

1. 로그인 사용자 인증 및 프로필 정보 관리
2. 실시간 채팅,FAQ 및 레시피 정보 AI 챗봇
3. 레시피 등록, 조회
4. 카테고리, 검색 기반 레시피 조회
5. 레시피 북마크

## 설치 및 설정

<details>
<summary>1. 저장소 클론:</summary>
<div markdown="1">

```
# 본인 깃허브로 프로젝트 Fork
git clone https://github.com/[본인 GitHub]/CookNetwork.git
cd ./CookNetwork
git checkout -b [개인 작업 branch 이름]
```

</div>
</details>

<details>
<summary>2. 의존성 설치:</summary>
<div markdown="1">

```
# server 와 client의 npm 의존성이 명렁어 하나로 모두 설치된다.
npm run install:all --force

# ai의 파이썬 라이브러리는 수동으로 설치해야함.
cd ./ai
pip install --no-cache-dir fastapi uvicorn
pip install --no-cache-dir python-dotenv langchain langchain-openai langchain-community faiss-cpu pydantic python-multipart
```

</div>
</details>

<details>
<summary>3. 환경변수 설정:</summary>
<div markdown="1">

```
CookNetwork
├── ai
│   └── .env
├── client
│   └── .env.local
├── .env
├── .env.gmail
└── .env.local

# ./ai/.env - 렝체인(LangChain)과 OpenAI 모델 사용을 위한 키 설정이 있습니다.
OPENAI_API_KEY=
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
LANGCHAIN_API_KEY=
LANGCHAIN_PROJECT=

# ./client/.env.local - API 요청을 위한 URL 주소가 있습니다.
VITE_HOST_IP=http://localhost:3000
VITE_AI_HOST_IP=http://127.0.0.1:3000

# ./server/.env - JWT 토큰 생성을 위한 키 설정이 있습니다.
SECRET_KEY_ACCESS=
SECRET_KEY_REFRESH=

# ./server/.env.local - 데이터 접속을 위한 API 키 설정이 있습니다.
SQL_HOST=
SQL_PORT=
SQL_USER=
SQL_PW=
SQL_DB=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=

#./server/.env.gmail - 이메일 전송을 위한 API 키 설정이 있습니다.
HOST_SERVICE=gmail
GMAIL_EMAIL=
GMAIL_PASSWORD=
```
   
</div>
</details>


## 개발 모드 실행 

- 이 명령어는 클라이언트(Vite 개발 서버)와 서버를 동시에 실행합니다.

```
npm run dev
```

## 프로덕션 빌드 및 실행

- 이 명령어는 클라이언트를 빌드하고 서버를 프로덕션 모드로 실행합니다.

```
npm run prod
```

## 기술 스택

- 프론트엔드: <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=black"> , <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black">, <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=black">
- 백엔드: <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=black">, <img src="https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=Node.js&logoColor=black">, <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=Express.js&logoColor=black">, <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=black">, <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=FastAPI&logoColor=black">
- 형상관리: <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=Git&logoColor=black">, <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=black">

## 협업 가이드라인

브랜치 전략:
- Fork와 Pull Request 으로 협업 진행.
- clone 후 각자 브랜치에서 작업 후 staging 브랜치로 Pull Request하여 반영.

## 주의사항

- `.env` 파일은 저장소에 포함되지 않습니다. 팀원들과 별도로 공유해야 합니다.
- `node_modules` 디렉토리는 `.gitignore`에 포함되어 있으므로, 클론 후 반드시 `npm install:all`을 실행해야 합니다.


Copyright (c) 2024 Cook Network 팀

이 프로젝트는 [코드랩아카데미](https://www.codelabit.co.kr/)의 교육 과정의 일환으로 개발되었습니다.
