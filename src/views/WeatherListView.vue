<script setup>
// vue 메서드
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
// js 파일 (상수, 함수)
import { getAllCurrentWeatherAPI, getAllHourlyWeatherAPI } from '@/services/weatherAPI'
import { mergeWeatherData } from '@/utils/weather'
import { useWeatherLoading } from '@/composables/useWeatherLoading'
import { matchesCityName } from '@/utils/search'
import { calculateDistance } from '@/utils/utils'
import { CITIES } from '@/constants/cities'
import { useFavoritesStore } from '@/stores/favorites'
import { useThemeStore } from '@/stores/theme'
import BUTTON from 'primevue/button'
// 컴포넌트
import BASEDASHBOARD from '@/components/BaseDashboardCard.vue'
import SEARCH from '@/components/SearchBar.vue'
import CARD from '@/components/WeatherCard.vue'
import CITYPANEL from '@/components/WeatherCityPanel.vue'
import LOADING from '@/components/WeatherLoading.vue'
import FAVORITES from '@/components/WeatherFavorites.vue'

// 반응형 변수
const searchQuery = ref('')
const selectedRegion = ref('전체')
const selectedCityId = ref('')
const sortOption = ref('distance')
const currentCoordinates = ref({ lat: CITIES[0].lat, lon: CITIES[0].lon })
const weatherList = ref([...CITIES])
const { loading, loadingProgress, updateLoading, completeLoading } = useWeatherLoading()
const favoritesStore = useFavoritesStore()
const themeStore = useThemeStore()
const { favoriteCityIds } = storeToRefs(favoritesStore)
const { resolvedTheme } = storeToRefs(themeStore)
const { toggleFavorite } = favoritesStore

const selectedCity = computed(() => weatherList.value.find((city) => city.id === selectedCityId.value))
const favoriteCities = computed(() => favoriteCityIds.value.map((cityId) => weatherList.value.find((city) => city.id === cityId)).filter(Boolean))

const introSky = computed(() => ({
  state: resolvedTheme.value === 'night' ? 'night' : 'day',
}))

const referenceTime = computed(() => {
  const latestObservedAt = weatherList.value
    .map((city) => city.observedAt)
    .filter(Boolean)
    .sort((first, second) => new Date(second) - new Date(first))[0]

  if (!latestObservedAt) return '기준 시각 확인 중'

  return `${new Date(latestObservedAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })} 기준`
})

// 날씨 데이터 가져오기
const loadWeather = async () => {
  const isInitialLoading = loading.value
  let completedCities = 0
  let hourlyReady = false

  const updateRequestProgress = () => {
    if (!isInitialLoading) return

    if (completedCities < CITIES.length) {
      updateLoading(10 + (completedCities / CITIES.length) * 62, `${completedCities}/${CITIES.length}개 도시의 현재 날씨를 확인하고 있습니다.`)
      return
    }

    updateLoading(hourlyReady ? 90 : 76, hourlyReady ? '시간별 예보를 모두 받았습니다.' : '시간별 예보를 불러오고 있습니다.')
  }

  try {
    if (isInitialLoading) updateLoading(8, '날씨 API 연결을 준비하고 있습니다.')

    const [currentResult, hourlyResult] = await Promise.allSettled([
      getAllCurrentWeatherAPI({
        force: !isInitialLoading,
        onProgress: ({ completed }) => {
          completedCities = completed
          updateRequestProgress()
        },
      }),
      getAllHourlyWeatherAPI({
        force: !isInitialLoading,
        onProgress: ({ completed, failed }) => {
          hourlyReady = completed === 1 && !failed
          updateRequestProgress()
        },
      }),
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
    if (isInitialLoading) await completeLoading()
  }
}
const loadCurrentLocation = () => {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentCoordinates.value = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }
    },
    () => {
      currentCoordinates.value = { lat: CITIES[0].lat, lon: CITIES[0].lon }
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 15 * 60 * 1000,
    },
  )
}

onMounted(() => {
  loadWeather()
  loadCurrentLocation()
})

const timer = setInterval(
  () => {
    loadWeather()
  },
  15 * 60 * 1000,
)
// Unmounted시 타이머 중지
onUnmounted(() => {
  clearInterval(timer)
})

// 지역선택
const regionName = (city) => city.province || '특별시·광역시'

const regions = computed(() => ['전체', ...new Set(weatherList.value.map(regionName))])

const RegionFilteredWeatherList = computed(() => {
  return selectedRegion.value === '전체' ? weatherList.value : weatherList.value.filter((weather) => regionName(weather) === selectedRegion.value)
})

// 검색기능
const FilteredWeatherList = computed(() => {
  const filteredList = RegionFilteredWeatherList.value.filter((weather) => matchesCityName(weather.name, searchQuery.value))

  return [...filteredList].sort((firstCity, secondCity) => {
    if (sortOption.value === 'name') {
      return firstCity.name.localeCompare(secondCity.name, 'ko')
    }

    return calculateDistance(currentCoordinates.value, firstCity) - calculateDistance(currentCoordinates.value, secondCity)
  })
})
</script>

<template>
  <section v-if="loading">
    <LOADING :progress="loadingProgress" />
  </section>
  <section v-else class="weather-dashboard weather-list-view">
    <div class="dashboard-intro cities-dashboard-intro" :class="`cities-dashboard-intro--${resolvedTheme}`">
      <div class="cities-intro-copy">
        <p class="eyebrow"><span class="cities-live-signal" aria-hidden="true"></span>KOREA WEATHER NETWORK</p>
        <h1>가까운 도시부터<br /><em>오늘의 날씨</em>를 만나보세요.</h1>
        <p class="cities-intro-description">지역과 도시를 검색하고, 현재 기온부터 체감 날씨까지 한곳에서 비교할 수 있어요.</p>
      </div>
      <div class="cities-intro-visual" aria-hidden="true">
        <i class="cities-intro-star cities-intro-star--one"></i>
        <i class="cities-intro-star cities-intro-star--two"></i>
        <i class="cities-intro-star cities-intro-star--three"></i>
        <span class="cities-intro-cloud cities-intro-cloud--one"></span>
        <span class="cities-intro-cloud cities-intro-cloud--two"></span>
        <div class="intro-orb" :class="`intro-orb--${introSky.state}`"><i class="intro-sky-object"></i><i class="intro-sky-cutout"></i><i class="intro-sky-ring"></i></div>
        <div class="cities-intro-skyline"><i></i><i></i><i></i><i></i><i></i></div>
        <span class="cities-intro-horizon"></span>
      </div>
    </div>
    <BASEDASHBOARD class="dashboard-card search-card">
      <template v-slot:header>
        <p class="card-title">도시 검색</p>
      </template>
      <template v-slot:content>
        <div class="region-filters" role="group" aria-label="지역별 도시 필터">
          <BUTTON v-for="region in regions" :key="region" :class="{ active: selectedRegion === region }" @click="selectedRegion = region">
            {{ region }}
          </BUTTON>
        </div>
        <SEARCH v-model:searchQuery="searchQuery" />
        <FAVORITES :cities="favoriteCities" @remove="toggleFavorite" />
      </template>
    </BASEDASHBOARD>
    <div class="weather-results-layout" :class="{ 'has-selected-city': selectedCity }">
      <BASEDASHBOARD class="dashboard-card weather-card-section">
        <template v-slot:header>
          <div class="weather-section-heading">
            <p class="card-title">지역별 날씨 현황</p>
            <div class="weather-list-controls">
              <div class="weather-sort-options" role="group" aria-label="도시 정렬 방식">
                <BUTTON :class="{ active: sortOption === 'distance' }" @click="sortOption = 'distance'">거리순</BUTTON>
                <BUTTON :class="{ active: sortOption === 'name' }" @click="sortOption = 'name'">이름순</BUTTON>
              </div>
              <span>{{ referenceTime }}</span>
            </div>
          </div>
        </template>
        <template v-slot:content>
          <CARD :weatherList="FilteredWeatherList" :favoriteCityIds="favoriteCityIds" v-model:selectedCityId="selectedCityId" @toggle-favorite="toggleFavorite" />
        </template>
      </BASEDASHBOARD>
      <aside v-if="selectedCity" class="weather-list-detail" aria-label="선택한 도시 날씨 정보">
        <CITYPANEL :city="selectedCity" close-label="도시 상세 패널 닫기" @close="selectedCityId = ''" />
      </aside>
    </div>
  </section>
</template>
