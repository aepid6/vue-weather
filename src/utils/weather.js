export const formatTemperature = (temperature) => {
  return Number.isFinite(temperature) ? temperature.toFixed(1) : '--'
}

const getAllHourlyTemperatures = (hourlyData) => {
  const hourly = hourlyData?.hourly

  if (!hourly?.time || !hourly?.temperature_2m) return []

  return hourly.time
    .map((time, index) => ({
      time,
      temp: hourly.temperature_2m[index]
    }))
    .filter((hour) => Number.isFinite(hour.temp))
}

export const getTemperatureTimeline = (hourlyData, observedAt) => {
  const currentHour = new Date(observedAt || Date.now())
  currentHour.setMinutes(0, 0, 0)

  return getAllHourlyTemperatures(hourlyData)
    .filter((hour) => new Date(hour.time).getTime() >= currentHour.getTime())
    .slice(0, 12)
}

export const getPreviousTemperature = (hourlyData, observedAt) => {
  const currentDate = new Date(observedAt || Date.now())
  const currentHour = new Date(currentDate)
  currentHour.setMinutes(0, 0, 0)

  const previousTime = currentHour.getTime() - (60 * 60 * 1000)
  const timeline = getAllHourlyTemperatures(hourlyData)

  if (!timeline.length) return null

  const closestHour = timeline.reduce((previousHour, hour) => {
    const previousDistance = Math.abs(new Date(previousHour.time).getTime() - previousTime)
    const hourDistance = Math.abs(new Date(hour.time).getTime() - previousTime)

    return hourDistance < previousDistance ? hour : previousHour
  }, timeline[0])

  const closestDistance = Math.abs(new Date(closestHour.time).getTime() - previousTime)

  return closestDistance <= 30 * 60 * 1000 ? closestHour.temp : null
}

export const mergeWeatherData = (cities, currentResponse, hourlyResponse) => {
  return cities.map((city, index) => {
    const currentWeatherData = currentResponse?.data?.[index] ?? null
    const hourlyWeatherData = hourlyResponse?.data?.[index] ?? null
    const current = currentWeatherData?.current ?? null
    const weatherStatus = current?.weather_status ?? null
    const currentTemp = current?.temperature_2m ?? null
    const observedAt = current?.time ?? ''
    const temperatureTimeline = getTemperatureTimeline(hourlyWeatherData, observedAt)
    const prevTemp = getPreviousTemperature(hourlyWeatherData, observedAt)

    return {
      ...city,
      temperatureTimeline,
      currentTemp,
      prevTemp,
      observedAt,
      weatherStatus,
      details: currentWeatherData?.details ?? null,
      sunrise: currentWeatherData?.sunrise ?? '',
      sunset: currentWeatherData?.sunset ?? '',
      temperatureChange: currentTemp !== null && prevTemp !== null
        ? currentTemp - prevTemp
        : null,
      status: weatherStatus || currentWeatherData?.openWeatherDescription || '알 수 없음'
    }
  })
}
