<script setup>
// vue 메서드
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue'
// js 파일 (상수, 함수)
import { getAllCurrentWeatherAPI, getAllHourlyWeatherAPI, getSunTimeAPI } from '@/services/weatherAPI'
import { mergeWeatherData } from '@/utils/weather'
import { matchesCityName } from '@/utils/search'
import { calculateDistance } from '@/utils/utils'
import { CITIES } from '@/constants/cities'
// 컴포넌트
import BASEDASHBOARD from '@/components/BaseDashboardCard.vue'
import SEARCH from '@/components/SearchBar.vue'
import CARD from '@/components/WeatherCard.vue'
import CITYPANEL from '@/components/WeatherCityPanel.vue'
import LOADING from '@/components/WeatherLoading.vue'

// 반응형 변수
const searchQuery = ref('')
const selectedRegion = ref('전체')
const selectedCityId = ref('')
const sortOption = ref('distance')
const currentCoordinates = ref({ lat: CITIES[0].lat, lon: CITIES[0].lon })
const currentTime = ref(new Date())
const sunTimes = ref(null)
const weatherList = ref([...CITIES])
const loading = ref(true)
const selectedCity = computed(() => weatherList.value.find((city) => city.id === selectedCityId.value))
const introSky = computed(() => {
  if (!sunTimes.value?.sunrise || !sunTimes.value?.sunset) {
    const hour = currentTime.value.getHours()
    return hour >= 6 && hour < 18 ? { state: 'day' } : { state: 'night' }
  }

  const isDaytime = currentTime.value >= new Date(sunTimes.value.sunrise)
    && currentTime.value < new Date(sunTimes.value.sunset)

  return isDaytime ? { state: 'day' } : { state: 'night' }
})
const referenceTime = computed(() => {
  const latestObservedAt = weatherList.value
    .map((city) => city.observedAt)
    .filter(Boolean)
    .sort((first, second) => new Date(second) - new Date(first))[0]

  if (!latestObservedAt) return '기준 시각 확인 중'

  return `${new Date(latestObservedAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })} 기준`
})

// 날씨 데이터 가져오기
const loadWeather = async () => {
  try {
    const [currentResult, hourlyResult] = await Promise.allSettled([
      getAllCurrentWeatherAPI(),
      getAllHourlyWeatherAPI()
    ])
    const currentResponse = currentResult.status === 'fulfilled' ? currentResult.value : null
    const hourlyResponse = hourlyResult.status === 'fulfilled' ? hourlyResult.value : null

    if (currentResult.status === 'rejected') console.error('현재 날씨 API 요청에 실패했습니다.', currentResult.reason)
    if (hourlyResult.status === 'rejected') console.error('시간별 날씨 API 요청에 실패했습니다.', hourlyResult.reason)
    if (!currentResponse && !hourlyResponse) throw new Error('날씨 API 요청에 모두 실패했습니다.')

    weatherList.value = mergeWeatherData(CITIES, currentResponse, hourlyResponse)
  } catch (err) {
    console.error('날씨 데이터를 불러오지 못했습니다.', err)
  } finally {
    loading.value = false
  }
}
const loadCurrentLocation = () => {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentCoordinates.value = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }
    },
    () => {
      currentCoordinates.value = { lat: CITIES[0].lat, lon: CITIES[0].lon }
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 15 * 60 * 1000
    }
  )
}

const loadSunTimes = async (coordinates) => {
  try {
    const daily = await getSunTimeAPI(coordinates)
    sunTimes.value = {
      sunrise: daily.sunrise?.[0],
      sunset: daily.sunset?.[0]
    }
  } catch (error) {
    console.error('일출·일몰 정보를 불러오지 못했습니다.', error)
  }
}

watch(currentCoordinates, loadSunTimes, { immediate: true })

onMounted(() => {
  loadWeather()
  loadCurrentLocation()
})

// 타이머 (15분 단위 업데이트)
const timer = setInterval(() => {
  currentTime.value = new Date()
  loadWeather()
  loadSunTimes(currentCoordinates.value)
}, 15 * 60 * 1000)
// Unmounted시 타이머 중지
onUnmounted(() => {
  clearInterval(timer)
})

// 지역선택
const regionName = (city) => city.province || '특별시·광역시'

const regions = computed(() => ['전체', ...new Set(weatherList.value.map(regionName))])

const RegionFilteredWeatherList = computed(() => {
  return selectedRegion.value === '전체'
    ? weatherList.value
    : weatherList.value.filter((weather) => regionName(weather) === selectedRegion.value)
})

// 검색기능
const FilteredWeatherList = computed(() => {
  const filteredList = RegionFilteredWeatherList.value.filter((weather) =>
    matchesCityName(weather.name, searchQuery.value),
  )

  return [...filteredList].sort((firstCity, secondCity) => {
    if (sortOption.value === 'name') {
      return firstCity.name.localeCompare(secondCity.name, 'ko')
    }

    return calculateDistance(currentCoordinates.value, firstCity)
      - calculateDistance(currentCoordinates.value, secondCity)
  })
})

watchEffect(() => {
  selectedCityId.value
})
</script>

<template>
  <section v-if="loading">
    <LOADING />
  </section>
  <section v-else class="weather-dashboard weather-list-view">
    <div class="dashboard-intro">
      <div>
        <p class="eyebrow">LOCAL WEATHER</p>
        <h1>오늘의 하늘을<br><em>한눈에</em> 살펴보세요.</h1>
      </div>
      <div class="intro-orb" :class="`intro-orb--${introSky.state}`" aria-hidden="true">
        <i class="intro-sky-object"></i><i class="intro-sky-cutout"></i><i class="intro-sky-ring"></i>
      </div>
    </div>
    <BASEDASHBOARD class="dashboard-card search-card">
      <template v-slot:header>
        <p class="card-title">도시 검색</p>
      </template>
      <template v-slot:content>
        <div class="region-filters" role="group" aria-label="지역별 도시 필터">
          <button
            v-for="region in regions"
            :key="region"
            :class="{ active: selectedRegion === region }"
            @click="selectedRegion = region"
          >
            {{ region }}
          </button>
        </div>
        <SEARCH v-model:searchQuery="searchQuery" />
      </template>
    </BASEDASHBOARD>
    <div class="weather-results-layout" :class="{ 'has-selected-city': selectedCity }">
      <BASEDASHBOARD class="dashboard-card weather-card-section">
        <template v-slot:header>
          <div class="weather-section-heading">
            <p class="card-title">지역별 날씨 현황</p>
            <div class="weather-list-controls">
              <div class="weather-sort-options" role="group" aria-label="도시 정렬 방식">
                <button :class="{ active: sortOption === 'distance' }" @click="sortOption = 'distance'">거리순</button>
                <button :class="{ active: sortOption === 'name' }" @click="sortOption = 'name'">이름순</button>
              </div>
              <span>{{ referenceTime }}</span>
            </div>
          </div>
        </template>
        <template v-slot:content>
          <CARD :weatherList="FilteredWeatherList" v-model:selectedCityId="selectedCityId" />
        </template>
      </BASEDASHBOARD>
      <aside v-if="selectedCity" class="weather-list-detail" aria-label="선택한 도시 날씨 정보">
        <CITYPANEL
          :city="selectedCity"
          close-label="도시 상세 패널 닫기"
          @close="selectedCityId = ''"
        />
      </aside>
    </div>
  </section>
</template>
