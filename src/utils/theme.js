import { ref } from 'vue'

export const themePreference = ref('auto')
export const automaticTheme = ref('night')

export const applyTimeTheme = (theme) => {
  document.documentElement.dataset.timeTheme = theme
}

export const setAutomaticTheme = (theme) => {
  automaticTheme.value = theme

  if (themePreference.value === 'auto') applyTimeTheme(theme)
}
