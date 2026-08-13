import { describe, expect, it } from 'vitest'

import { getWeatherStatus, getWMOWeatherStatus } from '@/constants/weatherCode'
import {
  formatTemperature,
  getPreviousTemperature,
  getTemperatureTimeline,
} from '@/utils/weather'

const hourlyData = {
  hourly: {
    time: Array.from({ length: 15 }, (_, index) => `2026-08-13T${String(index + 6).padStart(2, '0')}:00`),
    temperature_2m: Array.from({ length: 15 }, (_, index) => 20 + index),
    weather_code: Array.from({ length: 15 }, () => 0),
  },
}

describe('날씨 데이터 변환', () => {
  it('기온을 소수점 첫째 자리로 표시한다', () => {
    expect(formatTemperature(27)).toBe('27.0')
    expect(formatTemperature(27.34)).toBe('27.3')
    expect(formatTemperature(null)).toBe('--')
  })

  it('현재 기준 이전 3시간부터 12시간 예보를 구성한다', () => {
    const timeline = getTemperatureTimeline(hourlyData, '2026-08-13T09:20')

    expect(timeline).toHaveLength(12)
    expect(timeline[0]).toMatchObject({ time: '2026-08-13T06:00', temp: 20, weatherStatus: '맑음' })
    expect(timeline.at(-1)?.time).toBe('2026-08-13T17:00')
  })

  it('현재 시각의 한 시간 전 기온을 찾는다', () => {
    expect(getPreviousTemperature(hourlyData, '2026-08-13T10:20')).toBe(23)
  })

  it('OpenWeather와 WMO 날씨 코드를 서비스 상태로 변환한다', () => {
    expect(getWeatherStatus(800)).toBe('맑음')
    expect(getWeatherStatus(502)).toBe('강한 비')
    expect(getWMOWeatherStatus(3)).toBe('흐림')
    expect(getWMOWeatherStatus(95)).toBe('뇌우')
    expect(getWMOWeatherStatus(999)).toBeNull()
  })
})
