<script setup>
// vue 메서드
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
// js 파일 (상수, 함수)
import { getAllWeatherAPI } from '@/services/weatherAPI'
import { mergeWeatherData } from '@/utils/weather'
import { CITIES } from '@/constants/cities'
// 컴포넌트
import LOADING from '@/components/exercise/WeatherLoading.vue'
import TEMPERATUREMAP from '@/components/exercise/WeatherTemperatureMap.vue'
import MAPMODAL from '@/components/exercise/WeatherMapModal.vue'
import CURRENTLOCATION from '@/components/exercise/WeatherCurrentLocation.vue'

// 반응형 변수
const currentTime = ref(new Date())
const selectedCityId = ref('')
const currentLocationCityId = ref('city_01')
const weatherList = ref([...CITIES])
const loading = ref(true)
const error = ref('')
const selectedCity = computed(() => weatherList.value.find((city) => city.id === selectedCityId.value))
const currentLocation = computed(() => weatherList.value.find((city) => city.id === currentLocationCityId.value))

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
const findNearestCity = (coordinates) => {
  return CITIES.reduce((nearestCity, city) => {
    const nearestDistance = Math.hypot(nearestCity.lat - coordinates.lat, nearestCity.lon - coordinates.lon)
    const cityDistance = Math.hypot(city.lat - coordinates.lat, city.lon - coordinates.lon)

    return cityDistance < nearestDistance ? city : nearestCity
  })
}

const loadCurrentLocation = () => {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }
      const nearestCity = findNearestCity(coordinates)

      currentLocationCityId.value = nearestCity.id
    },
    () => {
      currentLocationCityId.value = 'city_01'
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 15 * 60 * 1000
    }
  )
}

onMounted(() => {
  loadWeather()
  loadCurrentLocation()
})
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

// 지역선택
watchEffect(() => {selectedCityId.value})
</script>

<template>
  <section v-if="loading">
    <LOADING />
  </section>
  <section v-else class="weather-dashboard home-weather-dashboard">
    <div class="map-dashboard-layout" :class="{ 'has-selected-city': selectedCityId }">
      <div class="map-column">
        <CURRENTLOCATION :city="currentLocation" />
        <TEMPERATUREMAP
          :weatherList="weatherList"
          :currentLocationId="currentLocation?.id"
          @select-city="selectedCityId = $event"
        />
      </div>
      <aside v-if="selectedCity" class="map-detail-modal" aria-label="선택한 도시 날씨 정보">
        <MAPMODAL
          :city="selectedCity"
          @close="selectedCityId = ''"
        />
      </aside>
    </div>
  </section>
</template>
