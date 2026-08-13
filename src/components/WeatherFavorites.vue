<script setup>
import { useRouter } from 'vue-router'
import { formatTemperature } from '@/utils/weather'
import WEATHERGRAPHIC from '@/components/WeatherGraphic.vue'

const router = useRouter()

defineProps({
  cities: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['remove'])

const openDetail = (cityId) => router.push({ name: 'Detail', params: { cityId } })

const removeFavorite = (event, cityId) => {
  event.preventDefault()
  event.stopPropagation()
  emit('remove', cityId)
}

const changeText = (change) => {
  if (!Number.isFinite(change)) return '비교 정보 없음'
  if (change === 0) return '1시간 전과 같음'
  return `${change > 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}°`
}
</script>

<template>
  <section v-if="cities.length" class="favorite-cities" aria-label="즐겨찾는 도시">
    <div class="favorite-cities-heading">
      <div>
        <span class="favorite-heading-star" aria-hidden="true"></span>
        <strong>즐겨찾는 도시</strong>
      </div>
      <small>{{ cities.length }}개 도시</small>
    </div>
    <div class="favorite-city-row">
      <article v-for="city in cities" :key="city.id" class="favorite-city-item" role="link" tabindex="0" @click="openDetail(city.id)" @keydown.enter="openDetail(city.id)">
        <WEATHERGRAPHIC :status="city.weatherStatus" size="small" />
        <div class="favorite-city-name">
          <strong>{{ city.name }}</strong>
          <span>{{ city.status }}</span>
        </div>
        <div class="favorite-city-reading">
          <strong>{{ formatTemperature(city.currentTemp) }}°</strong>
          <span :class="{ down: city.temperatureChange < 0 }">{{ changeText(city.temperatureChange) }}</span>
        </div>
        <div class="favorite-city-extra">
          <span>체감 {{ formatTemperature(city.details?.feelsLike) }}°</span>
          <span>습도 {{ city.details?.humidity ?? '--' }}%</span>
        </div>
        <button type="button" aria-label="즐겨찾기에서 제거" @click="removeFavorite($event, city.id)">×</button>
      </article>
    </div>
  </section>
</template>
