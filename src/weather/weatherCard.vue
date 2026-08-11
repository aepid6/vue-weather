<script setup>
const props = defineProps({
    weatherList: Array,
    selectedCityInfo: String
})
const emit = defineEmits(['update:selectedCityInfo'])

const showSelect = (cityName) => {
    emit('update:selectedCityInfo', cityName)
}

const showDetail = (cityName, status) => {
    window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
    <div>
        <p>지역별 날씨 현황</p>
        <div v-for="city in props.weatherList" :key="city.id" @click="showSelect(city.name)">
            <div>
                <p>{{ city.name }} ({{ city.status }})</p>
                <p>현재 기온: {{ city.temp }}</p>
                <span v-if="city.temp > 25" class="bg-red">더움</span>
                <span v-else class="bg-skyblue">선선함</span>
            </div>
            <div>
                <button @click.stop="showDetail(city.name, city.status)">상세보기</button>
            </div>
        </div>
    </div>
</template>