<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CITIES } from '@/constants/cities'
import { getCurrentWeatherAPI, getHourlyWeatherAPI } from '@/services/weatherAPI'
import { formatTemperature, mergeWeatherData } from '@/utils/weather'
import CITYSCENE from '@/components/WeatherCityScene.vue'
import LOADING from '@/components/WeatherLoading.vue'
import WEATHERGRAPHIC from '@/components/WeatherGraphic.vue'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const weather = ref(null)
const city = computed(() => CITIES.find((item) => item.id === route.params.cityId))

const formatTime = (time, options = {}) => {
  if (!time) return '--'

  return new Date(time).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options
  })
}

const observedTime = computed(() => {
  if (!weather.value?.observedAt) return '--'

  return new Date(weather.value.observedAt).toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
})

const temperatureChangeText = computed(() => {
  const change = weather.value?.temperatureChange

  if (!Number.isFinite(change)) return '1시간 전 비교 정보 없음'
  if (change === 0) return '1시간 전과 동일'

  return `1시간 전보다 ${change > 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}°C`
})

const windDirection = computed(() => {
  const degrees = weather.value?.details?.windDirection
  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서']

  if (!Number.isFinite(degrees)) return '--'
  return directions[Math.round(degrees / 45) % directions.length]
})

const detailItems = computed(() => {
  const details = weather.value?.details ?? {}

  return [
    { type: 'temperature', label: '체감온도', value: details.feelsLike, unit: '°C' },
    { type: 'humidity', label: '습도', value: details.humidity, unit: '%' },
    { type: 'pressure', label: '기압', value: details.pressure, unit: ' hPa' },
    { type: 'wind', label: '풍속', value: details.windSpeed, unit: ' m/s', note: windDirection.value },
    { type: 'visibility', label: '가시거리', value: Number.isFinite(details.visibility) ? (details.visibility / 1000).toFixed(1) : null, unit: ' km' },
    { type: 'cloud', label: '운량', value: details.cloudiness, unit: '%' },
    { type: 'sunrise', label: '일출', value: formatTime(weather.value?.sunrise), unit: '' },
    { type: 'sunset', label: '일몰', value: formatTime(weather.value?.sunset), unit: '' }
  ]
})

const loadWeather = async () => {
  if (!city.value) {
    error.value = '도시 정보를 찾을 수 없습니다.'
    loading.value = false
    return
  }

  try {
    const [currentResult, hourlyResult] = await Promise.allSettled([
      getCurrentWeatherAPI(city.value),
      getHourlyWeatherAPI(city.value)
    ])
    const currentResponse = currentResult.status === 'fulfilled'
      ? { data: [currentResult.value] }
      : null
    const hourlyResponse = hourlyResult.status === 'fulfilled'
      ? { data: [hourlyResult.value] }
      : null

    if (!currentResponse && !hourlyResponse) throw new Error('날씨 API 요청에 실패했습니다.')
    weather.value = mergeWeatherData([city.value], currentResponse, hourlyResponse)[0]
  } catch (requestError) {
    console.error('상세 날씨 정보를 불러오지 못했습니다.', requestError)
    error.value = '상세 날씨 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(loadWeather)
</script>

<template>
  <LOADING v-if="loading" />
  <section v-else-if="error" class="weather-detail-error">
    <p>{{ error }}</p>
    <RouterLink to="/cities">도시 목록으로 돌아가기</RouterLink>
  </section>
  <section v-else-if="weather" class="weather-detail-page">
    <RouterLink class="detail-back" to="/cities"><span aria-hidden="true">←</span> 도시 목록</RouterLink>

    <article class="weather-detail-hero">
      <CITYSCENE :city="weather" />
      <div class="detail-hero-copy">
        <p>{{ weather.province || '대한민국' }}</p>
        <h1>{{ weather.name }}</h1>
        <span>{{ weather.status }} · {{ observedTime }} 기준</span>
      </div>
      <div class="detail-main-reading">
        <WEATHERGRAPHIC :status="weather.weatherStatus" size="large" />
        <strong>{{ formatTemperature(weather.currentTemp) }}<small>°C</small></strong>
        <p :class="{ down: weather.temperatureChange < 0 }">{{ temperatureChangeText }}</p>
      </div>
    </article>

    <section class="detail-metrics" aria-label="현재 상세 기상 정보">
      <article v-for="item in detailItems" :key="item.label" class="detail-metric-card">
        <span class="detail-metric-icon" :class="`metric-icon--${item.type}`" aria-hidden="true"><i></i><b></b></span>
        <div>
          <p>{{ item.label }}</p>
          <strong>{{ item.value ?? '--' }}<small>{{ item.unit }}</small></strong>
          <em v-if="item.note">{{ item.note }}풍</em>
        </div>
      </article>
    </section>

    <section class="detail-forecast dashboard-card">
      <div class="detail-section-heading">
        <div>
          <p>HOURLY FORECAST</p>
          <h2>앞으로 12시간</h2>
        </div>
        <span>Open-Meteo 예보</span>
      </div>
      <div v-if="weather.temperatureTimeline.length" class="detail-forecast-track">
        <article v-for="(hour, index) in weather.temperatureTimeline" :key="hour.time">
          <span>{{ index === 0 ? '현재' : formatTime(hour.time, { minute: undefined }) }}</span>
          <i :style="{ '--forecast-height': `${34 + Math.max(0, hour.temp - 10) * 2}px` }"></i>
          <strong>{{ hour.temp }}°</strong>
        </article>
      </div>
      <p v-else class="detail-forecast-empty">시간별 예보를 현재 불러올 수 없습니다.</p>
    </section>
  </section>
</template>
