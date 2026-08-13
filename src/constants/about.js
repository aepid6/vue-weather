export const SERVICE_FEATURES = [
  {
    number: '01',
    title: '현재 위치에서 시작',
    copy: '가장 가까운 도시를 찾아 현재 기온과 12시간 예보, 오늘의 최고·최저 기온과 추천 옷차림을 함께 보여줍니다.',
  },
  {
    number: '02',
    title: '지도에서 전국 비교',
    copy: '한국 지도 위 도시 마커의 색으로 기온을 비교하고, 선택한 도시의 체감온도·미세먼지·산책 지수를 바로 확인합니다.',
  },
  {
    number: '03',
    title: '검색하고 저장',
    copy: '초성 검색과 지역·거리·이름 정렬로 도시를 찾고, 자주 확인하는 도시는 즐겨찾기에 저장해 상세 날씨로 빠르게 이동합니다.',
  },
  {
    number: '04',
    title: '시간에 맞는 분위기',
    copy: '현재 위치의 일출과 일몰을 기준으로 아침·낮·저녁·밤 테마가 바뀌며 도시 풍경과 날씨 애니메이션도 함께 어우러집니다.',
  },
]

export const PROJECT_ARCHITECTURE = [
  {
    number: '01',
    label: 'Vue 3 Composition API',
    title: '반응형 변수',
    copy: '화면마다 필요한 상태는 ref에 담고, 원본 상태에서 계산되는 값은 computed로 구성했습니다. watch가 위치, 기온과 테마 상태의 변화를 감지해 화면을 다시 계산합니다.',
    points: ['ref · computed · watch', '검색어와 선택 도시', '필터 목록과 예보 그래프'],
    services: ['현재 위치 기반 날씨', '도시 검색·필터·정렬', '12시간 예보 그래프', '일출·일몰 반영'],
  },
  {
    number: '02',
    label: 'Reusable UI',
    title: 'Component',
    copy: '여러 화면에서 반복되는 날씨 표현과 상호작용을 독립 컴포넌트로 나눴습니다. View는 데이터 조회와 배치를 담당하고 Component는 지도, 카드, 패널과 그래픽을 표현합니다.',
    points: ['Props와 Emit으로 연결', '공통 날씨 패널', '지도·검색·즐겨찾기 UI'],
    services: ['전국 기온 지도', '도시 상세 패널', '날씨·도시 그래픽', '검색·즐겨찾기 UI'],
  },
  {
    number: '03',
    label: 'Pinia + localStorage',
    title: 'Store',
    copy: '테마 선택과 즐겨찾기 도시를 Pinia에서 전역 관리합니다. 스토어가 시작될 때 localStorage 값을 복원하고 변경된 상태를 즉시 저장해 새로고침 후에도 사용자 선택을 유지합니다.',
    points: ['전역 테마와 자동 시간대', '즐겨찾기 도시 ID', '브라우저 영구 저장'],
    services: ['자동·수동 테마 선택', '즐겨찾기 도시 유지', '새로고침 후 상태 복원', '화면 간 공통 상태 공유'],
  },
  {
    number: '04',
    label: 'Axios + async/await',
    title: 'API 통신',
    copy: 'OpenWeatherMap의 현재 관측·대기질과 Open-Meteo의 12시간·일별 예보를 Axios로 요청합니다. Promise.allSettled로 일부 실패를 견디고 응답을 하나의 도시 데이터 구조로 병합합니다.',
    points: ['현재 관측과 대기질', '12시간 날씨 예보', '응답 정규화와 병합'],
    services: ['현재 기온·체감온도', '습도·기압·바람', '미세먼지·산책 지수', '12시간·최고·최저 예보'],
  },
]
