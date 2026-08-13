import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'weather-theme'
const VALID_THEMES = ['auto', 'morning', 'afternoon', 'evening', 'night']

const loadTheme = () => {
  try {
    const savedTheme = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return {
      preference: VALID_THEMES.includes(savedTheme?.preference) ? savedTheme.preference : 'auto',
      automatic: VALID_THEMES.slice(1).includes(savedTheme?.automatic) ? savedTheme.automatic : 'night'
    }
  } catch {
    return { preference: 'auto', automatic: 'night' }
  }
}

export const useThemeStore = defineStore('theme', () => {
  const initialTheme = loadTheme()
  const themePreference = ref(initialTheme.preference)
  const automaticTheme = ref(initialTheme.automatic)
  const resolvedTheme = computed(() => themePreference.value === 'auto'
    ? automaticTheme.value
    : themePreference.value)

  const setAutomaticTheme = (theme) => {
    if (VALID_THEMES.slice(1).includes(theme)) automaticTheme.value = theme
  }

  watch([themePreference, automaticTheme], () => {
    document.documentElement.dataset.timeTheme = resolvedTheme.value
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      preference: themePreference.value,
      automatic: automaticTheme.value
    }))
  }, { immediate: true })

  return { themePreference, automaticTheme, resolvedTheme, setAutomaticTheme }
})
