<script setup>
import { computed } from 'vue'
import { WEATHER_CODES } from '@/constants/weatherCode'

const props = defineProps({
  status: { type: String, default: '' },
  type: { type: String, default: '' },
  size: { type: String, default: 'medium' },
})

const graphicType = computed(() => props.type || WEATHER_CODES[props.status] || 'cloudy')
</script>

<template>
  <span class="weather-graphic" :class="[`weather-graphic--${graphicType}`, `weather-graphic--${size}`]" aria-hidden="true">
    <i class="graphic-sun"></i>
    <i class="graphic-cloud graphic-cloud-back"></i>
    <i class="graphic-cloud graphic-cloud-front"></i>
    <i class="graphic-precipitation graphic-precipitation-one"></i>
    <i class="graphic-precipitation graphic-precipitation-two"></i>
    <i class="graphic-precipitation graphic-precipitation-three"></i>
    <i class="graphic-lightning"></i>
    <i class="graphic-fog graphic-fog-one"></i>
    <i class="graphic-fog graphic-fog-two"></i>
  </span>
</template>
