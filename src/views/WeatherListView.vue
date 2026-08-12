<script setup>
// vue 메서드
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
// js 파일 (상수, 함수)
import { getAllWeatherAPI } from '@/services/weatherAPI'
import { mergeWeatherData } from '@/utils/weather'
import { matchesCityName } from '@/utils/search'
import { CITIES } from '@/constants/cities'
// 컴포넌트
import BASEDASHBOARD from '@/components/exercise/BaseDashboardCard.vue'
import SEARCH from '@/components/exercise/SearchBar.vue'
import CARD from '@/components/exercise/WeatherCard.vue'
import SELECTED from '@/components/exercise/WeatherSelected.vue'
import LOADING from '@/components/exercise/WeatherLoading.vue'

// 반응형 변수
const searchQuery = ref('')
const selectedRegion = ref('전체')
const selectedCityId = ref('')
const weatherList = ref([...CITIES])
const loading = ref(true)
const selectedCity = computed(() => weatherList.value.find((city) => city.id === selectedCityId.value))

// 날씨 데이터 가져오기
const loadWeather = async () => {
  try {
    const response = await getAllWeatherAPI()
    weatherList.value = mergeWeatherData(CITIES, response)
  } catch (err) {
    console.error('날씨 데이터를 불러오지 못했습니다.', err)
  } finally {
    loading.value = false
  }
}
onMounted(loadWeather)

// 타이머 (15분 단위 업데이트)
const timer = setInterval(() => {
  loadWeather()
}, 15 * 60 * 1000)
// Unmounted시 타이머 중지
onUnmounted(() => {
  clearInterval(timer)
})

// 지역선택
const regionName = (city) => city.province || '특별시·광역시'

const regions = computed(() => ['전체', ...new Set(weatherList.value.map(regionName))])

const RegionFilteredWeatherList = computed(() => {
  return selectedRegion.value === '전체'
    ? weatherList.value
    : weatherList.value.filter((weather) => regionName(weather) === selectedRegion.value)
})

// 검색기능
const FilteredWeatherList = computed(() => {
  return RegionFilteredWeatherList.value.filter((weather) =>
    matchesCityName(weather.name, searchQuery.value),
  )
})

watchEffect(() => {
  selectedCityId.value
})
</script>

<template>
  <section v-if="loading">
    <LOADING />
  </section>
  <section v-else class="weather-dashboard weather-list-view">
    <div class="dashboard-intro">
      <div>
        <p class="eyebrow">LOCAL WEATHER</p>
        <h1>오늘의 하늘을<br><em>한눈에</em> 살펴보세요.</h1>
      </div>
      <div class="intro-orb" aria-hidden="true">☀</div>
    </div>
    <div v-if="selectedCityId">
      <SELECTED :city="selectedCity" v-model:selectedCityId="selectedCityId" />
    </div>
    <BASEDASHBOARD class="dashboard-card search-card">
      <template v-slot:header>
        <p class="card-title">도시 검색</p>
      </template>
      <template v-slot:content>
        <div class="region-filters" role="group" aria-label="지역별 도시 필터">
          <button
            v-for="region in regions"
            :key="region"
            :class="{ active: selectedRegion === region }"
            @click="selectedRegion = region"
          >
            {{ region }}
          </button>
        </div>
        <SEARCH v-model:searchQuery="searchQuery" />
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
        <CARD :weatherList="FilteredWeatherList" v-model:selectedCityId="selectedCityId" />
      </template>
    </BASEDASHBOARD>
  </section>
</template>
