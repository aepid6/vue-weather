<script setup>
import {ref} from 'vue'
import SEARCH from '@/weather/weatherSearch.vue'
import CARD from '@/weather/weatherCard.vue'
import SELECTED from '@/weather/weatherSelected.vue'

const searchQuery = ref('')
const selectedCityInfo = ref('')

const weatherList = ref([
    {id: 'city_01', name: '서울', temp: 28, status: '맑음' },
    {id: 'city_02', name: '수원', temp: 24, status: '비' },
    {id: 'city_03', name: '부산', temp: 26, status: '구름' },
    {id: 'city_04', name: '울산', temp: 25, status: '맑음' },
    {id: 'city_05', name: '포항', temp: 27, status: '흐림' }
])
</script>

<template>
    <SEARCH v-model:searchQuery="searchQuery"/>
    <CARD :weatherList="weatherList" v-model:selectedCityInfo="selectedCityInfo"/>
    <SELECTED :key="selectedCityInfo" :selectedCityInfo="selectedCityInfo" />
</template>