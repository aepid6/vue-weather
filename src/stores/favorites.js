import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'weather-favorite-cities'

const loadFavorites = () => {
  try {
    const savedFavorites = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(savedFavorites) ? savedFavorites : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteCityIds = ref(loadFavorites())

  const toggleFavorite = (cityId) => {
    favoriteCityIds.value = favoriteCityIds.value.includes(cityId) ? favoriteCityIds.value.filter((id) => id !== cityId) : [...favoriteCityIds.value, cityId]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteCityIds.value))
  }

  return { favoriteCityIds, toggleFavorite }
})
