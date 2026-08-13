<script setup>
// vue 메서드
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
// js 파일 (상수, 함수)
import {
  getAllCurrentWeatherAPI,
  getAllHourlyWeatherAPI,
  getSunTimeAPI
} from '@/services/weatherAPI'
import { mergeWeatherData } from '@/utils/weather'
import { useThemeStore } from '@/stores/theme'
import { CITIES } from '@/constants/cities'
// 컴포넌트
import LOADING from '@/components/WeatherLoading.vue'
import TEMPERATUREMAP from '@/components/WeatherTemperatureMap.vue'
import CITYPANEL from '@/components/WeatherCityPanel.vue'
import CURRENTLOCATION from '@/components/WeatherCurrentLocation.vue'

// 반응형 변수
const currentTime = ref(new Date())
const themeStore = useThemeStore()
const selectedCityId = ref('')
const currentLocationCityId = ref('seoul')
const weatherList = ref([...CITIES])
const loading = ref(true)
const error = ref('')
const sunTimes = ref(null)
const selectedCity = computed(() => weatherList.value.find((city) => city.id === selectedCityId.value))
const currentLocation = computed(() => weatherList.value.find((city) => city.id === currentLocationCityId.value))

// 날씨 데이터 가져오기
const loadWeather = async () => {
  try {
    const [currentResult, hourlyResult] = await Promise.allSettled([
      getAllCurrentWeatherAPI(),
      getAllHourlyWeatherAPI()
    ])
    const currentResponse = currentResult.status === 'fulfilled' ? currentResult.value : null
    const hourlyResponse = hourlyResult.status === 'fulfilled' ? hourlyResult.value : null

    if (currentResult.status === 'rejected') console.error('현재 날씨 API 요청에 실패했습니다.', currentResult.reason)
    if (hourlyResult.status === 'rejected') console.error('시간별 날씨 API 요청에 실패했습니다.', hourlyResult.reason)
    if (!currentResponse && !hourlyResponse) throw new Error('날씨 API 요청에 모두 실패했습니다.')

    weatherList.value = mergeWeatherData(CITIES, currentResponse, hourlyResponse)
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
      currentLocationCityId.value = 'seoul'
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 15 * 60 * 1000
    }
  )
}

const updateTimeTheme = () => {
  if (!sunTimes.value) return

  const now = new Date()
  const sunrise = new Date(sunTimes.value.sunrise)
  const sunset = new Date(sunTimes.value.sunset)
  const noon = new Date(sunrise)
  const midnight = new Date(sunrise)

  noon.setHours(12, 0, 0, 0)
  midnight.setHours(24, 0, 0, 0)

  if (now >= sunrise && now < noon) {
    themeStore.setAutomaticTheme('morning')
  } else if (now >= noon && now < sunset) {
    themeStore.setAutomaticTheme('afternoon')
  } else if (now >= sunset && now < midnight) {
    themeStore.setAutomaticTheme('evening')
  } else {
    themeStore.setAutomaticTheme('night')
  }
}

const loadSunTimes = async (cityId) => {
  const city = CITIES.find((item) => item.id === cityId)

  if (!city) return

  try {
    const daily = await getSunTimeAPI(city)

    sunTimes.value = {
      sunrise: daily.sunrise?.[0],
      sunset: daily.sunset?.[0]
    }
    updateTimeTheme()
  } catch (err) {
    console.error('일출·일몰 정보를 불러오지 못했습니다.', err)
  }
}

onMounted(() => {
  loadWeather()
  loadCurrentLocation()
})
watch(currentLocationCityId, loadSunTimes, { immediate: true })

// 타이머 (15분 단위 업데이트)
const timer = setInterval(() => {
  currentTime.value = new Date()
  loadWeather()
  updateTimeTheme()
}, 15 * 60 * 1000)
// Unmounted시 타이머 중지
onUnmounted(() => {
  clearInterval(timer)
})

</script>

<template>
  <section v-if="loading">
    <LOADING />
  </section>
  <section v-else class="weather-dashboard home-weather-dashboard">
    <CURRENTLOCATION :city="currentLocation" />
    <div class="map-dashboard-layout" :class="{ 'has-selected-city': selectedCityId }">
      <TEMPERATUREMAP
        :weatherList="weatherList"
        :currentLocationId="currentLocation?.id"
        @select-city="selectedCityId = $event"
      />
      <aside v-if="selectedCity" class="map-detail-modal" aria-label="선택한 도시 날씨 정보">
        <CITYPANEL
          :city="selectedCity"
          close-label="지도 상세 정보 닫기"
          @close="selectedCityId = ''"
        />
      </aside>
    </div>
  </section>
</template>
