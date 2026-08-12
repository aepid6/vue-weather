import axios from "axios"
import { CITIES } from "@/constants/cities"

export const getWeatherAPI = async() => {
  const latitudes = CITIES
    .map(city => city.lat)
    .join(',')

  const longitudes = CITIES
    .map(city => city.lon)
    .join(',')

  const response = await axios.get(
    'https://api.open-meteo.com/v1/forecast',
    {
      params: {
        latitude: latitudes,
        longitude: longitudes,
        current: 'temperature_2m,weather_code',
        timezone: 'Asia/Seoul',
        apikey: import.meta.env.WEATHER_API_KEY
      }
    }
  )

  return response
}