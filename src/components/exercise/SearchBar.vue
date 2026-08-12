<script setup>
const props = defineProps({
    searchQuery: String
})

const emitQuery = defineEmits(['update:searchQuery'])

const searchCityEvent = (e) => {
    emitQuery('update:searchQuery', e.target.value)
}
</script>

<template>
    <div class="search-bar">
        <label class="search-input-wrap">
            <span aria-hidden="true">⌕</span>
            <input type="text" :value="props.searchQuery" @input="searchCityEvent" placeholder="도시 이름을 입력하세요">
        </label>
        <p class="search-status">검색 중인 도시: <strong>{{ props.searchQuery || '전체' }}</strong></p>
    </div>
</template>
