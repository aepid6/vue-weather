<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  city: {
    type: Object,
    default: null
  }
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
    <div class="current-location-icon" aria-hidden="true">⌖</div>
    <div>
      <p>현재 위치</p>
      <h2>{{ city.name }}</h2>
    </div>
    <div class="current-location-reading">
      <strong :class="{ updating: isTemperatureUpdating }">{{ city.currentTemp ?? '--' }}<small>°C</small></strong>
      <span :class="{ down: city.temperatureChange < 0 }">{{ temperatureChangeText }}</span>
    </div>
    <div class="location-forecast" aria-label="12시간 기온 예보">
      <div class="location-forecast-heading">
        <span>12시간 기온 예보</span>
        <small>과거 3시간 · 앞으로 9시간</small>
      </div>
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
          <strong>{{ hour.temp }}°</strong>
          <i aria-hidden="true"></i>
        </div>
      </div>
    </div>
  </section>
</template>
