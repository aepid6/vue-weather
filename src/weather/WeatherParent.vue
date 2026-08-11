<script setup>
import {ref, computed, watch, watchEffect, onUnmounted} from 'vue'
import BASEDASHBOARD from '@/weather/BaseDashboardCard.vue'
import SEARCH from '@/weather/SearchBar.vue'
import CARD from '@/weather/WeatherCard.vue'
import SELECTED from '@/weather/WeatherSelected.vue'

const currentTime = ref(new Date())
const searchQuery = ref('')
const selectedCityInfo = ref('')

const weatherList = ref([
    {id: 'city_01', name: '서울', temp: 28, status: '맑음' },
    {id: 'city_02', name: '수원', temp: 24, status: '비' },
    {id: 'city_03', name: '부산', temp: 26, status: '구름' },
    {id: 'city_04', name: '울산', temp: 25, status: '맑음' },
    {id: 'city_05', name: '포항', temp: 27, status: '흐림' }
])

const timer = setInterval(() => {
  currentTime.value = new Date()
}, 30000)

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
</script>

<template>
  <BASEDASHBOARD>
    <template v-slot:header>
      <p>도시 검색</p>
    </template>
    <template v-slot:content>
      <SEARCH v-model:searchQuery="searchQuery"/>
    </template>
  </BASEDASHBOARD>
  <BASEDASHBOARD>
    <template v-slot:header>
      <p>지역별 날씨 현황</p>
    </template>
    <template v-slot:content>
      <CARD :weatherList="FilteredWeatherList" v-model:selectedCityInfo="selectedCityInfo"/>
    </template>
  </BASEDASHBOARD>
  <SELECTED :key="selectedCityInfo" :selectedCityInfo="selectedCityInfo" />
</template>