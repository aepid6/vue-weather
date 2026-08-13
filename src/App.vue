<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import SELECT from 'primevue/select'
import TOAST from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useThemeStore } from '@/stores/theme'
import { onNotification } from '@/utils/notification'
import { THEME_OPTIONS } from '@/constants/theme'

const themeStore = useThemeStore()
const { themePreference, resolvedTheme } = storeToRefs(themeStore)
const toast = useToast()
let removeNotificationListener

onMounted(() => {
  removeNotificationListener = onNotification((message) => toast.add(message))
})

onBeforeUnmount(() => removeNotificationListener?.())

</script>

<template>
  <TOAST
    position="top-center"
    class="weather-toast"
    :pt="{
      message: { class: 'weather-toast-message' },
      messageContent: { class: 'weather-toast-content' },
      messageText: { class: 'weather-toast-text' },
      summary: { class: 'weather-toast-summary' },
      detail: { class: 'weather-toast-detail' },
      closeButton: { class: 'weather-toast-close' },
      closeIcon: { class: 'weather-toast-close-icon' },
    }"
  >
    <template #messageicon>
      <span class="weather-toast-alert-icon" aria-hidden="true">!</span>
    </template>
  </TOAST>
  <div class="theme-atmosphere" :class="`theme-atmosphere--${resolvedTheme}`" aria-hidden="true">
    <span class="atmosphere-orb"></span>
    <span class="atmosphere-cloud cloud-a"></span>
    <span class="atmosphere-cloud cloud-b"></span>
    <span v-for="star in 9" :key="star" class="atmosphere-star" :class="`atmosphere-star--${star}`"></span>
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
        <SELECT
          v-model="themePreference"
          :options="THEME_OPTIONS"
          optionLabel="label"
          optionValue="value"
          aria-label="테마 선택"
          appendTo="self"
          :pt="{
            root: { class: 'p-select flex h-[34px] cursor-pointer items-center rounded-[10px] border border-white/10 bg-slate-950/55 text-[10px] font-bold text-cyan-100 outline-none transition focus-within:border-cyan-300/60 focus-within:ring-3 focus-within:ring-cyan-300/10' },
            label: { class: 'min-w-0 flex-1 px-2.5 font-mono' },
            dropdown: { class: 'grid w-7 place-items-center text-cyan-200/70' },
            overlay: { class: 'p-select-overlay z-[304] mt-1 overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl backdrop-blur-xl' },
            list: { class: 'grid gap-0.5' },
            option: { class: 'p-select-option cursor-pointer rounded-lg px-2.5 py-2 font-mono text-[10px] text-slate-300 outline-none transition hover:bg-white/10 hover:text-white' },
          }"
        />
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

<!-- prettier-ignore -->
<style scoped></style>
