<script setup>
const props = defineProps({
    selectedCityInfo: String
})
</script>

<template>
    <div class="selected-notice">
        <span class="notice-icon" aria-hidden="true">✦</span>
        <p v-if="!props.selectedCityInfo">카드를 클릭하거나 검색해 보세요.</p>
        <p v-else><strong>{{ selectedCityInfo }}</strong>이 선택되었습니다.</p>
    </div>
</template>
