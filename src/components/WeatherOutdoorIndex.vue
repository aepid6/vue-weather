<script setup>
import { computed, ref, watch } from 'vue'
import { getAirPollutionAPI } from '@/services/weatherAPI'

const props = defineProps({
  city: {
    type: Object,
    required: true
  }
})

const airQuality = ref(null)

const loadAirQuality = async () => {
  airQuality.value = null

  try {
    airQuality.value = await getAirPollutionAPI(props.city)
  } catch (error) {
    console.error('대기질 정보를 불러오지 못했습니다.', error)
  }
}

const outdoorStatus = computed(() => {
  const feelsLike = props.city.details?.feelsLike
  const pm25 = airQuality.value?.pm25

  if (!Number.isFinite(feelsLike) || !Number.isFinite(pm25)) {
    return { level: 'checking', title: '산책 환경 확인 중', copy: '대기질 정보를 불러오고 있어요.' }
  }
  if (pm25 > 35 || feelsLike <= -5 || feelsLike >= 33) {
    return { level: 'bad', title: '산책은 잠시 미뤄요', copy: pm25 > 35 ? '초미세먼지가 높아 마스크를 권장해요.' : '체감온도가 야외 활동에 부담스러워요.' }
  }
  if (pm25 > 15 || feelsLike <= 5 || feelsLike >= 28) {
    return { level: 'normal', title: '가볍게 걷기 괜찮아요', copy: '기온과 대기질을 확인하고 준비하세요.' }
  }

  return { level: 'good', title: '달리기 좋은 날씨', copy: '체감온도와 초미세먼지가 쾌적해요.' }
})

const fineDustStatus = computed(() => {
  const pm25 = airQuality.value?.pm25

  if (!Number.isFinite(pm25)) return { label: '확인 중', level: 'checking' }
  if (pm25 <= 15) return { label: '좋음', level: 'good' }
  if (pm25 <= 35) return { label: '보통', level: 'normal' }
  if (pm25 <= 75) return { label: '나쁨', level: 'bad' }
  return { label: '매우 나쁨', level: 'very-bad' }
})

watch(() => props.city.id, loadAirQuality, { immediate: true })
</script>

<template>
  <div class="weather-health-summary">
    <div class="weather-health-metrics">
      <div class="weather-health-metric">
        <span class="health-temperature-icon" aria-hidden="true"><i></i></span>
        <div>
          <small>체감온도</small>
          <strong>{{ Number.isFinite(city.details?.feelsLike) ? city.details.feelsLike.toFixed(1) : '--' }}<em>°C</em></strong>
        </div>
      </div>
      <div class="weather-health-metric fine-dust-metric" :class="`fine-dust--${fineDustStatus.level}`">
        <span class="health-dust-icon" aria-hidden="true"><i></i><i></i><i></i></span>
        <div>
          <small>초미세먼지</small>
          <strong>{{ fineDustStatus.label }}</strong>
          <em>{{ Number.isFinite(airQuality?.pm25) ? airQuality.pm25.toFixed(1) : '--' }}㎍/㎥</em>
        </div>
      </div>
    </div>
    <div class="outdoor-index" :class="`outdoor-index--${outdoorStatus.level}`">
      <div class="outdoor-person" aria-hidden="true">
        <i class="person-head"><b class="person-mask"></b></i>
        <i class="person-body"></i>
        <i class="person-arm person-arm-left"></i>
        <i class="person-arm person-arm-right"></i>
        <i class="person-leg person-leg-left"></i>
        <i class="person-leg person-leg-right"></i>
      </div>
      <div>
        <strong>{{ outdoorStatus.title }}</strong>
        <p>{{ outdoorStatus.copy }}</p>
      </div>
    </div>
  </div>
</template>
