<script setup>
import { CITIES } from '@/constants/cities'
import { PROJECT_ARCHITECTURE, SERVICE_FEATURES } from '@/constants/about'
</script>

<template>
  <div class="about-overview-page">
    <section class="about-overview-hero">
      <div class="about-overview-copy">
        <p class="eyebrow">ABOUT SKALA WEATHER</p>
        <h1>날씨를 확인하는 순간부터<br /><em>오늘을 결정하는 순간까지.</em></h1>
        <p>SKALA Weather는 전국 도시의 날씨를 지도, 그래프, 도시 풍경과 생활 정보로 풀어낸 반응형 웹 서비스입니다. 현재 위치의 날씨에서 시작해 원하는 도시를 탐색하고, 외출 환경과 옷차림까지 한 흐름 안에서 판단할 수 있도록 설계했습니다.</p>
        <div class="about-overview-actions">
          <RouterLink to="/">현재 위치 날씨 보기 <span aria-hidden="true">→</span></RouterLink>
          <RouterLink to="/cities">전국 도시 둘러보기</RouterLink>
        </div>
      </div>
      <div class="about-overview-visual" aria-hidden="true">
        <i class="overview-sun"></i>
        <i class="overview-cloud overview-cloud--one"></i>
        <i class="overview-cloud overview-cloud--two"></i>
        <span class="overview-orbit"></span>
        <b class="overview-city"><i></i><i></i><i></i><i></i></b>
      </div>
      <div class="about-overview-stats">
        <div>
          <strong>{{ CITIES.length }}</strong
          ><span>전국 도시</span>
        </div>
        <div><strong>12시간</strong><span>시간별 날씨 예보</span></div>
      </div>
    </section>

    <section class="about-service-section">
      <header class="about-overview-heading">
        <div>
          <span>SERVICE OVERVIEW</span>
          <h2>숫자를 생활에 가까운 정보로</h2>
        </div>
        <p>현재 위치, 전국 지도, 도시 검색과 상세 정보가 하나의 날씨 탐색 경험으로 이어집니다.</p>
      </header>
      <div class="about-service-grid">
        <article v-for="feature in SERVICE_FEATURES" :key="feature.number">
          <span>{{ feature.number }}</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.copy }}</p>
        </article>
      </div>
    </section>

    <section class="about-structure-section">
      <header class="about-overview-heading">
        <div>
          <span>PROJECT STRUCTURE</span>
          <h2>기능은 코드 어디에 들어갔을까요?</h2>
        </div>
        <p>반응형 상태부터 API 응답이 화면에 표시되기까지, 각 기술이 제공하는 서비스를 중심으로 정리했습니다.</p>
      </header>

      <div class="about-structure-grid">
        <article v-for="area in PROJECT_ARCHITECTURE" :key="area.number" class="about-structure-card">
          <div class="about-structure-card-head">
            <span>{{ area.number }}</span>
            <div>
              <small>{{ area.label }}</small>
              <h3>{{ area.title }}</h3>
            </div>
          </div>
          <p>{{ area.copy }}</p>
          <ul class="about-structure-points">
            <li v-for="point in area.points" :key="point">{{ point }}</li>
          </ul>
          <div class="about-file-list" aria-label="제공 서비스">
            <span v-for="service in area.services" :key="service">{{ service }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="about-pipeline">
      <div>
        <span>DATA FLOW</span>
        <h2>날씨 데이터가 화면에 도착하는 과정</h2>
        <p>서로 다른 API의 현재 관측과 12시간 예보를 정규화한 뒤 반응형 상태에 저장하면 지도, 카드, 패널과 상세 페이지가 같은 도시 데이터를 기준으로 갱신됩니다.</p>
      </div>
      <ol aria-label="날씨 데이터 처리 순서">
        <li>
          <strong>01</strong><span>OpenWeatherMap<br />Open-Meteo</span>
        </li>
        <li>
          <strong>02</strong><span>Axios<br />비동기 요청</span>
        </li>
        <li>
          <strong>03</strong><span>데이터 정규화<br />도시별 병합</span>
        </li>
        <li>
          <strong>04</strong><span>Reactive State<br />화면 갱신</span>
        </li>
      </ol>
    </section>
  </div>
</template>
