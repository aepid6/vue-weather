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
    <div>
        <input type="text" :value="props.searchQuery" @input="searchCityEvent">
        <p>검색 중인 도시: {{ props.searchQuery }}</p>
    </div>
</template>