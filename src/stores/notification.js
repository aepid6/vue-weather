import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
  const hasShownOpenMeteoRateLimit = ref(false)

  const claimOpenMeteoRateLimitNotice = () => {
    if (hasShownOpenMeteoRateLimit.value) return false

    hasShownOpenMeteoRateLimit.value = true
    return true
  }

  return { hasShownOpenMeteoRateLimit, claimOpenMeteoRateLimitNotice }
})
