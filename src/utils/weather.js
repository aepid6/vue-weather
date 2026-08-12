import { WEATHER_CODES } from '@/constants/weatherCode'

export const getTemperatureTimeline = (weatherData) => {
  const hourly = weatherData?.hourly

  if (!hourly?.time || !hourly?.temperature_2m) return []

  return hourly.time
    .map((time, index) => ({
      time,
      temp: hourly.temperature_2m[index]
    }))
    .slice(0, 12)
}

export const getPreviousTemperature = (weatherData) => {
  const currentDate = new Date(weatherData?.current?.time)
  const currentHour = new Date(currentDate)
  currentHour.setMinutes(0, 0, 0)

  const previousTime = currentHour.getTime() - (60 * 60 * 1000)
  const timeline = getTemperatureTimeline(weatherData)

  if (!timeline.length) return null

  return timeline.reduce((previousHour, hour) => {
    const previousDistance = Math.abs(new Date(previousHour.time).getTime() - previousTime)
    const hourDistance = Math.abs(new Date(hour.time).getTime() - previousTime)

    return hourDistance < previousDistance ? hour : previousHour
  }, timeline[0])?.temp ?? null
}

export const mergeWeatherData = (cities, response) => {
  return cities.map((city, index) => {
    const weatherData = response?.data[index] ?? null
    const current = weatherData?.current ?? null
    const weather = WEATHER_CODES[current?.weather_code] ?? null
    const temperatureTimeline = getTemperatureTimeline(weatherData)
    const currentTemp = current?.temperature_2m ?? null
    const prevTemp = getPreviousTemperature(weatherData)

    return {
      ...city,
      temperatureTimeline,
      currentTemp,
      prevTemp,
      observedAt: current?.time ?? '',
      weatherCode: current?.weather_code ?? null,
      temperatureChange: currentTemp !== null && prevTemp !== null
        ? currentTemp - prevTemp
        : null,
      status: weather?.status ?? '알 수 없음'
    }
  })
}
