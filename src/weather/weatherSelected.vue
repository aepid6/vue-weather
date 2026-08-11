<script setup>
const props = defineProps({
    selectedCityInfo: String
})
</script>

<template>
    <div>
        <p v-if="!props.selectedCityInfo">카드를 클릭하거나 검색해 보세요.</p>
        <p v-else>{{ selectedCityInfo }}이 선택되었습니다.</p>
    </div>
</template>