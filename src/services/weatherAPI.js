import axios from 'axios'
import { CITIES } from '@/constants/cities'
import { getWeatherStatus } from '@/constants/weatherCode'
import { useNotificationStore } from '@/stores/notification'
import { notify } from '@/utils/notification'

const currentWeatherAPIURL = 'https://api.openweathermap.org/data/2.5/weather'
const airPollutionAPIURL = 'https://api.openweathermap.org/data/2.5/air_pollution'
const hourlyWeatherAPIURL = 'https://api.open-meteo.com/v1/forecast'
const weatherCacheDuration = 15 * 60 * 1000
const requestTimeout = 8000
const currentWeatherCacheKey = 'weather-current-cache'
const hourlyWeatherCacheKey = 'weather-hourly-cache'

const currentWeatherAPI = axios.create({
  baseURL: currentWeatherAPIURL,
  timeout: requestTimeout,
  params: {
    appid: import.meta.env.WEATHER_API_KEY,
    units: 'metric',
    lang: 'kr',
  },
})

const hourlyWeatherAPI = axios.create({
  baseURL: hourlyWeatherAPIURL,
  timeout: requestTimeout,
})

const readWeatherCache = (key) => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(key))
    return cached?.savedAt && Array.isArray(cached.data) ? cached : null
  } catch {
    return null
  }
}

const writeWeatherCache = (key, response) => {
  const cache = { savedAt: Date.now(), data: response.data }

  try {
    sessionStorage.setItem(key, JSON.stringify(cache))
  } catch {
    // 저장 공간을 사용할 수 없어도 메모리 캐시는 유지합니다.
  }

  return cache
}

const isFreshCache = (cache) => cache && Date.now() - cache.savedAt < weatherCacheDuration

let currentWeatherCache = readWeatherCache(currentWeatherCacheKey)
let hourlyWeatherCache = readWeatherCache(hourlyWeatherCacheKey)
let currentWeatherBatchRequest = null
let hourlyWeatherBatchRequest = null
let completedCurrentRequests = 0
const currentProgressListeners = new Set()
const hourlyProgressListeners = new Set()

const emitCurrentProgress = (cached = false) => {
  currentProgressListeners.forEach((listener) =>
    listener({
      completed: cached ? CITIES.length : completedCurrentRequests,
      total: CITIES.length,
      cached,
    }),
  )
}

const emitHourlyProgress = (completed, cached = false, failed = false) => {
  hourlyProgressListeners.forEach((listener) => listener({ completed, total: 1, cached, failed }))
}

const throwIfOpenMeteoRateLimited = () => {
  const notificationStore = useNotificationStore()

  if (notificationStore.hasShownOpenMeteoRateLimit) {
    emitHourlyProgress(1, false, true)
    throw new Error('Open-Meteo API 호출 한도에 도달했습니다.')
  }
}

hourlyWeatherAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const notificationStore = useNotificationStore()

      if (notificationStore.claimOpenMeteoRateLimitNotice()) {
        notify({
          severity: 'error',
          summary: '예보 API 호출 한도 도달',
          detail: '오늘 API 호출이 한계에 다다랐습니다.',
          closable: true,
        })
      }
    }

    return Promise.reject(error)
  },
)

const toLocalISOString = (timestamp, timezoneOffset = 0) => {
  if (!timestamp) return ''

  return new Date((timestamp + timezoneOffset) * 1000).toISOString().replace('Z', '')
}

const normalizeCurrentWeatherData = (weatherData) => {
  const observedAt = toLocalISOString(weatherData.dt, weatherData.timezone)
  const currentTemp = weatherData.main?.temp ?? null
  const weatherStatus = getWeatherStatus(weatherData.weather?.[0]?.id)

  return {
    current: {
      time: observedAt,
      temperature_2m: currentTemp,
      weather_status: weatherStatus,
    },
    openWeatherDescription: weatherData.weather?.[0]?.description ?? '',
    details: {
      feelsLike: weatherData.main?.feels_like ?? null,
      tempMin: weatherData.main?.temp_min ?? null,
      tempMax: weatherData.main?.temp_max ?? null,
      humidity: weatherData.main?.humidity ?? null,
      pressure: weatherData.main?.pressure ?? null,
      windSpeed: weatherData.wind?.speed ?? null,
      windDirection: weatherData.wind?.deg ?? null,
      visibility: weatherData.visibility ?? null,
      cloudiness: weatherData.clouds?.all ?? null,
    },
    sunrise: toLocalISOString(weatherData.sys?.sunrise, weatherData.timezone),
    sunset: toLocalISOString(weatherData.sys?.sunset, weatherData.timezone),
  }
}

const requestCurrentWeather = async (city) => {
  const response = await currentWeatherAPI.get('', {
    params: {
      lat: city.lat,
      lon: city.lon,
    },
  })

  return normalizeCurrentWeatherData(response.data)
}

export const getAllCurrentWeatherAPI = async ({ force = false, onProgress } = {}) => {
  if (onProgress) currentProgressListeners.add(onProgress)

  try {
    if (!force && isFreshCache(currentWeatherCache)) {
      emitCurrentProgress(true)
      return { data: currentWeatherCache.data }
    }

    if (!currentWeatherBatchRequest) {
      completedCurrentRequests = 0
      emitCurrentProgress()
      currentWeatherBatchRequest = Promise.allSettled(
        CITIES.map(async (city) => {
          try {
            return await requestCurrentWeather(city)
          } finally {
            completedCurrentRequests += 1
            emitCurrentProgress()
          }
        }),
      )
        .then((results) => {
          const data = results.map((result, index) => (result.status === 'fulfilled' ? result.value : (currentWeatherCache?.data?.[index] ?? null)))

          if (data.every((weather) => weather === null)) {
            throw new Error('현재 날씨 정보를 가져오지 못했습니다.')
          }

          const response = { data }
          currentWeatherCache = writeWeatherCache(currentWeatherCacheKey, response)
          return response
        })
        .finally(() => {
          currentWeatherBatchRequest = null
        })
    } else {
      emitCurrentProgress()
    }

    return await currentWeatherBatchRequest
  } finally {
    if (onProgress) currentProgressListeners.delete(onProgress)
  }
}

export const getCurrentWeatherAPI = async (city) => {
  const cityIndex = CITIES.findIndex((item) => item.id === city.id)

  if (cityIndex >= 0 && isFreshCache(currentWeatherCache) && currentWeatherCache.data[cityIndex]) {
    return currentWeatherCache.data[cityIndex]
  }

  return requestCurrentWeather(city)
}

export const getAirPollutionAPI = async (city) => {
  const response = await axios.get(airPollutionAPIURL, {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: import.meta.env.WEATHER_API_KEY,
    },
  })

  return {
    aqi: response.data.list?.[0]?.main?.aqi ?? null,
    pm25: response.data.list?.[0]?.components?.pm2_5 ?? null,
    pm10: response.data.list?.[0]?.components?.pm10 ?? null,
  }
}

export const getAllHourlyWeatherAPI = async ({ force = false, onProgress } = {}) => {
  if (onProgress) hourlyProgressListeners.add(onProgress)

  try {
    if (!force && isFreshCache(hourlyWeatherCache)) {
      emitHourlyProgress(1, true)
      return { data: hourlyWeatherCache.data }
    }

    throwIfOpenMeteoRateLimited()

    if (!hourlyWeatherBatchRequest) {
      emitHourlyProgress(0)
      hourlyWeatherBatchRequest = hourlyWeatherAPI
        .get('', {
          params: {
            latitude: CITIES.map((city) => city.lat).join(','),
            longitude: CITIES.map((city) => city.lon).join(','),
            hourly: 'temperature_2m,weather_code',
            daily: 'temperature_2m_max,temperature_2m_min',
            past_hours: 3,
            forecast_hours: 9,
            forecast_days: 1,
            timezone: 'Asia/Seoul',
          },
        })
        .then((response) => {
          const normalizedResponse = { data: response.data }
          hourlyWeatherCache = writeWeatherCache(hourlyWeatherCacheKey, normalizedResponse)
          emitHourlyProgress(1)
          return normalizedResponse
        })
        .finally(() => {
          hourlyWeatherBatchRequest = null
        })
    }

    return await hourlyWeatherBatchRequest
  } finally {
    if (onProgress) hourlyProgressListeners.delete(onProgress)
  }
}

export const getHourlyWeatherAPI = async (city) => {
  const cityIndex = CITIES.findIndex((item) => item.id === city.id)

  if (cityIndex >= 0 && isFreshCache(hourlyWeatherCache)) {
    const cachedHourlyWeather = hourlyWeatherCache.data[cityIndex]
    if (cachedHourlyWeather) return cachedHourlyWeather
  }

  throwIfOpenMeteoRateLimited()

  const response = await hourlyWeatherAPI.get('', {
    params: {
      latitude: city.lat,
      longitude: city.lon,
      hourly: 'temperature_2m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min',
      past_hours: 3,
      forecast_hours: 9,
      forecast_days: 1,
      timezone: 'Asia/Seoul',
    },
  })

  return response.data
}

export const getSunTimeAPI = async (city) => {
  const weatherData = await requestCurrentWeather(city)

  return {
    sunrise: weatherData.sunrise ? [weatherData.sunrise] : [],
    sunset: weatherData.sunset ? [weatherData.sunset] : [],
  }
}
