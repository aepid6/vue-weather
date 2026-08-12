<script setup>
import { ref } from 'vue'
import { getWeatherAPI } from '@/services/weatherAPI'
import { CITIES } from '@/constants/cities'
import { WEATHER_CODES } from '@/constants/weatherCode'

const props = defineProps({
    selectedCityId: String
})

const weather = ref({})
const time = ref('')
const selectedCity = CITIES.find(city => city.id === props.selectedCityId)

const emit = defineEmits(['update:selectedCityId'])
const backInfo = () => {
    emit('update:selectedCityId', '')
}

const loadWeather = async (city) => {
  try {
    const response = await getWeatherAPI(city)
    weather.value = response.current

    time.value = new Date(response.current.time).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch (err) {
    console.error('날씨 데이터를 불러오지 못했습니다.', err)
  }
}

loadWeather(selectedCity)
</script>
<template>
    <section class="selected-weather" aria-live="polite">
        <div class="selected-sky" aria-hidden="true">
            <span class="sky-orbit orbit-one"></span>
            <span class="sky-orbit orbit-two"></span>
            <span class="sky-star star-one">✦</span>
            <span class="sky-star star-two">✦</span>
            <span class="sky-star star-three">·</span>
            <span class="weather-symbol">{{ WEATHER_CODES[weather.weather_code]?.icon || '✦' }}</span>
            <span class="wind-line line-one"></span>
            <span class="wind-line line-two"></span>
        </div>
        <div class="selected-notice">
            <span class="notice-icon" aria-hidden="true">✦</span>
            <div>
                <p class="selected-label">NOW OBSERVING</p>
                <h3>{{ selectedCity.name }}</h3>
                <div class="selected-readings">
                    <span>기준시간 {{ time || '정보를 불러오는 중' }}</span>
                    <strong>{{ weather.temperature_2m ?? '--' }}<small>°C</small></strong>
                </div>
            </div>
        </div>
        <div class="selected-actions">
            <button @click="backInfo"><span aria-hidden="true">←</span> 도시 목록으로</button>
        </div>
    </section>
</template>
