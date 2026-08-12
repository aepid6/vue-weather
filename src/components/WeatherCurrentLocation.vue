<script setup>
import { computed, ref, watch } from 'vue'
import { formatTemperature } from '@/utils/weather'

const props = defineProps({
  city: {
    type: Object,
    default: null
  }
})

const portCities = ['부산', '울산', '포항', '인천', '목포', '여수', '창원', '강릉', '속초', '동해', '삼척', '서산', '보령', '군산', '광양', '통영', '거제']
const mountainCities = ['춘천', '원주', '태백', '홍천', '충주', '제천', '영주', '문경', '김천']
const heritageCities = ['전주', '경주', '안동', '공주', '남원']

const cityLandmark = computed(() => {
  const name = props.city?.name

  if (['제주', '서귀포'].includes(name)) return { type: 'island', label: '섬과 바람' }
  if (heritageCities.includes(name)) return { type: 'heritage', label: '역사 도시' }
  if (portCities.includes(name)) return { type: 'port', label: '항구 도시' }
  if (mountainCities.includes(name)) return { type: 'mountain', label: '산악 도시' }
  return { type: 'city', label: '도심 풍경' }
})

const temperatureChangeText = computed(() => {
  const change = props.city?.temperatureChange

  if (!Number.isFinite(change)) return '비교 정보 없음'
  if (change === 0) return '1시간 전과 동일'

  return `1시간 전보다 ${change > 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}°C`
})

const isTemperatureUpdating = ref(false)
let updateTimer

watch(
  () => props.city?.currentTemp,
  (currentTemp, previousTemp) => {
    if (currentTemp === previousTemp || previousTemp === undefined) return

    isTemperatureUpdating.value = true
    clearTimeout(updateTimer)
    updateTimer = setTimeout(() => {
      isTemperatureUpdating.value = false
    }, 800)
  }
)

const currentTimelineIndex = computed(() => {
  const timeline = props.city?.temperatureTimeline ?? []
  const currentTime = props.city?.observedAt
  const matchedIndex = timeline.findIndex((hour) => hour.time === currentTime)

  if (matchedIndex >= 0) return matchedIndex

  const currentTimestamp = new Date(currentTime).getTime()
  const pastHourCount = timeline.filter((hour) => new Date(hour.time).getTime() <= currentTimestamp).length

  return Math.max(0, pastHourCount - 1)
})

const formatTime = (time) => {
  return new Date(time).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    hour12: false
  })
}
</script>

<template>
  <section v-if="city" class="current-location-card" aria-live="polite">
    <div
      :key="city.id"
      class="current-location-landmark"
      :class="`landmark-${cityLandmark.type}`"
      :aria-label="`${city.name} ${cityLandmark.label}`"
    >
      <span aria-hidden="true"><b></b><b></b><b></b></span>
      <i aria-hidden="true"></i>
    </div>
    <div>
      <p>현재 위치</p>
      <h2>{{ city.name }}</h2>
    </div>
    <div class="current-location-reading">
      <strong :class="{ updating: isTemperatureUpdating }">{{ formatTemperature(city.currentTemp) }}<small>°C</small></strong>
      <span :class="{ down: city.temperatureChange < 0 }">{{ temperatureChangeText }}</span>
    </div>
    <div class="location-forecast" aria-label="12시간 기온 예보">
      <div class="location-forecast-track">
        <div
          v-for="(hour, index) in city.temperatureTimeline"
          :key="hour.time"
          class="location-forecast-item"
          :class="{
            current: index === currentTimelineIndex,
            future: index > currentTimelineIndex
          }"
          :style="{ '--forecast-index': index }"
        >
          <span>{{ index === currentTimelineIndex ? '현재' : formatTime(hour.time) }}</span>
          <strong>{{ formatTemperature(hour.temp) }}°</strong>
          <i aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <RouterLink class="current-location-detail" :to="{ name: 'Detail', params: { cityId: city.id } }">
      상세 날씨 보기 <span aria-hidden="true">→</span>
    </RouterLink>
  </section>
</template>
