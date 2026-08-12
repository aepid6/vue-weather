<script setup>
import {ref, computed, watch, watchEffect, onUnmounted} from 'vue'
import axios from 'axios'
import BASEDASHBOARD from '@/components/exercise/BaseDashboardCard.vue'
import SEARCH from '@/components/exercise/SearchBar.vue'
import CARD from '@/components/exercise/WeatherCard.vue'
import SELECTED from '@/components/exercise/WeatherSelected.vue'

const currentTime = ref(new Date())
const searchQuery = ref('')
const selectedCityInfo = ref('')

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', eng: 'Seoul', lat: 0, lon: 0 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', eng: 'Suwon', lat: 0, lon: 0 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', eng: 'Busan', lat: 0, lon: 0 },
  { id: 'city_04', name: '울산', temp: 25, status: '맑음', eng: 'Ulsan', lat: 0, lon: 0 },
  { id: 'city_05', name: '포항', temp: 27, status: '흐림', eng: 'Pohang', lat: 0, lon: 0 },
  { id: 'city_06', name: '인천', temp: 23, status: '흐림', eng: 'Incheon', lat: 0, lon: 0 },
  { id: 'city_07', name: '대전', temp: 29, status: '맑음', eng: 'Daejeon', lat: 0, lon: 0 },
  { id: 'city_08', name: '대구', temp: 31, status: '맑음', eng: 'Daegu', lat: 0, lon: 0 },
  { id: 'city_09', name: '광주', temp: 27, status: '비', eng: 'Gwangju', lat: 0, lon: 0 },
  { id: 'city_10', name: '춘천', temp: 25, status: '흐림', eng: 'Chuncheon', lat: 0, lon: 0 },
  { id: 'city_11', name: '강릉', temp: 24, status: '비', eng: 'Gangneung', lat: 0, lon: 0 },
  { id: 'city_12', name: '청주', temp: 28, status: '구름', eng: 'Cheongju', lat: 0, lon: 0 },
  { id: 'city_13', name: '전주', temp: 30, status: '맑음', eng: 'Jeonju', lat: 0, lon: 0 },
  { id: 'city_14', name: '목포', temp: 25, status: '비', eng: 'Mokpo', lat: 0, lon: 0 },
  { id: 'city_15', name: '여수', temp: 27, status: '구름', eng: 'Yeosu', lat: 0, lon: 0 },
  { id: 'city_16', name: '창원', temp: 29, status: '맑음', eng: 'Changwon', lat: 0, lon: 0 },
  { id: 'city_17', name: '안동', temp: 26, status: '맑음', eng: 'Andong', lat: 0, lon: 0 },
  { id: 'city_18', name: '천안', temp: 27, status: '비', eng: 'Cheonan', lat: 0, lon: 0 }
])

const getLocations = async () => {
  await Promise.all(
    weatherList.value.map(async (city) => {
      const response = await axios.get(
        'https://geocoding-api.open-meteo.com/v1/search',
        {
          params: {
            name: city.eng,
            count: 1,
            language: 'ko'
          }
        }
      )

      const result = response.data.results?.[0]

      if (result) {
        city.lat = result.latitude
        city.lon = result.longitude
      }
    })
)
  console.log(weatherList)
}

const timer = setInterval(() => {
  currentTime.value = new Date()
  console.log(currentTime.value)
}, 1000)

const FilteredWeatherList = computed(() => {
  return weatherList.value.filter(weather =>
    weather.name.includes(searchQuery.value)
  )
})

const maxTemp = computed(() => {
  return Math.max(
    ...weatherList.value.map(weather => weather.temp)
  )
})
const minTemp = computed(() => {
  return Math.min(
    ...weatherList.value.map(weather => weather.temp)
  )
})
console.log(`최대기온: ${maxTemp.value} / 최저기온: ${minTemp.value}`)

watch(selectedCityInfo, (newValue, oldValue) => {
    console.log(`[watch] 상태바가 변경되었습니다! ${oldValue} -> ${newValue}`)
})

watch(currentTime, () => {})

watchEffect(() => {
    console.log(`[watchEffect] 현재 검색어 ${searchQuery.value} 입니다.`)
})

onUnmounted(() => {
  clearInterval(timer)
})

getLocations()
</script>

<template>
  <section class="weather-dashboard">
    <div class="dashboard-intro">
      <div>
        <p class="eyebrow">LOCAL WEATHER</p>
        <h1>오늘의 하늘을<br><em>한눈에</em> 살펴보세요.</h1>
      </div>
      <div class="intro-orb" aria-hidden="true">☀</div>
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
      <CARD :weatherList="FilteredWeatherList" v-model:selectedCityInfo="selectedCityInfo"/>
    </template>
    </BASEDASHBOARD>
    <SELECTED :key="selectedCityInfo" :selectedCityInfo="selectedCityInfo" />
  </section>
</template>
