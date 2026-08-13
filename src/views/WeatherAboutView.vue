<script setup>
import { CITIES } from '@/constants/cities'

const serviceFeatures = [
  {
    number: '01',
    title: '현재 위치에서 시작',
    copy: '가장 가까운 도시를 찾아 현재 기온과 12시간 예보, 오늘의 최고·최저 기온과 추천 옷차림을 함께 보여줍니다.'
  },
  {
    number: '02',
    title: '지도에서 전국 비교',
    copy: '한국 지도 위 도시 마커의 색으로 기온을 비교하고, 선택한 도시의 체감온도·미세먼지·산책 지수를 바로 확인합니다.'
  },
  {
    number: '03',
    title: '검색하고 저장',
    copy: '초성 검색과 지역·거리·이름 정렬로 도시를 찾고, 자주 확인하는 도시는 즐겨찾기에 저장해 상세 날씨로 빠르게 이동합니다.'
  },
  {
    number: '04',
    title: '시간에 맞는 분위기',
    copy: '현재 위치의 일출과 일몰을 기준으로 아침·낮·저녁·밤 테마가 바뀌며 도시 풍경과 날씨 애니메이션도 함께 어우러집니다.'
  }
]

const architecture = [
  {
    number: '01',
    label: 'Vue 3 Composition API',
    title: '반응형 변수',
    copy: '화면마다 필요한 상태는 ref에 담고, 원본 상태에서 계산되는 값은 computed로 구성했습니다. watch가 위치, 기온과 테마 상태의 변화를 감지해 화면을 다시 계산합니다.',
    points: ['ref · computed · watch', '검색어와 선택 도시', '필터 목록과 예보 그래프'],
    services: ['현재 위치 기반 날씨', '도시 검색·필터·정렬', '12시간 예보 그래프', '일출·일몰 반영']
  },
  {
    number: '02',
    label: 'Reusable UI',
    title: 'Component',
    copy: '여러 화면에서 반복되는 날씨 표현과 상호작용을 독립 컴포넌트로 나눴습니다. View는 데이터 조회와 배치를 담당하고 Component는 지도, 카드, 패널과 그래픽을 표현합니다.',
    points: ['Props와 Emit으로 연결', '공통 날씨 패널', '지도·검색·즐겨찾기 UI'],
    services: ['전국 기온 지도', '도시 상세 패널', '날씨·도시 그래픽', '검색·즐겨찾기 UI']
  },
  {
    number: '03',
    label: 'Pinia + localStorage',
    title: 'Store',
    copy: '테마 선택과 즐겨찾기 도시를 Pinia에서 전역 관리합니다. 스토어가 시작될 때 localStorage 값을 복원하고 변경된 상태를 즉시 저장해 새로고침 후에도 사용자 선택을 유지합니다.',
    points: ['전역 테마와 자동 시간대', '즐겨찾기 도시 ID', '브라우저 영구 저장'],
    services: ['자동·수동 테마 선택', '즐겨찾기 도시 유지', '새로고침 후 상태 복원', '화면 간 공통 상태 공유']
  },
  {
    number: '04',
    label: 'Axios + async/await',
    title: 'API 통신',
    copy: 'OpenWeatherMap의 현재 관측·대기질과 Open-Meteo의 12시간·일별 예보를 Axios로 요청합니다. Promise.allSettled로 일부 실패를 견디고 응답을 하나의 도시 데이터 구조로 병합합니다.',
    points: ['현재 관측과 대기질', '12시간 날씨 예보', '응답 정규화와 병합'],
    services: ['현재 기온·체감온도', '습도·기압·바람', '미세먼지·산책 지수', '12시간·최고·최저 예보']
  }
]
</script>

<template>
  <div class="about-overview-page">
    <section class="about-overview-hero">
      <div class="about-overview-copy">
        <p class="eyebrow">ABOUT SKALA WEATHER</p>
        <h1>날씨를 확인하는 순간부터<br><em>오늘을 결정하는 순간까지.</em></h1>
        <p>
          SKALA Weather는 전국 도시의 날씨를 지도, 그래프, 도시 풍경과 생활 정보로 풀어낸
          반응형 웹 서비스입니다. 현재 위치의 날씨에서 시작해 원하는 도시를 탐색하고,
          외출 환경과 옷차림까지 한 흐름 안에서 판단할 수 있도록 설계했습니다.
        </p>
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
        <div><strong>{{ CITIES.length }}</strong><span>전국 도시</span></div>
        <div><strong>12시간</strong><span>시간별 날씨 예보</span></div>
      </div>
    </section>

    <section class="about-service-section">
      <header class="about-overview-heading">
        <div><span>SERVICE OVERVIEW</span><h2>숫자를 생활에 가까운 정보로</h2></div>
        <p>현재 위치, 전국 지도, 도시 검색과 상세 정보가 하나의 날씨 탐색 경험으로 이어집니다.</p>
      </header>
      <div class="about-service-grid">
        <article v-for="feature in serviceFeatures" :key="feature.number">
          <span>{{ feature.number }}</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.copy }}</p>
        </article>
      </div>
    </section>

    <section class="about-structure-section">
      <header class="about-overview-heading">
        <div><span>PROJECT STRUCTURE</span><h2>기능은 코드 어디에 들어갔을까요?</h2></div>
        <p>반응형 상태부터 API 응답이 화면에 표시되기까지, 각 기술이 제공하는 서비스를 중심으로 정리했습니다.</p>
      </header>

      <div class="about-structure-grid">
        <article v-for="area in architecture" :key="area.number" class="about-structure-card">
          <div class="about-structure-card-head">
            <span>{{ area.number }}</span>
            <div><small>{{ area.label }}</small><h3>{{ area.title }}</h3></div>
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
        <li><strong>01</strong><span>OpenWeatherMap<br>Open-Meteo</span></li>
        <li><strong>02</strong><span>Axios<br>비동기 요청</span></li>
        <li><strong>03</strong><span>데이터 정규화<br>도시별 병합</span></li>
        <li><strong>04</strong><span>Reactive State<br>화면 갱신</span></li>
      </ol>
    </section>
  </div>
</template>
