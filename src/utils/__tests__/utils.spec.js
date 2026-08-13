import { describe, expect, it } from 'vitest'

import { calculateDistance } from '@/utils/utils'

describe('도시 거리 계산', () => {
  it('같은 좌표의 거리는 0km이다', () => {
    const location = { lat: 37.5665, lon: 126.978 }

    expect(calculateDistance(location, location)).toBe(0)
  })

  it('서울과 부산의 직선거리를 계산한다', () => {
    const seoul = { lat: 37.5665, lon: 126.978 }
    const busan = { lat: 35.1796, lon: 129.0756 }

    expect(calculateDistance(seoul, busan)).toBeGreaterThan(320)
    expect(calculateDistance(seoul, busan)).toBeLessThan(330)
  })

  it('유효하지 않은 좌표는 무한 거리로 처리한다', () => {
    expect(calculateDistance(null, { lat: 35, lon: 129 })).toBe(Infinity)
    expect(calculateDistance({ lat: 37, lon: 127 }, { lat: NaN, lon: 129 })).toBe(Infinity)
  })
})
