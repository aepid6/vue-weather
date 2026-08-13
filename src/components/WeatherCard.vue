<script setup>
import { useRouter } from 'vue-router'
import CITYSCENE from '@/components/WeatherCityScene.vue'
import { formatTemperature } from '@/utils/weather'
import WEATHERGRAPHIC from '@/components/WeatherGraphic.vue'
import BUTTON from 'primevue/button'

const router = useRouter()

const props = defineProps({
  weatherList: Array,
  selectedCityId: String,
  favoriteCityIds: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:selectedCityId', 'toggle-favorite'])

const showSelect = (cityId) => {
  emit('update:selectedCityId', cityId)
}

const handleDetail = (cityId) => {
  console.log(cityId)
  router.push({
    name: 'Detail',
    params: { cityId },
  })
}

const temperatureChangeText = (city) => {
  if (city.temperatureChange === null || city.temperatureChange === undefined) return '비교 정보 없음'
  if (city.temperatureChange === 0) return '1시간 전과 동일'

  return `1시간 전보다 ${city.temperatureChange > 0 ? '▲' : '▼'} ${Math.abs(city.temperatureChange).toFixed(1)}°C`
}
</script>

<template>
  <div class="weather-list">
    <div v-if="weatherList?.length == 0">
      <p class="empty-state">검색 결과가 일치하는 도시가 없습니다.</p>
    </div>
    <div v-else class="weather-grid">
      <div class="weather-item" v-for="city in props.weatherList" :key="city.id" @click="showSelect(city.id)">
        <BUTTON type="button" class="favorite-button" :class="{ active: favoriteCityIds.includes(city.id) }" :aria-label="`${city.name} ${favoriteCityIds.includes(city.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}`" :aria-pressed="favoriteCityIds.includes(city.id)" @click.stop="emit('toggle-favorite', city.id)"><span aria-hidden="true"></span></BUTTON>
        <CITYSCENE :city="city" compact />
        <div class="city-meta">
          <span class="weather-icon"><WEATHERGRAPHIC :status="city.weatherStatus" size="small" /></span>
          <div>
            <p class="city-name">{{ city.name }}</p>
            <p class="weather-status">{{ city.status }}</p>
          </div>
        </div>
        <div class="city-reading">
          <p class="temperature">{{ formatTemperature(city.currentTemp) }}<small>&nbsp;&nbsp;°c</small></p>
          <p class="temperature-change" :class="{ down: city.temperatureChange < 0 }">
            {{ temperatureChangeText(city) }}
          </p>
        </div>
        <button class="detail-button" @click.stop="handleDetail(city.id)">상세보기 <span aria-hidden="true">→</span></button>
      </div>
    </div>
  </div>
</template>
