<script setup>
import { CITIES } from '@/constants/cities'

const props = defineProps({
    searchQuery: String
})

const emitQuery = defineEmits(['update:searchQuery'])

const recommendedCities = CITIES
    .filter((city) => ['서울', '부산', '강릉', '전주', '제주'].includes(city.name))
    .map((city) => city.name)

const searchCityEvent = (e) => {
    emitQuery('update:searchQuery', e.target.value)
}

const selectRecommendedCity = (cityName) => {
    emitQuery('update:searchQuery', cityName)
}
</script>

<template>
    <div class="search-bar">
        <label class="search-input-wrap">
            <span aria-hidden="true">⌕</span>
            <input type="text" :value="props.searchQuery" @input="searchCityEvent" placeholder="도시 이름 또는 초성을 입력하세요">
        </label>
        <div class="recommended-searches" aria-label="추천 검색어">
            <span>추천 검색어</span>
            <button
                v-for="cityName in recommendedCities"
                :key="cityName"
                @click="selectRecommendedCity(cityName)"
            >
                {{ cityName }}
            </button>
        </div>
    </div>
</template>
