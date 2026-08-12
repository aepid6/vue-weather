<script setup>
import { computed, watch } from 'vue'
import { applyTimeTheme, automaticTheme, themePreference } from '@/utils/theme'

const themeOptions = [
  { value: 'auto', label: '자동' },
  { value: 'morning', label: '아침' },
  { value: 'afternoon', label: '낮' },
  { value: 'evening', label: '저녁' },
  { value: 'night', label: '밤' }
]

const resolvedTheme = computed(() => {
  return themePreference.value === 'auto' ? automaticTheme.value : themePreference.value
})

watch(themePreference, (theme) => {
  applyTimeTheme(theme === 'auto' ? automaticTheme.value : theme)
}, { immediate: true })
</script>

<template>
  <div class="theme-atmosphere" :class="`theme-atmosphere--${resolvedTheme}`" aria-hidden="true">
    <span class="atmosphere-orb"></span>
    <span class="atmosphere-cloud cloud-a"></span>
    <span class="atmosphere-cloud cloud-b"></span>
    <span v-for="star in 9" :key="star" class="atmosphere-star" :style="{ '--star-index': star }"></span>
  </div>
  <header class="site-header">
    <RouterLink to="/" class="brand no-under-line">
      <span class="brand-mark" :class="`brand-mark--${resolvedTheme}`" aria-hidden="true">
        <i class="brand-sky-object"></i>
        <i class="brand-horizon"></i>
        <i class="brand-cloud"></i>
        <i class="brand-star brand-star-one"></i>
        <i class="brand-star brand-star-two"></i>
      </span>
      <span>SKALA Weather</span>
    </RouterLink>
    <div class="header-nav">
      <label class="theme-selector">
        <span class="sr-only">테마 선택</span>
        <select v-model="themePreference" aria-label="테마 선택">
          <option v-for="theme in themeOptions" :key="theme.value" :value="theme.value">
            {{ theme.label }}
          </option>
        </select>
      </label>
      <nav aria-label="주요 메뉴">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/cities">Cities</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <main class="app-content">
    <RouterView />
  </main>
</template>

<style scoped></style>
