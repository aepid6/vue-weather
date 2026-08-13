# SKALA Weather

SKALA Weather는 날씨 API를 요청해 도시별 현재 기온을 출력하고, Vue 3의 반응형 상태를 이용해 지도·검색·카드·상세 화면을 함께 갱신하는 날씨 서비스입니다.

기본적인 기온 조회에서 출발해 현재 위치 기반 날씨, 전국 기온 지도, 12시간 예보, 최고·최저기온 기반 옷차림 추천, 즐겨찾기와 시간대별 테마까지 확장했습니다.

## 주요 기술

- Vue 3 Composition API
- Vite
- Vue Router
- Pinia
- Axios
- Tailwind CSS
- PrimeVue
- OpenWeatherMap API
- Open-Meteo API
- GitHub Actions / GitHub Pages

## 추가 기능

### 최고·최저기온 기반 옷차림 추천

Open-Meteo에서 받은 오늘의 최고기온을 기준으로 반팔, 셔츠, 니트와 반바지·긴바지 조합을 선택합니다. 최저기온으로는 얇은 외투, 재킷 또는 코트가 필요한지 판단합니다.

의류 그래픽은 SVG 실루엣을 CSS 마스크로 렌더링합니다. 국내 데일리룩에 어울리는 색상 팔레트 중 하나를 무작위로 적용하며, 새로고침 버튼으로 다른 색상 조합을 선택할 수 있습니다.

### 전국 기온 지도

도시 상수에 저장된 위도와 경도를 한국 지도 SVG 영역의 상대 좌표로 변환해 마커를 배치합니다. 마커 색상은 현재 기온 구간에 따라 달라지며 현재 위치에 해당하는 도시는 크기와 테두리로 강조합니다.

도시 마커를 선택하면 지도 영역만 줄어들고 오른쪽에 상세 패널이 나타납니다. 패널에서는 현재 기온뿐 아니라 체감온도, 미세먼지와 산책 가능 여부도 확인할 수 있습니다.

### 12시간 기온 예보

Open-Meteo의 시간별 API를 추가로 연계해 총 12시간의 기온과 날씨 코드를 가져옵니다. 현재 관측 기온은 OpenWeatherMap 값을 사용하고, 예보 데이터는 선 그래프의 좌표로 정규화해 시간별 변화를 표현합니다.

각 시간에는 기온, 시각과 날씨 상태를 표시합니다. Detail 화면에서는 12시간 범위의 최저·최고기온을 기준으로 막대 높이를 정규화해 작은 기온 차이도 눈에 띄도록 구성했습니다.

### 즐겨찾기

Cities 카드의 즐겨찾기 버튼으로 도시를 추가하거나 제거할 수 있습니다. 즐겨찾기 목록에서는 현재 기온, 날씨, 1시간 전 대비 변화, 체감온도와 습도를 확인하고 도시 Detail 화면으로 바로 이동할 수 있습니다.

즐겨찾기는 Pinia에서 전역으로 관리하며 `localStorage`에 저장됩니다.

### 위치 기반 도시 정렬과 초성 검색

브라우저 Geolocation API로 현재 좌표를 가져오고 Haversine 방식으로 도시까지의 거리를 계산합니다. 위치 권한을 허용하지 않으면 서울을 기본 위치로 사용합니다.

도시 검색은 한글 이름과 초성 입력을 지원하며 추천 결과는 방향키와 Enter 키로 선택할 수 있습니다. 도시 목록은 거리순 또는 이름순으로 정렬할 수 있습니다.

### 대기질과 산책 지수

OpenWeatherMap Air Pollution API의 PM2.5 수치를 좋음, 보통, 나쁨, 매우 나쁨 범주로 변환합니다. 미세먼지와 체감온도를 함께 분석해 외출 환경을 판단하고 걷기, 달리기 또는 마스크 착용 애니메이션으로 표현합니다.

### GitHub Actions·Pages 기반 CI/CD

`main` 브랜치에 코드를 push하면 GitHub Actions가 자동으로 의존성을 설치하고 Vite 프로덕션 빌드를 수행합니다. 빌드 결과는 Pages artifact로 업로드한 뒤 GitHub Pages에 자동 배포합니다.

- GitHub Secret에 저장된 `WEATHER_API_KEY`를 빌드 환경변수로 전달합니다.
- `npm ci`로 lock file을 기준으로 동일한 의존성을 설치합니다.
- `npm run build`가 실패하면 배포 단계로 넘어가지 않도록 작업을 분리했습니다.
- GitHub Pages에서 도시 상세 주소로 직접 접속하거나 새로고침해도 Vue Router가 정상 작동하도록, 빌드된 index.html을 404.html로 복사해 SPA 대체 페이지로 사용합니다.
- 빌드 artifact 업로드와 Pages 배포 job을 분리해 CI 성공 후 CD가 실행됩니다.

### Tailwind CSS와 PrimeVue 적용

기존 날씨 테마와 애니메이션은 유지하면서 반복되는 기본 UI와 세부 레이아웃에 Tailwind CSS와 PrimeVue를 적용했습니다.

#### Tailwind CSS

- Vite의 `@tailwindcss/vite` 플러그인과 전역 CSS의 `@import "tailwindcss"`로 유틸리티를 활성화했습니다.
- 테마 선택 UI의 높이, flex 배치, 여백, 폰트, 색상과 focus·hover 상태를 유틸리티 클래스로 구성했습니다.
- PrimeVue `Select`의 root, label, dropdown, overlay, list, option 파트를 `pt` 속성과 Tailwind 클래스로 스타일링했습니다.
- 도시 검색 입력에는 `min-w-0`, `flex-1`을 적용해 작은 화면에서 입력창이 밖으로 밀려나지 않도록 했습니다.

지도, 날씨 그래픽, 옷차림 SVG, 시간대별 테마와 복잡한 애니메이션은 GPT를 활용해 서비스 테마에 맞는 CSS와 SVG 스타일로 구현했습니다.

#### PrimeVue

PrimeVue는 기존 디자인을 덮어쓰지 않도록 `unstyled` 모드로 등록했습니다. 컴포넌트의 기본 동작과 접근성은 PrimeVue가 담당하고 시각 스타일은 Tailwind와 기존 테마 CSS로 구성합니다.

| 적용 영역 | PrimeVue 컴포넌트 | 적용 내용 |
| --- | --- | --- |
| 헤더 테마 선택 | `Select` | 자동·아침·낮·저녁·밤 옵션과 키보드 선택 |
| 도시 검색 | `InputText` | 초성 검색어 입력과 자동완성 목록 연결 |
| 즐겨찾기 | `Button` | 도시 카드의 즐겨찾기 추가·해제 |
| 지역 필터 | `Button` | 전체·도별 필터와 활성 상태 표시 |
| 도시 정렬 | `Button` | 거리순·이름순 정렬 방식 선택 |

한국 지도 마커, 기온 그래프, 도시 풍경과 산책 애니메이션처럼 날씨 서비스에 특화된 UI는 GPT를 활용해 요구사항에 맞게 구성했습니다.

## 핵심 구현 요소

### 1. 반응형 변수

Vue 3 Composition API의 `ref`, `computed`, `watch`를 이용해 API 응답과 사용자 입력을 화면에 반응형으로 연결했습니다.

- `ref`
  - 현재 날씨 목록, 로딩 상태, 검색어, 선택한 도시와 현재 위치를 저장합니다.
  - API 요청 후 상태가 변경되면 지도, 카드와 상세 패널이 자동으로 다시 렌더링됩니다.
- `computed`
  - 검색어와 지역 필터가 적용된 도시 목록을 계산합니다.
  - 현재 위치와 각 도시의 위·경도 거리를 계산해 거리순으로 정렬합니다.
  - 시간별 기온을 그래프 좌표로 변환하고 최고·최저기온에 맞는 옷차림을 선택합니다.
- `watch`
  - 현재 위치가 바뀌면 해당 도시의 일출·일몰 정보를 다시 요청합니다.
  - 기온과 테마 상태가 변경되면 애니메이션, 비교 정보와 화면 테마를 갱신합니다.
### 2. Component

View에 모든 UI를 작성하지 않고 여러 화면에서 다시 사용할 수 있는 단위로 분리했습니다.

- 현재 위치 날씨: 현재 기온, 변화량, 12시간 그래프와 옷차림을 표시합니다.
- 전국 기온 지도: 한국 SVG 위에 도시 마커를 배치하고 기온에 따라 색상을 변경합니다.
- 도시 카드와 상세 패널: 날씨, 체감온도, 미세먼지와 산책 지수를 공통 형식으로 표현합니다.
- 날씨 및 도시 그래픽: 날씨 상태와 도시 특성에 맞는 그래픽과 애니메이션을 관리합니다.
- 검색과 즐겨찾기: 초성 검색, 키보드 선택과 즐겨찾기 요약 UI를 구성합니다.

컴포넌트는 `props`로 도시 데이터를 전달받고 `emit`으로 도시 선택, 닫기와 즐겨찾기 변경을 상위 View에 전달합니다.

### 3. Store와 localStorage

여러 화면에서 공유해야 하는 테마와 즐겨찾기는 Pinia Store로 관리합니다.

#### 테마 Store

- 자동, 아침, 낮, 저녁, 밤 테마 선택값을 전역으로 공유합니다.
- 자동 모드에서는 현재 위치의 일출·일몰을 기준으로 시간대를 계산합니다.
- 선택값을 `weather-theme` 키로 `localStorage`에 저장합니다.

#### 즐겨찾기 Store

- 즐겨찾기 도시 ID를 전역 배열로 관리합니다.
- 카드와 즐겨찾기 목록이 동일한 Store를 사용하므로 변경사항이 즉시 동기화됩니다.
- 도시 ID 배열을 `weather-favorite-cities` 키로 저장합니다.

각 Store는 생성될 때 저장된 값을 복원하고 사용자 선택이 변경되면 최신 값을 다시 저장합니다.

### 4. Axios와 API 통신

역할이 다른 두 날씨 API를 Axios로 요청한 뒤 하나의 도시 데이터 구조로 병합합니다.

#### OpenWeatherMap

- 현재 기온과 체감온도
- 습도, 기압, 풍속, 풍향, 가시거리와 운량
- 일출과 일몰
- PM2.5, PM10과 대기질 단계

#### Open-Meteo

- 12시간 시간별 기온과 WMO 날씨 코드
- 오늘의 최고·최저기온
- 1시간 전 기온 비교 데이터

`Promise.allSettled`로 현재 날씨와 시간별 예보를 동시에 요청합니다. 하나의 요청이 실패하더라도 사용 가능한 응답은 유지하며 정규화 함수가 다음과 같은 공통 도시 객체로 변환합니다.

```js
{
  currentTemp,
  prevTemp,
  temperatureChange,
  temperatureTimeline,
  todayHigh,
  todayLow,
  weatherStatus,
  details,
  sunrise,
  sunset
}
```

두 API의 날씨 코드는 서비스 내부 공통 상태로 변환해 동일한 그래픽과 문구를 사용합니다.

## 프로젝트 실행

```bash
npm install
```

프로젝트 루트에 `.env` 파일을 만들고 OpenWeatherMap API 키를 입력합니다.

```env
WEATHER_API_KEY=your_openweathermap_api_key
```

```bash
npm run dev
```

```bash
npm run build
```

> Vite 기반 프런트엔드에서 사용하는 API 키는 최종 브라우저 번들에서 확인될 수 있습니다. 실제 비밀 키를 완전히 숨겨야 한다면 별도의 백엔드 프록시가 필요합니다.

## 배포

`main` 브랜치에 변경사항을 push하면 GitHub Actions가 다음 순서로 GitHub Pages 배포를 진행합니다.

1. Node.js 환경 설정
2. `npm ci`
3. GitHub Secret의 `WEATHER_API_KEY`를 사용해 Vite 빌드
4. SPA 직접 접근을 위한 `404.html` 생성
5. GitHub Pages artifact 업로드 및 배포

GitHub 저장소의 `Settings → Secrets and variables → Actions`에 `WEATHER_API_KEY`를 등록해야 합니다.
