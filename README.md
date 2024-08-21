# Cook Network Project

이 프로젝트는 사용자들이 레시피를 공유하고 소통할 수 있는 웹 플랫폼으로, 클라이언트-서버 아키텍처를 기반으로 구축되었습니다.

이 브랜치는 도커 배포용으로 환경변수 값이 적용된 브랜치 입니다.

## 프로젝트 구조

### 백엔드 구조

```

1. 서버: Node.js와 Express.js 프레임워크를 사용하여 구현되었습니다.

2. 데이터베이스: MariaDB를 사용하여 다음과 같은 주요 정보를 관리합니다:
   - 사용자 정보
   - 레시피 정보
   - 카테고리
   - 재료
   - 북마크
   - 채팅 메시지

3. 주요 모듈:
   - 인증 관련 모듈: 액세스 토큰과 리프레시 토큰을 생성하고 관리합니다.
   - 채팅 모듈: 실시간 채팅 기능을 지원합니다.
   - 라우터 모듈: 다양한 API 엔드포인트를 처리합니다.

4. API 엔드포인트:
   - 사용자 관리: 회원가입, 로그인, 로그아웃, 프로필 업데이트
   - 레시피 관리: 레시피 조회, 검색, 카테고리별 조회
   - 카테고리 관리: 카테고리 조회 및 사용자별 카테고리 설정

```

### 프론트엔드 구조

```

1. 프레임워크: React.js를 사용하여 구현되었습니다.

2. 주요 컴포넌트:
   - 레이아웃 관련 컴포넌트
   - 데이터 표시 컴포넌트: 배너 슬라이드, 레시피 캐러셀, 검색 결과 표시 등
   - 사용자 인터페이스 컴포넌트: 검색 바, 사용자 정보 모달, 사용자 이름 수정 등

3. 페이지 컴포넌트:
   - 메인 페이지
   - 로그인/회원가입 페이지
   - 레시피 상세 페이지
   - 레시피 목록 페이지
   - 사용자 마이페이지

4. 상태 관리 및 API 통신:
   - Fetch API를 사용한 인터셉터를 구현하여 인증 토큰 관리
```

### 주요 기능

```

1. 사용자 인증 및 프로필 관리
2. 실시간 채팅
3. 레시피 등록, 조회, 검색
4. 카테고리 기반 레시피 필터링
5. 레시피 북마크
6. 이미지 업로드 (레시피 및 프로필 이미지)

```

## 설치 및 설정

1. 저장소 클론:
   ```
   본인 깃허브로 프로젝틀 Fork
   git clone [fork로 가져간 본인 프로젝트 URL]
   cd CookNetwork
   git checkout -b [개인 작업 branch 이름]
   
   git add .
   git commit -m "작업 내용 설명"
   git push origin [개인 작업 branch 이름]

   git remote add upstream [원본 저장소 URL]
   git fetch upstream staging
   git rebase upstream/staging
   ```

2. 의존성 설치:
   ```
   npm run install:all --force
   ```

## 개발 모드 실행

```
npm run dev
```

이 명령어는 클라이언트(Vite 개발 서버)와 서버를 동시에 실행합니다.

## 프로덕션 빌드 및 실행

```
npm run prod
```

이 명령어는 클라이언트를 빌드하고 서버를 프로덕션 모드로 실행합니다.

## 주요 스크립트

- `npm run dev`: 개발 모드로 클라이언트와 서버 실행
- `npm run build`: 클라이언트 빌드
- `npm start`: 서버 실행
- `npm run prod`: 프로덕션 모드로 빌드 및 실행

## 기술 스택

- 프론트엔드: React, Vite
- 백엔드: Node.js, Express.js
- 기타: Concurrently (동시 스크립트 실행)

## 협업 가이드라인

1. 브랜치 전략: Fork와 Pull Request 으로 협업 진행. clone 후 각자 브랜치에서 작업 후 Pull Request 해주세요.
2. 코드 리뷰 프로세스: [코드 리뷰 프로세스 설명]
3. 커밋 메시지 컨벤션: [커밋 메시지 작성 규칙 설명]

## 주의사항

- `.env` 파일은 저장소에 포함되지 않습니다. 팀원들과 별도로 공유해야 합니다.
- `node_modules` 디렉토리는 `.gitignore`에 포함되어 있으므로, 클론 후 반드시 `npm install:all`을 실행해야 합니다.

## 문제 해결

- `.env`를 최상위폴더(COOKNETWORK)에 넣지 않을 경우 에러 발생
- `.env.local` 사용시 gitHUB에 올라가지 않습니다.
- `require('dotenv').config({ path: '.env.local' })` 사용

## 기여 방법

[프로젝트에 기여하는 방법 설명]

Copyright (c) 2024 Cook Network 팀

이 프로젝트는 [코드랩아카데미](https://www.codelabit.co.kr/)의 교육 과정의 일환으로 개발되었습니다.
