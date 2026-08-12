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
    <div class="selected-notice">
        <span class="notice-icon" aria-hidden="true">✦</span>
        <div>
            <h3>{{ selectedCity.name }}</h3>
            <span>기준시간 {{ time }}</span>&nbsp;
            <span>{{ weather.temperature_2m }}</span>&nbsp;
            <span>{{ WEATHER_CODES[weather.weather_code]?.icon }}</span>
        </div>
    </div>
    <div>
        <button @click="backInfo">뒤로가기</button>
    </div>
</template>
