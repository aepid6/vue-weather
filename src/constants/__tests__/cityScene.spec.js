import { describe, expect, it } from 'vitest'

import { CITIES } from '@/constants/cities'
import {
  HERITAGE_CITY_IDS,
  ISLAND_CITY_IDS,
  MOUNTAIN_CITY_IDS,
  PORT_CITY_IDS,
  SMALL_CITY_IDS,
  getCitySceneType,
  isSmallCity,
} from '@/constants/cityScene'

const sceneCityIds = [
  ...PORT_CITY_IDS,
  ...MOUNTAIN_CITY_IDS,
  ...HERITAGE_CITY_IDS,
  ...ISLAND_CITY_IDS,
]

describe('도시 풍경 분류', () => {
  it('도시명 대신 cities.js의 영문 id로 분류한다', () => {
    expect(getCitySceneType('busan')).toBe('port')
    expect(getCitySceneType('taebaek')).toBe('mountain')
    expect(getCitySceneType('gyeongju')).toBe('heritage')
    expect(getCitySceneType('seogwipo')).toBe('island')
    expect(getCitySceneType('서울')).toBe('city')
  })

  it('분류된 모든 id가 cities.js에 존재한다', () => {
    const cityIds = new Set(CITIES.map((city) => city.id))

    expect(sceneCityIds.every((cityId) => cityIds.has(cityId))).toBe(true)
  })

  it('하나의 도시는 하나의 대표 풍경에만 포함된다', () => {
    expect(new Set(sceneCityIds).size).toBe(sceneCityIds.length)
  })

  it('소도시 효과도 cities.js의 영문 id로 검증한다', () => {
    const cityIds = new Set(CITIES.map((city) => city.id))

    expect(SMALL_CITY_IDS.every((cityId) => cityIds.has(cityId))).toBe(true)
    expect(SMALL_CITY_IDS.every((cityId) => getCitySceneType(cityId) === 'city')).toBe(true)
    expect(isSmallCity('gimcheon')).toBe(true)
    expect(isSmallCity('seoul')).toBe(false)
    expect(isSmallCity('taebaek')).toBe(false)
    expect(isSmallCity('sokcho')).toBe(false)
    expect(isSmallCity('andong')).toBe(false)
  })
})
