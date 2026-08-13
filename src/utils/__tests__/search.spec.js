import { describe, expect, it } from 'vitest'

import { getChoseong, matchesCityName } from '@/utils/search'

describe('도시 검색', () => {
  it('한글 도시명을 초성으로 변환한다', () => {
    expect(getChoseong('서울')).toBe('ㅅㅇ')
    expect(getChoseong('수원')).toBe('ㅅㅇ')
  })

  it('도시명과 초성 검색어를 모두 지원한다', () => {
    expect(matchesCityName('서울', '서울')).toBe(true)
    expect(matchesCityName('서울', 'ㅅ')).toBe(true)
    expect(matchesCityName('수원', 'ㅅㅇ')).toBe(true)
    expect(matchesCityName('부산', 'ㅅㅇ')).toBe(false)
  })

  it('공백 검색어는 전체 도시와 일치한다', () => {
    expect(matchesCityName('서울', '   ')).toBe(true)
  })
})
