import axios from "axios"
import { CITIES } from "@/constants/cities"

const weatherAPIURL = 'https://api.open-meteo.com/v1/forecast'

export const getAllWeatherAPI = async() => {
  const latitudes = CITIES
    .map(city => city.lat)
    .join(',')

  const longitudes = CITIES
    .map(city => city.lon)
    .join(',')

  const response = await axios.get(
    weatherAPIURL,
    {
      params: {
        latitude: latitudes,
        longitude: longitudes,
        current: 'temperature_2m,weather_code',
        hourly: 'temperature_2m',
        past_hours: 3,
        forecast_hours: 9,
        timezone: 'Asia/Seoul',
        apikey: import.meta.env.WEATHER_API_KEY
      }
    }
  )

  return response
}

export const getWeatherAPI = async (city) => {
  const response = await axios.get(weatherAPIURL, {
    params: {
      latitude: city.lat,
      longitude: city.lon,
      current: 'temperature_2m,weather_code',
      hourly: 'temperature_2m',
      past_hours: 3,
      forecast_hours: 9,
      timezone: 'Asia/Seoul'
    }
  })

  return response.data
}
