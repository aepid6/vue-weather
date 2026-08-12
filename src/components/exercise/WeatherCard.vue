<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()

const props = defineProps({
    weatherList: Array,
    selectedCityInfo: String
})
const emit = defineEmits(['update:selectedCityInfo'])

const showSelect = (cityName) => {
    emit('update:selectedCityInfo', cityName)
}

const handleDetail = (cityId) => {
    router.push({
        name: 'Detail',
        params: {cityId}
    })
}
</script>

<template>
    <div class="weather-list">
        <div v-if="weatherList?.length == 0">
            <p class="empty-state">검색 결과가 일치하는 도시가 없습니다.</p>
        </div>
        <div v-else class="weather-grid">
            <div class="weather-item" v-for="city in props.weatherList" :key="city.id" @click="showSelect(city.name)">
                <div class="city-meta">
                    <span class="weather-icon" aria-hidden="true">{{ city.status === '맑음' ? '☀' : city.status === '비' ? '☂' : city.status === '구름' ? '☁' : '☁' }}</span>
                    <div>
                        <p class="city-name">{{ city.name }}</p>
                        <p class="weather-status">{{ city.status }}</p>
                    </div>
                </div>
                <div class="city-reading">
                    <p class="temperature">{{ city.temp }}<small>°</small></p>
                    <span class="temperature-feel" v-if="city.temp > 25">더움</span>
                    <span class="temperature-feel" v-else>선선함</span>
                </div>
                <button class="detail-button" @click.stop="handleDetail(city.id)">상세보기 <span aria-hidden="true">→</span></button>
            </div>
        </div>
    </div>
</template>
