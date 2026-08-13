export const WEATHER_CODES = {
  '뇌우': 'storm',
  '이슬비': 'rain',
  '약한 비': 'rain',
  '비': 'rain',
  '강한 비': 'rain',
  '눈': 'snow',
  '안개': 'fog',
  '맑음': 'sunny',
  '대체로 맑음': 'partly-cloudy',
  '구름 조금': 'partly-cloudy',
  '흐림': 'cloudy'
}

export const getWeatherStatus = (openWeatherCode) => {
  if (openWeatherCode >= 200 && openWeatherCode <= 232) return '뇌우'
  if (openWeatherCode >= 300 && openWeatherCode <= 321) return '이슬비'
  if (openWeatherCode === 500) return '약한 비'
  if (openWeatherCode === 501) return '비'
  if (openWeatherCode >= 502 && openWeatherCode <= 531) return '강한 비'
  if (openWeatherCode >= 600 && openWeatherCode <= 622) return '눈'
  if (openWeatherCode >= 701 && openWeatherCode <= 781) return '안개'
  if (openWeatherCode === 800) return '맑음'
  if (openWeatherCode === 801) return '대체로 맑음'
  if (openWeatherCode === 802) return '구름 조금'
  if (openWeatherCode >= 803 && openWeatherCode <= 804) return '흐림'

  return null
}

export const getWMOWeatherStatus = (weatherCode) => {
  if (weatherCode === 0) return '맑음'
  if (weatherCode === 1) return '대체로 맑음'
  if (weatherCode === 2) return '구름 조금'
  if (weatherCode === 3) return '흐림'
  if ([45, 48].includes(weatherCode)) return '안개'
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return '이슬비'
  if ([61, 63, 66].includes(weatherCode)) return '비'
  if ([65, 67, 80, 81, 82].includes(weatherCode)) return '강한 비'
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return '눈'
  if ([95, 96, 99].includes(weatherCode)) return '뇌우'

  return null
}
