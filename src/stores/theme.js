import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { TIME_THEMES, VALID_THEMES } from '@/constants/theme'
import { THEME_STORAGE_KEY } from '@/constants/storage'

const loadTheme = () => {
  try {
    const savedTheme = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY))
    return {
      preference: VALID_THEMES.includes(savedTheme?.preference) ? savedTheme.preference : 'auto',
      automatic: TIME_THEMES.includes(savedTheme?.automatic) ? savedTheme.automatic : 'night',
    }
  } catch {
    return { preference: 'auto', automatic: 'night' }
  }
}

export const useThemeStore = defineStore('theme', () => {
  const initialTheme = loadTheme()
  const themePreference = ref(initialTheme.preference)
  const automaticTheme = ref(initialTheme.automatic)
  const resolvedTheme = computed(() => (themePreference.value === 'auto' ? automaticTheme.value : themePreference.value))

  const setAutomaticTheme = (theme) => {
    if (TIME_THEMES.includes(theme)) automaticTheme.value = theme
  }

  watch(
    [themePreference, automaticTheme],
    () => {
      document.documentElement.dataset.timeTheme = resolvedTheme.value
      localStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({
          preference: themePreference.value,
          automatic: automaticTheme.value,
        }),
      )
    },
    { immediate: true },
  )

  return { themePreference, automaticTheme, resolvedTheme, setAutomaticTheme }
})
