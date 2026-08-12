import { WEATHER_CODES } from '@/constants/weatherCode'

export const mergeWeatherData = (cities, response) => {
  return cities.map((city, index) => {
    const current = response?.data[index]?.current ?? null
    const weather = WEATHER_CODES[current?.weather_code] ?? null

    return {
      ...city,
      currentTemp: current?.temperature_2m ?? null,
      status: weather?.status ?? '알 수 없음'
    }
  })
}