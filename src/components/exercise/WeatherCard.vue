<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()

const props = defineProps({
    weatherList: Array,
    selectedCityId: String
})
const emit = defineEmits(['update:selectedCityId'])

const showSelect = (cityId) => {
    emit('update:selectedCityId', cityId)
}

const handleDetail = (cityId) => {
    console.log(cityId)
    router.push({
        name: 'Detail',
        params: {cityId}
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
                <div class="city-meta">
                    <span class="weather-icon" aria-hidden="true">{{ city.status === '맑음' ? '☀' : city.status === '비' ? '☂' : city.status === '구름' ? '☁' : '☁' }}</span>
                    <div>
                        <p class="city-name">{{ city.name }}</p>
                        <p class="weather-status">{{ city.status }}</p>
                    </div>
                </div>
                <div class="city-reading">
                    <p class="temperature">{{ city.currentTemp }}<small>&nbsp;&nbsp;°c</small></p>
                    <p class="temperature-change" :class="{ down: city.temperatureChange < 0 }">
                        {{ temperatureChangeText(city) }}
                    </p>
                </div>
                <button class="detail-button" @click.stop="handleDetail(city.id)">상세보기 <span aria-hidden="true">→</span></button>
            </div>
        </div>
    </div>
</template>
