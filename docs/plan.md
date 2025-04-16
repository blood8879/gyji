주어진 PRD, IA, USECASE 문서를 종합적으로 분석해 본 결과, 이 Expo 앱을 효율적으로 개발하기 위한 최소한의 UI 컴포넌트는 다음과 같습니다:

## 핵심 UI 컴포넌트 계획

### 1. **BaseLayout**
- 목적: 모든 화면의 기본 레이아웃을 제공
- 특징:
  - 상태바 처리
  - 안전 영역(SafeArea) 관리
  - 다크/라이트 모드 지원

### 2. **Card** [✓]
- 목적: 레시피, 양조일지, 시음회 등 모든 항목을 표시하는 통일된 카드 컴포넌트
- 특징:
  - 그림자, 테두리, 모서리 둥글기(border-radius) 일관성 유지
  - 다양한 크기 옵션(small, medium, large)
  - 터치 가능 여부(TouchableOpacity 포함 여부)

### 3. **Button** [✓]
- 목적: 앱 전체에서 사용할 통일된 버튼 디자인
- 변형:
  - Primary: 주요 행동(저장, 등록 등)
  - Secondary: 보조 행동
  - Text: 텍스트만 있는 버튼
  - Icon: 아이콘만 있는 버튼
  - IconText: 아이콘과 텍스트가 함께 있는 버튼

### 4. **Input** [✓]
- 목적: 다양한 입력 필드 통합 관리
- 변형:
  - TextInput: 일반 텍스트 입력
  - NumberInput: 숫자 입력(재료량, 도수 계산용)
  - MultilineInput: 여러 줄 입력(메모, 설명 등)
  - 에러 메시지 표시 지원

### 5. **Badge**
- 목적: 레시피 종류(막걸리, 맥주, 와인 등), 상태(공개/비공개) 등을 시각적으로 표시
- 특징:
  - 각 종류별 색상 정의
  - 아이콘 포함 옵션
  - 작은 사이즈로 간결하게 표시

### 6. **StageCard**
- 목적: 양조 단계를 표시하기 위한 특별 카드
- 특징:
  - 단계 번호 강조
  - 선택/비선택 상태 시각적 표현
  - 가로 스크롤 또는 그리드 레이아웃 지원

### 7. **ImagePicker**
- 목적: 사진 촬영/갤러리 선택을 위한 통합 컴포넌트
- 특징:
  - 카메라 접근 및 갤러리 접근 버튼
  - 사진 미리보기 및 삭제 기능
  - 업로드 상태 표시(로딩)

### 8. **Modal**
- 목적: 알림, 확인, 에러 등을 표시하는 모달 창
- 변형:
  - AlertModal: 단순 알림
  - ConfirmModal: 확인/취소 버튼 포함
  - FormModal: 입력 필드 포함

### 9. **ProgressBar**
- 목적: 발효 진행도, 시음회 참가자 모집 상황 등을 시각화
- 특징:
  - 퍼센트 표시
  - 색상 커스터마이징 지원
  - 애니메이션 효과

### 10. **Header** [✓]
- 목적: 각 화면 상단의 일관된 헤더 제공 (FormHeader 컴포넌트로 구현됨)
- 특징:
  - 뒤로가기 버튼
  - 제목
  - 우측 액션 버튼(설정, 공유 등)
  - 그라데이션 배경 옵션

이러한 컴포넌트들을 개발하면 PRD와 USECASE에서 명시된 주요 기능(레시피 관리, 양조일지 기록, 시음회 관리 등)을 효율적으로 구현할 수 있으며, UI의 일관성을 유지하고 코드 재사용성을 높일 수 있습니다. 또한 이 컴포넌트들은 모두 다크모드와 라이트모드를 지원하도록 설계하여 사용자 경험을 향상시킬 수 있습니다.

# 컴포넌트 구성과 페이지 구조 및 구현 접근 방식

## 컴포넌트 조직화 (Component Organization)

### 1. 현재 구현된 컴포넌트 구조

```
/components
  /ui                # 핵심 UI 원자 컴포넌트
    Button.tsx [✓]   # 다양한 스타일의 버튼(Primary, Secondary, Text, Icon)
    Input.tsx [✓]    # 텍스트/숫자 입력 필드, 에러 처리
    Card.tsx [✓]     # 레시피/양조일지/시음회 카드 (재사용성 높음)
    IconSymbol.tsx [✓] # 아이콘 심볼 컴포넌트
    TabBarBackground.tsx [✓] # 탭 바 배경 컴포넌트
    
  /recipe            # 레시피 특화 컴포넌트
    FormHeader.tsx [✓] # 폼 상단 헤더 (뒤로가기, 제목, 저장 버튼)
    BasicInfo.tsx [✓]  # 레시피 기본 정보 입력 영역
    IngredientsForm.tsx # 재료 입력 폼 (개발 중)
    StepsForm.tsx     # 단계별 과정 입력 폼
```

### 2. 추가 필요한 컴포넌트

```
/components
  /ui
    Badge.tsx        # 상태 표시 뱃지 (공개/비공개, 주종 등)
    Modal.tsx        # 알림, 확인 모달
    ProgressBar.tsx  # 진행 상태 표시바
    
  /common            # 공통 복합 컴포넌트
    Header.tsx       # 페이지 상단 헤더 (일반 화면용)
    ImagePicker.tsx  # 사진 촬영/갤러리 선택 통합
    
  /auth              # 인증 관련 컴포넌트
    LoginForm.tsx    # 로그인 폼
    RegisterForm.tsx # 회원가입 폼
    
  /recipe            # 레시피 특화 컴포넌트
    RecipeCard.tsx   # 레시피 목록용 카드
    AlcoholCalculator.tsx # 도수 계산 컴포넌트
    
  /journal           # 양조일지 특화 컴포넌트
    JournalCard.tsx  # 양조일지 목록용 카드
    PhotoGallery.tsx # 사진 갤러리 (슬라이더)
    StageIndicator.tsx # 양조 단계 표시
    
  /event             # 시음회 특화 컴포넌트
    EventCard.tsx    # 시음회 목록용 카드
    ParticipantList.tsx # 참가자 목록
    ParticipantCounter.tsx # 참가자 수 카운터
    
  /layout            # 레이아웃 컴포넌트
    BaseLayout.tsx   # 모든 페이지 공통 레이아웃
    
  /hooks             # 커스텀 훅 (최소 필수)
    useAuth.tsx      # 인증 관련 로직
    useForm.tsx      # 폼 처리 로직
    useImagePicker.tsx # 이미지 선택/업로드 로직
    useRecipe.tsx    # 레시피 관련 로직
```

### 3. 레시피 생성 화면 필요 컴포넌트
현재 레시피 생성 화면(`app/recipes/create.tsx`)을 위해 우선적으로 개발이 필요한 컴포넌트:
- [✓] FormHeader.tsx - 완료
- [✓] BasicInfo.tsx - 완료
- [✓] IngredientsForm.tsx - 완료
- [✓] StepsForm.tsx - 완료

### 4. 최소 컴포넌트의 세부 구현 사항

#### A. 인증/시작
- [✓] **로그인**: 이메일/비밀번호 입력, 소셜 로그인(구글, 카카오), 에러 처리
- **AdultVerifier**: 성인인증(본인인증) 프로세스, 결과 처리

#### B. 레시피 관련
- **RecipeCard**: 이름, 종류(Badge), 간략 설명, 공개 여부 표시
- [✓] **BasicInfo**: 제목, 설명, 카테고리, 공개/비공개 설정
- [✓] **IngredientsForm**: 재료명, 양, 단위 입력(추가/삭제 기능)
- [✓] **StepsForm**: 단계별 과정 추가/수정/삭제 (번호 자동 부여)

#### C. 양조일지 관련
- **JournalCard**: 일자, 대표 사진, 현재 단계 표시
- **PhotoGallery**: 사진 여러 장 슬라이드, 추가 기능
- **StageIndicator**: 현재 어떤 단계인지 시각적 표시(진행 바 등)

#### D. 시음회 관련
- **EventCard**: 모임명, 일시, 장소, 참가자 수/목표 수 표시
- **ParticipantList**: 참가자 목록(아바타), 참가 신청 버튼
- **ParticipantCounter**: 인원 표시, ProgressBar 활용(10/20명)

### 5. Supabase 데이터 모델 및 인증 [✓]
- [✓] `Recipe`: 레시피 기본 정보 모델
- [✓] `Ingredient`: 재료 정보 모델
- [✓] `Step`: 단계별 과정 모델
- [✓] `Authentication`: Supabase 인증 (소셜 로그인)

# 컴포넌트 구성과 페이지 구조 및 구현 접근 방식

## 컴포넌트 조직화 (Component Organization)

### 1. 최소 필수 컴포넌트 구조

```
/components
  /core              # 핵심 UI 원자 컴포넌트
    Button.tsx       # 다양한 스타일의 버튼(Primary, Secondary, Text, Icon)
    Input.tsx        # 텍스트/숫자 입력 필드, 에러 처리
    Typography.tsx   # 텍스트 스타일 (제목, 본문, 라벨 등)
    Colors.ts        # 색상 상수, 테마 정의
    Spacing.ts       # 간격, 여백 상수 정의
    
  /common            # 공통 복합 컴포넌트
    Card.tsx         # 레시피/양조일지/시음회 카드 (재사용성 높음)
    Header.tsx       # 페이지 상단 헤더 (뒤로가기, 제목, 액션 버튼)
    Badge.tsx        # 상태 표시 뱃지 (공개/비공개, 주종 등)
    Modal.tsx        # 알림, 확인 모달
    ImagePicker.tsx  # 사진 촬영/갤러리 선택 통합
    
  /auth              # 인증 관련 컴포넌트
    LoginForm.tsx    # 로그인 폼
    RegisterForm.tsx # 회원가입 폼
    AdultVerifier.tsx # 성인인증 관련 컴포넌트
    
  /recipe            # 레시피 특화 컴포넌트
    RecipeCard.tsx   # 레시피 목록용 카드
    IngredientInput.tsx # 재료 입력 전용 컴포넌트
    StepEditor.tsx   # 단계별 과정 편집기
    AlcoholCalculator.tsx # 도수 계산 컴포넌트
    
  /journal           # 양조일지 특화 컴포넌트
    JournalCard.tsx  # 양조일지 목록용 카드
    PhotoGallery.tsx # 사진 갤러리 (슬라이더)
    StageIndicator.tsx # 양조 단계 표시
    
  /event             # 시음회 특화 컴포넌트
    EventCard.tsx    # 시음회 목록용 카드
    ParticipantList.tsx # 참가자 목록
    ParticipantCounter.tsx # 참가자 수 카운터
    
  /layout            # 레이아웃 컴포넌트
    BaseLayout.tsx   # 모든 페이지 공통 레이아웃
    SafeAreaView.tsx # 안전 영역 처리 (노치, 홈버튼 등)
    
  /hooks             # 커스텀 훅 (최소 필수)
    useAuth.tsx      # 인증 관련 로직
    useForm.tsx      # 폼 처리 로직
    useImagePicker.tsx # 이미지 선택/업로드 로직
```

### 2. 최소 컴포넌트의 세부 구현 사항

#### A. 인증/시작
- **LoginForm**: 이메일/비밀번호 입력, 로그인 버튼, 에러 처리
- **AdultVerifier**: 성인인증(본인인증) 프로세스, 결과 처리

#### B. 레시피 관련
- **RecipeCard**: 이름, 종류(Badge), 간략 설명, 공개 여부 표시
- **IngredientInput**: 재료명, 양, 단위 입력(추가/삭제 기능)
- **StepEditor**: 단계별 과정 추가/수정/삭제 (번호 자동 부여)

#### C. 양조일지 관련
- **JournalCard**: 일자, 대표 사진, 현재 단계 표시
- **PhotoGallery**: 사진 여러 장 슬라이드, 추가 기능
- **StageIndicator**: 현재 어떤 단계인지 시각적 표시(진행 바 등)

#### D. 시음회 관련
- **EventCard**: 모임명, 일시, 장소, 참가자 수/목표 수 표시
- **ParticipantList**: 참가자 목록(아바타), 참가 신청 버튼
- **ParticipantCounter**: 인원 표시, ProgressBar 활용(10/20명)

### 3. 공통 스타일/테마 정의

#### A. 색상 시스템
- **기본 색상**: primary, secondary, background, text, error
- **의미 색상**: success, warning, info
- **주종별 색상**: 막걸리(쌀색), 맥주(황금색), 와인(자주색) 등

#### B. 타이포그래피
- **제목(Heading)**: 화면 제목, 섹션 제목(크기별 3단계)
- **본문(Body)**: 기본 텍스트, 강조 텍스트, 작은 텍스트
- **라벨(Label)**: 입력 필드, 버튼 등의 라벨

#### C. 아이콘 세트
- 최소 필수 아이콘: 홈, 추가, 카메라, 갤러리, 설정, 공유, 좋아요 등

### 4. 페이지별 컴포넌트 사용 예시

#### 레시피 목록 페이지
```jsx
<BaseLayout>
  <Header title="레시피 목록" rightAction={<Button iconOnly="plus" />} />
  <FlatList
    data={recipes}
    renderItem={({item}) => <RecipeCard recipe={item} />}
    keyExtractor={item => item.id}
  />
</BaseLayout>
```

#### 양조일지 작성 페이지
```jsx
<BaseLayout>
  <Header title="새 양조일지" />
  <Form>
    <Input label="제목" />
    <ImagePicker multiple />
    <DatePicker label="기록 일자" />
    <StageIndicator currentStage={2} totalStages={5} />
    <Input label="메모" multiline />
    <Button primary>저장하기</Button>
  </Form>
</BaseLayout>
```

이상의 컴포넌트 설계는 최소한의 작업량으로 PRD와 USECASE에 명시된 주요 기능을 구현하되, 확장성과 재사용성을 고려한 모듈화된 접근 방식입니다. 실제 개발 과정에서는 이 구조를 기반으로 컴포넌트를 점진적으로 구체화하고 필요에 따라 세분화할 수 있습니다.

## 페이지 구조 (Page Structure)

### 1. 기본 페이지 구성
```
/app                 # Expo Router 기반 구조
  /_layout.tsx       # 루트 레이아웃
  /index.tsx         # 앱 진입점 (로그인 상태에 따라 홈/로그인 리다이렉트)
  /login.tsx         # 로그인 페이지
  /register.tsx      # 회원가입 페이지
  /adult-verification.tsx # 성인인증 페이지
  /recipes         # 레시피 관련 페이지
      /index.tsx     # 레시피 목록
      /[id].tsx      # 레시피 상세
      /create.tsx    # 레시피 생성/편집
    /journals        # 양조일지 관련 페이지
      /index.tsx     # 양조일지 목록
      /[id].tsx      # 양조일지 상세
      /create.tsx    # 양조일지 작성
    /events          # 시음회 관련 페이지
      /index.tsx     # 시음회 목록
      /[id].tsx      # 시음회 상세
      /create.tsx    # 시음회 생성
    /profile         # 프로필 관련 페이지
      /index.tsx     # 프로필 메인
      /settings.tsx  # 설정
  /(tabs)            # 탭 내비게이션
    /_layout.tsx     # 탭 레이아웃
    /index.tsx       # 홈 탭
    
```

### 2. 페이지 간 관계
- **홈(대시보드)**: 4개 주요 기능(레시피, 양조일지, 시음회, 프로필)으로 연결
- **계층 구조**: 목록 → 상세 → 작성/편집
- **공통 요소**: 모든 페이지는 BaseLayout 사용, 헤더 포함

## 구현 접근 방식 (Implementation Approach)

### 1. 기술 스택
- **프레임워크**: React Native + Expo
- **타입 체크**: TypeScript
- **상태 관리**: 
  - 로컬 상태: React Hooks(useState, useReducer)
  - 전역 상태: Context API(가벼운 앱) 또는 Zustand(복잡해질 경우)
- **네비게이션**: Expo Router (파일 기반 라우팅)
- **스타일링**: 
  - NativeWind/TailwindCSS (빠른 개발)
  - React Native StyleSheet (성능 최적화 필요 시)
- **API 통신**: 
  - Supabase Client (주요 데이터 처리)
  - React Query (선택적, 데이터 캐싱/동기화)

### 2. 개발 전략
#### 단계적 구현:
1. **핵심 UI 컴포넌트 먼저 개발**
   - Button, Card, Input 등 기본 요소
   - 테마 시스템(색상, 폰트, 간격) 설정

2. **인증 플로우 구현**
   - 로그인/회원가입
   - 성인인증

3. **핵심 기능별 개발**
   - 레시피 → 양조일지 → 시음회 순으로 구현
   - 각 기능마다 목록-상세-작성 흐름 완성

4. **공통 기능 추가**
   - 이미지 업로드
   - 알림 설정
   - 사용자 프로필

#### 코드 재사용 전략:
- **커스텀 훅** 적극 활용:
  - `useRecipe`, `useJournal`, `useEvent` 등 비즈니스 로직 분리
  - `useImagePicker`, `useForm` 등 UI 로직 재사용

- **컴포넌트 합성 패턴** 사용:
  ```tsx
  <Card>
    <Card.Header>제목</Card.Header>
    <Card.Content>내용</Card.Content>
    <Card.Footer>
      <Button>확인</Button>
    </Card.Footer>
  </Card>
  ```

- **Props 체계화**:
  - 일관된 명명 규칙 (onPress, onChange 등)
  - 기본값 제공으로 사용성 증가

### 3. 성능 최적화 접근
- **React Native 최적화**:
  - `memo`, `useCallback`, `useMemo` 적절히 사용
  - 불필요한 렌더링 방지
  - FlatList 사용하여 큰 목록 최적화

- **이미지 최적화**:
  - 캐싱
  - 리사이징
  - 압축 적용

- **네트워크 요청 최적화**:
  - 데이터 캐싱
  - 페이지네이션
  - 오프라인 지원 고려

### 4. 테스트 전략
- **컴포넌트 테스트**: React Native Testing Library
- **E2E 테스트**: Detox (필요시)
- **스토리북** 도입 고려 (UI 컴포넌트 문서화)

이런 접근 방식을 통해 PRD 및 USECASE 문서에 정의된 요구사항을 효율적으로 구현하면서도, 확장 가능하고 유지보수하기 쉬운 코드베이스를 구축할 수 있습니다.
