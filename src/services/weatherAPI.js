import axios from 'axios'
import { CITIES } from '@/constants/cities'
import { getWeatherStatus } from '@/constants/weatherCode'

const currentWeatherAPIURL = 'https://api.openweathermap.org/data/2.5/weather'
const airPollutionAPIURL = 'https://api.openweathermap.org/data/2.5/air_pollution'
const hourlyWeatherAPIURL = 'https://api.open-meteo.com/v1/forecast'

const currentWeatherAPI = axios.create({
  baseURL: currentWeatherAPIURL,
  params: {
    appid: import.meta.env.WEATHER_API_KEY,
    units: 'metric',
    lang: 'kr'
  }
})

const toLocalISOString = (timestamp, timezoneOffset = 0) => {
  if (!timestamp) return ''

  return new Date((timestamp + timezoneOffset) * 1000)
    .toISOString()
    .replace('Z', '')
}

const normalizeCurrentWeatherData = (weatherData) => {
  const observedAt = toLocalISOString(weatherData.dt, weatherData.timezone)
  const currentTemp = weatherData.main?.temp ?? null
  const weatherStatus = getWeatherStatus(weatherData.weather?.[0]?.id)

  return {
    current: {
      time: observedAt,
      temperature_2m: currentTemp,
      weather_status: weatherStatus
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
      cloudiness: weatherData.clouds?.all ?? null
    },
    sunrise: toLocalISOString(weatherData.sys?.sunrise, weatherData.timezone),
    sunset: toLocalISOString(weatherData.sys?.sunset, weatherData.timezone)
  }
}

const requestCurrentWeather = async (city) => {
  const response = await currentWeatherAPI.get('', {
    params: {
      lat: city.lat,
      lon: city.lon
    }
  })

  return normalizeCurrentWeatherData(response.data)
}

export const getAllCurrentWeatherAPI = async () => {
  const data = await Promise.all(CITIES.map(requestCurrentWeather))

  return { data }
}

export const getCurrentWeatherAPI = async (city) => {
  return requestCurrentWeather(city)
}

export const getAirPollutionAPI = async (city) => {
  const response = await axios.get(airPollutionAPIURL, {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: import.meta.env.WEATHER_API_KEY
    }
  })

  return {
    aqi: response.data.list?.[0]?.main?.aqi ?? null,
    pm25: response.data.list?.[0]?.components?.pm2_5 ?? null,
    pm10: response.data.list?.[0]?.components?.pm10 ?? null
  }
}

export const getAllHourlyWeatherAPI = async () => {
  return axios.get(hourlyWeatherAPIURL, {
    params: {
      latitude: CITIES.map((city) => city.lat).join(','),
      longitude: CITIES.map((city) => city.lon).join(','),
      hourly: 'temperature_2m',
      past_hours: 1,
      forecast_hours: 12,
      timezone: 'Asia/Seoul'
    }
  })
}

export const getHourlyWeatherAPI = async (city) => {
  const response = await axios.get(hourlyWeatherAPIURL, {
    params: {
      latitude: city.lat,
      longitude: city.lon,
      hourly: 'temperature_2m',
      past_hours: 1,
      forecast_hours: 12,
      timezone: 'Asia/Seoul'
    }
  })

  return response.data
}

export const getSunTimeAPI = async (city) => {
  const weatherData = await requestCurrentWeather(city)

  return {
    sunrise: weatherData.sunrise ? [weatherData.sunrise] : [],
    sunset: weatherData.sunset ? [weatherData.sunset] : []
  }
}
