<script setup>
import { computed } from 'vue'
import { WEATHER_CODES } from '@/constants/weatherCode'

const props = defineProps({
  city: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const observedTime = computed(() => {
  const time = props.city.observedAt

  if (!time) return '정보를 불러오는 중'

  return new Date(time).toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
})

const temperatureChangeText = computed(() => {
  const change = props.city.temperatureChange

  if (!Number.isFinite(change)) return '비교 정보 없음'
  if (change === 0) return '1시간 전과 동일'

  return `1시간 전보다 ${change > 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}°C`
})
</script>

<template>
  <section class="selected-weather" aria-live="polite">
    <div class="selected-sky" aria-hidden="true">
      <span class="sky-orbit orbit-one"></span>
      <span class="sky-orbit orbit-two"></span>
      <span class="sky-star star-one">✦</span>
      <span class="sky-star star-two">✦</span>
      <span class="sky-star star-three">·</span>
      <span class="weather-symbol">{{ WEATHER_CODES[city.weatherCode]?.icon || '✦' }}</span>
      <span class="wind-line line-one"></span>
      <span class="wind-line line-two"></span>
    </div>
    <div class="selected-notice">
      <span class="notice-icon" aria-hidden="true">✦</span>
      <div>
        <p class="selected-label">NOW OBSERVING</p>
        <h3>{{ city.name }}</h3>
        <div class="selected-readings">
          <span>기준시간 {{ observedTime }}</span>
          <strong>{{ city.currentTemp ?? '--' }}<small>°C</small></strong>
        </div>
        <p class="temperature-change" :class="{ down: city.temperatureChange < 0 }">
          {{ temperatureChangeText }}
        </p>
      </div>
    </div>
    <div class="selected-actions">
      <button @click="emit('close')"><span aria-hidden="true">←</span> 지도에서 닫기</button>
    </div>
  </section>
</template>
