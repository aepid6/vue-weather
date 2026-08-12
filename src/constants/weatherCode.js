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
