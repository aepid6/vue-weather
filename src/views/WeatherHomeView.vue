<script setup>
// vue 메서드
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
// js 파일 (상수, 함수)
import { getAllWeatherAPI } from '@/services/weatherAPI'
import { mergeWeatherData } from '@/utils/weather'
import { CITIES } from '@/constants/cities'
// 컴포넌트
import BASEDASHBOARD from '@/components/exercise/BaseDashboardCard.vue'
import SEARCH from '@/components/exercise/SearchBar.vue'
import CARD from '@/components/exercise/WeatherCard.vue'
import SELECTED from '@/components/exercise/WeatherSelected.vue'
import LOADING from '@/components/exercise/WeatherLoading.vue'

// 반응형 변수
const currentTime = ref(new Date())
const searchQuery = ref('')
const selectedCityId = ref('')
const weatherList = ref([...CITIES])
const loading = ref(true)
const error = ref('')

// 날씨 데이터 가져오기
const loadWeather = async () => {
  try {
    const response = await getAllWeatherAPI()
    weatherList.value = mergeWeatherData(CITIES, response)
  } catch (err) {
    console.error('날씨 데이터를 불러오지 못했습니다.', err)
    error.value = '날씨 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}
onMounted(loadWeather)
watchEffect(() => {loading.value})

// 타이머 (15분 단위 업데이트)
const timer = setInterval(() => {
  currentTime.value = new Date()
  loadWeather()
}, 15 * 60 * 1000)
// Unmounted시 타이머 중지
onUnmounted(() => {
  clearInterval(timer)
})

// 검색기능
const FilteredWeatherList = computed(() => {
  return weatherList.value.filter(weather =>
    weather.name.includes(searchQuery.value)
  )
})
watchEffect(() => {searchQuery.value})

// 지역선택
watchEffect(() => {console.log(selectedCityId.value)})
</script>

<template>
  <section v-if="loading">
    <LOADING />
  </section>
  <section v-else class="weather-dashboard">
    <div v-if="!selectedCityId" class="dashboard-intro">
      <div>
        <p class="eyebrow">LOCAL WEATHER</p>
        <h1>오늘의 하늘을<br><em>한눈에</em> 살펴보세요.</h1>
      </div>
      <div class="intro-orb" aria-hidden="true">☀</div>
    </div>
    <div v-else>
      <SELECTED :key="selectedCityId" v-model:selectedCityId="selectedCityId" />
    </div>
    <BASEDASHBOARD class="dashboard-card search-card">
    <template v-slot:header>
      <p class="card-title">도시 검색</p>
    </template>
    <template v-slot:content>
      <SEARCH v-model:searchQuery="searchQuery"/>
    </template>
    </BASEDASHBOARD>
    <BASEDASHBOARD class="dashboard-card weather-card-section">
    <template v-slot:header>
      <div class="weather-section-heading">
        <p class="card-title">지역별 날씨 현황</p>
        <span>{{ FilteredWeatherList.length }}개 도시</span>
      </div>
    </template>
    <template v-slot:content>
      <CARD :weatherList="FilteredWeatherList" v-model:selectedCityId="selectedCityId"/>
    </template>
    </BASEDASHBOARD>
    
  </section>
</template>
