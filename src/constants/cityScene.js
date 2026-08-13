export const PORT_CITY_IDS = [
  'busan', 'ulsan', 'pohang', 'incheon', 'mokpo', 'yeosu', 'gangneung', 'sokcho',
  'donghae', 'samcheok', 'seosan', 'boryeong', 'gunsan', 'gwangyang', 'tongyeong',
  'geoje', 'changwon',
]

export const MOUNTAIN_CITY_IDS = [
  'chuncheon', 'wonju', 'taebaek', 'hongcheon', 'chungju', 'jecheon', 'yeongju',
  'mungyeong',
]

export const HERITAGE_CITY_IDS = [
  'suwon', 'jeonju', 'gyeongju', 'andong', 'gongju', 'iksan', 'namwon', 'naju',
  'jinju', 'gimhae',
]

export const ISLAND_CITY_IDS = ['jeju', 'seogwipo']

// 주민등록인구 약 20만 명 미만인 시·군을 소도시로 분류합니다.
export const SMALL_CITY_IDS = [
  'eumseong', 'jincheon', 'jeongeup', 'gimcheon',
]

export const getCitySceneType = (cityId) => {
  if (ISLAND_CITY_IDS.includes(cityId)) return 'island'
  if (HERITAGE_CITY_IDS.includes(cityId)) return 'heritage'
  if (PORT_CITY_IDS.includes(cityId)) return 'port'
  if (MOUNTAIN_CITY_IDS.includes(cityId)) return 'mountain'

  return 'city'
}

export const isSmallCity = (cityId) => SMALL_CITY_IDS.includes(cityId)
