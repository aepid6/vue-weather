<script setup>
const serviceFeatures = [
  { type: 'location', title: '내 위치 중심 날씨', copy: '현재 위치와 가까운 도시를 찾아 실시간 기온과 12시간 흐름을 보여줍니다.' },
  { type: 'map', title: '전국 기온 지도', copy: '우리나라 지도 위에서 도시별 기온을 비교하고 원하는 지역을 바로 탐색할 수 있습니다.' },
  { type: 'walk', title: '산책 환경 안내', copy: '체감온도와 PM2.5를 함께 분석해 달리기, 걷기, 외출 주의 상태를 애니메이션으로 전달합니다.' },
  { type: 'theme', title: '시간대별 테마', copy: '현재 위치의 일출과 일몰을 기준으로 아침부터 밤까지 화면 분위기가 자연스럽게 변합니다.' }
]

const technologies = [
  { name: 'Vue 3', copy: 'Composition API와 반응형 상태를 이용해 지도, 검색, 패널이 실시간으로 함께 갱신됩니다.' },
  { name: 'Vite', copy: '빠른 개발 서버와 최적화된 프로덕션 빌드를 담당합니다.' },
  { name: 'Axios', copy: '날씨와 대기질 데이터를 비동기로 요청하고 각 API 응답을 화면용 데이터로 변환합니다.' },
  { name: 'Vue Router', copy: 'Home, Cities, 도시 상세, About 화면을 URL 기반으로 연결합니다.' }
]
</script>

<template>
  <section class="about-page">
    <header class="about-hero">
      <div>
        <p class="eyebrow">ABOUT SKALA WEATHER</p>
        <h1>날씨를 숫자보다<br><em>생활에 가까운 장면</em>으로.</h1>
        <p class="about-lead">SKALA Weather는 전국의 현재 날씨와 앞으로의 변화를 한눈에 탐색하고, 오늘의 외출을 더 쉽게 판단할 수 있도록 만든 인터랙티브 날씨 서비스입니다.</p>
      </div>
      <div class="about-weather-orbit" aria-hidden="true">
        <span class="about-orbit-sun"></span><i class="about-orbit-cloud"></i><b class="about-orbit-moon"></b>
      </div>
    </header>

    <section class="about-section">
      <div class="about-section-heading">
        <p>SERVICE</p>
        <h2>필요한 날씨를 빠르고 직관적으로</h2>
      </div>
      <div class="about-feature-grid">
        <article v-for="feature in serviceFeatures" :key="feature.title">
          <span class="about-feature-icon" :class="`about-feature-icon--${feature.type}`" aria-hidden="true"><i></i><b></b></span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.copy }}</p>
        </article>
      </div>
    </section>

    <section class="about-data-flow dashboard-card">
      <div>
        <p class="about-kicker">DATA FLOW</p>
        <h2>두 날씨 API를 목적에 맞게 결합합니다.</h2>
        <p>OpenWeatherMap에서 현재 기온, 체감온도, 습도, 기압, 바람, 일출·일몰과 대기질을 가져옵니다. Open-Meteo에서는 1시간 전 기온과 앞으로 12시간 예보를 받아 하나의 도시 데이터로 병합합니다.</p>
      </div>
      <div class="about-flow" aria-label="날씨 데이터 처리 흐름">
        <span>Weather APIs</span><i>→</i><span>Axios</span><i>→</i><span>Vue UI</span>
      </div>
    </section>

    <section class="about-section">
      <div class="about-section-heading">
        <p>TECH STACK</p>
        <h2>가볍고 반응성 높은 프런트엔드</h2>
      </div>
      <div class="about-tech-grid">
        <article v-for="technology in technologies" :key="technology.name">
          <strong>{{ technology.name }}</strong>
          <p>{{ technology.copy }}</p>
        </article>
      </div>
    </section>

    <footer class="about-footer-card">
      <div><span>56</span><small>전국 도시</small></div>
      <div><span>15분</span><small>날씨 갱신 주기</small></div>
      <div><span>12시간</span><small>시간별 기온 예보</small></div>
      <RouterLink to="/cities">도시 날씨 둘러보기 <span aria-hidden="true">→</span></RouterLink>
    </footer>
  </section>
</template>
