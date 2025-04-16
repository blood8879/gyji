# 환경 설정 가이드

## 환경 변수 설정

이 프로젝트는 Supabase를 인증 및 데이터베이스 서비스로 사용합니다. 프로젝트를 실행하기 위해 다음 단계를 따라 환경 변수를 설정해주세요.

### 1. .env 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성하세요. 이 파일은 `.env.example` 파일을 복사하여 만들 수 있습니다:

```bash
cp .env.example .env
```

### 2. Supabase 프로젝트 정보 입력

Supabase 대시보드에서 프로젝트 URL과 API 키를 찾아 `.env` 파일에 입력하세요:

1. [Supabase 대시보드](https://app.supabase.io)에 로그인합니다.
2. 프로젝트를 선택합니다.
3. 프로젝트 설정 > API로 이동합니다.
4. "Project URL"과 "anon public" 키를 복사합니다.
5. `.env` 파일에 해당 값을 입력합니다:

```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
```

### 3. Expo 리디렉션 URL 설정

소셜 로그인을 위해 Expo 리디렉션 URL을 설정해야 합니다:

#### 개발 환경에서:

개발 환경에서는 로컬 IP 주소와 Expo 개발 서버 포트를 사용합니다.

1. 터미널에서 `expo start`를 실행하여 개발 서버를 시작합니다.
2. 콘솔에 출력된 로컬 URL을 확인합니다 (예: `exp://192.168.1.100:19000`).
3. URL 끝에 `/--/`를 추가하고 `.env` 파일에 입력합니다:

```
EXPO_REDIRECT_URL=exp://192.168.1.100:19000/--/
```

#### 프로덕션 환경에서:

배포된 앱에서는 딥 링크 URL 스키마를 사용합니다. `app.json`에 정의된 스키마를 확인하고 이를 리디렉션 URL로 사용하세요:

```
EXPO_REDIRECT_URL=your-scheme://
```

### 4. Supabase 소셜 로그인 설정

Supabase 대시보드에서 소셜 로그인 프로바이더를 설정해야 합니다:

1. Supabase 대시보드 > Authentication > Providers로 이동합니다.
2. 사용할 소셜 로그인 프로바이더(Google, Kakao)를 활성화합니다.
3. 각 프로바이더의 Client ID와 Secret을 입력합니다.
4. Redirect URL에 위에서 설정한 EXPO_REDIRECT_URL을 추가합니다.

## 앱 실행하기

환경 변수가 모두 설정된 후 다음 명령어로 앱을 실행할 수 있습니다:

```bash
npm start
# 또는
expo start
```

## 문제 해결

환경 변수 관련 문제가 발생할 경우:

1. 앱을 다시 시작하여 변경 사항이 적용되게 하세요.
2. 캐시를 지우고 다시 시도해보세요: `expo start -c`
3. 노드 모듈을 재설치해보세요: `rm -rf node_modules && npm install` 