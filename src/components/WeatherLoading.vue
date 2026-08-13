<script setup>
import { computed } from 'vue'
import WEATHERGRAPHIC from '@/components/WeatherGraphic.vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
})

const normalizedProgress = computed(() => Math.min(100, Math.max(0, Math.round(props.progress))))
</script>

<template>
  <section class="weather-loading" role="status" aria-live="polite" aria-label="날씨 정보를 불러오는 중">
    <div class="loading-sky" aria-hidden="true">
      <span class="loading-orbit orbit-outer"></span>
      <span class="loading-orbit orbit-inner"></span>
      <WEATHERGRAPHIC class="loading-weather-graphic" type="partly-cloudy" size="large" />
      <span class="loading-scan"></span>
      <span class="loading-star load-star-one"></span>
      <span class="loading-star load-star-two"></span>
    </div>
    <p class="loading-kicker">WEATHER SATELLITE</p>
    <h1>하늘의 신호를<br><em>수신하고 있어요.</em></h1>
    <div class="loading-progress">
      <progress :value="normalizedProgress" max="100" aria-label="날씨 정보 로딩 진행률">
        {{ normalizedProgress }}%
      </progress>
    </div>
  </section>
</template>
