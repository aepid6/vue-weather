<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { CITIES } from '@/constants/cities'
import { matchesCityName } from '@/utils/search'

const props = defineProps({
  searchQuery: String
})

const emit = defineEmits(['update:searchQuery'])
const isOpen = ref(false)
const activeIndex = ref(-1)
const optionElements = ref([])
const listboxElement = ref(null)

const suggestions = computed(() => {
  const query = props.searchQuery?.trim() ?? ''

  if (!query) return []

  return CITIES
    .filter((city) => matchesCityName(city.name, query))
    .slice(0, 8)
})

const showSuggestions = computed(() => isOpen.value && suggestions.value.length > 0)
const listboxId = 'city-search-suggestions'

const updateQuery = (value) => {
  emit('update:searchQuery', value)
}

const searchCityEvent = (event) => {
  updateQuery(event.target.value)
  isOpen.value = true
  activeIndex.value = -1
}

const selectSuggestion = (city) => {
  updateQuery(city.name)
  isOpen.value = false
  activeIndex.value = -1
}

const moveActiveOption = async (direction) => {
  if (!suggestions.value.length) return

  isOpen.value = true
  activeIndex.value = direction > 0
    ? (activeIndex.value + 1) % suggestions.value.length
    : (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length

  await nextTick()
  const activeOption = optionElements.value[activeIndex.value]
  const listbox = listboxElement.value

  if (!activeOption || !listbox) return

  const optionTop = activeOption.offsetTop
  const optionBottom = optionTop + activeOption.offsetHeight

  if (optionTop < listbox.scrollTop) listbox.scrollTop = optionTop
  if (optionBottom > listbox.scrollTop + listbox.clientHeight) {
    listbox.scrollTop = optionBottom - listbox.clientHeight
  }
}

const handleKeydown = (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActiveOption(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActiveOption(-1)
  } else if (event.key === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault()
    selectSuggestion(suggestions.value[activeIndex.value])
  } else if (event.key === 'Escape') {
    isOpen.value = false
    activeIndex.value = -1
  }
}

watch(suggestions, () => {
  if (activeIndex.value >= suggestions.value.length) activeIndex.value = -1
})
</script>

<template>
  <div class="search-bar">
    <label class="search-input-wrap">
      <span aria-hidden="true">⌕</span>
      <input
        type="text"
        role="combobox"
        autocomplete="off"
        :value="props.searchQuery"
        :aria-expanded="showSuggestions"
        :aria-controls="listboxId"
        :aria-activedescendant="activeIndex >= 0 ? `city-suggestion-${suggestions[activeIndex].id}` : undefined"
        placeholder="도시 이름 또는 초성을 입력하세요"
        @input="searchCityEvent"
        @focus="isOpen = true"
        @blur="isOpen = false"
        @keydown="handleKeydown"
      >
    </label>
    <ul v-if="showSuggestions" :id="listboxId" ref="listboxElement" class="search-suggestions" role="listbox">
      <li
        v-for="(city, index) in suggestions"
        :id="`city-suggestion-${city.id}`"
        :key="city.id"
        :ref="(element) => optionElements[index] = element"
        role="option"
        :aria-selected="index === activeIndex"
        :class="{ active: index === activeIndex }"
        @mouseenter="activeIndex = index"
        @mousedown.prevent="selectSuggestion(city)"
      >
        <span>{{ city.name }}</span>
        <small>{{ city.province || '특별시·광역시' }}</small>
      </li>
    </ul>
  </div>
</template>
