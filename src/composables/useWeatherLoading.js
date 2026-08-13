import { onUnmounted, ref } from 'vue'

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export const useWeatherLoading = () => {
  const loading = ref(true)
  const loadingProgress = ref(0)
  let targetProgress = 0
  let animationFrame

  const animateProgress = () => {
    const distance = targetProgress - loadingProgress.value

    if (distance > 0) {
      const increment = Math.max(targetProgress === 100 ? 0.35 : 0.18, distance * 0.07)
      loadingProgress.value = Math.min(targetProgress, loadingProgress.value + increment)

      if (targetProgress - loadingProgress.value < 0.05) {
        loadingProgress.value = targetProgress
      }
    }

    if (loading.value) animationFrame = requestAnimationFrame(animateProgress)
  }

  animationFrame = requestAnimationFrame(animateProgress)

  const updateLoading = (progress) => {
    if (!loading.value) return

    targetProgress = Math.max(targetProgress, Math.min(100, progress))
  }

  const waitForProgress = async (progress) => {
    while (loadingProgress.value < progress) await wait(16)
  }

  const completeLoading = async () => {
    updateLoading(94)
    await waitForProgress(94)
    updateLoading(100)
    await waitForProgress(100)
    await wait(360)
    loading.value = false
    cancelAnimationFrame(animationFrame)
  }

  onUnmounted(() => cancelAnimationFrame(animationFrame))

  return {
    loading,
    loadingProgress,
    updateLoading,
    completeLoading
  }
}
