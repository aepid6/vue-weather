<script setup>
import { computed } from 'vue'
import { formatTemperature } from '@/utils/weather'
import CITYSCENE from '@/components/WeatherCityScene.vue'
import OUTDOORINDEX from '@/components/WeatherOutdoorIndex.vue'
import WEATHERGRAPHIC from '@/components/WeatherGraphic.vue'

const props = defineProps({
  city: {
    type: Object,
    required: true
  },
  closeLabel: {
    type: String,
    default: '도시 상세 정보 닫기'
  }
})

const emit = defineEmits(['close'])

const observedTime = computed(() => {
  if (!props.city.observedAt) return '정보를 불러오는 중'

  return new Date(props.city.observedAt).toLocaleString('ko-KR', {
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
    <button class="map-modal-close" type="button" :aria-label="closeLabel" @click="emit('close')">×</button>
    <div class="selected-sky" aria-hidden="true">
      <CITYSCENE :city="city" />
      <span class="sky-orbit orbit-one"></span>
      <span class="sky-orbit orbit-two"></span>
      <span class="sky-star star-one"></span>
      <span class="sky-star star-two"></span>
      <span class="sky-star star-three"></span>
      <WEATHERGRAPHIC class="weather-symbol" :status="city.weatherStatus" size="large" />
      <span class="wind-line line-one"></span>
      <span class="wind-line line-two"></span>
    </div>
    <div class="selected-notice">
      <span class="notice-icon" aria-hidden="true"></span>
      <div>
        <h3>{{ city.name }}</h3>
        <div class="selected-readings">
          <span>기준시간 {{ observedTime }}</span>
          <strong>{{ formatTemperature(city.currentTemp) }}<small>°C</small></strong>
        </div>
        <p class="temperature-change" :class="{ down: city.temperatureChange < 0 }">
          {{ temperatureChangeText }}
        </p>
        <OUTDOORINDEX :city="city" />
      </div>
    </div>
    <div class="selected-actions">
      <RouterLink class="map-modal-detail" :to="{ name: 'Detail', params: { cityId: city.id } }">
        상세 날씨 보기 <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </section>
</template>
