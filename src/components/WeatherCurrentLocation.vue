<script setup>
import { computed, ref, watch } from 'vue'
import { formatTemperature } from '@/utils/weather'
import tshirtIcon from '@/assets/clothes/tshirt.svg'
import shirtIcon from '@/assets/clothes/shirt.svg'
import sweaterIcon from '@/assets/clothes/sweater.svg'
import shortsIcon from '@/assets/clothes/shorts.svg'
import pantsIcon from '@/assets/clothes/pants.svg'
import jacketIcon from '@/assets/clothes/jacket.svg'
import coatIcon from '@/assets/clothes/coat.svg'

const props = defineProps({
  city: {
    type: Object,
    default: null
  }
})

const portCities = ['부산', '울산', '포항', '인천', '목포', '여수', '창원', '강릉', '속초', '동해', '삼척', '서산', '보령', '군산', '광양', '통영', '거제']
const mountainCities = ['춘천', '원주', '태백', '홍천', '충주', '제천', '영주', '문경', '김천']
const heritageCities = ['전주', '경주', '안동', '공주', '남원']

const cityLandmark = computed(() => {
  const name = props.city?.name

  if (['제주', '서귀포'].includes(name)) return { type: 'island', label: '섬과 바람' }
  if (heritageCities.includes(name)) return { type: 'heritage', label: '역사 도시' }
  if (portCities.includes(name)) return { type: 'port', label: '항구 도시' }
  if (mountainCities.includes(name)) return { type: 'mountain', label: '산악 도시' }
  return { type: 'city', label: '도심 풍경' }
})

const temperatureChangeText = computed(() => {
  const change = props.city?.temperatureChange

  if (!Number.isFinite(change)) return '비교 정보 없음'
  if (change === 0) return '1시간 전과 동일'

  return `1시간 전보다 ${change > 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}°C`
})

const isTemperatureUpdating = ref(false)
const outfitPalette = ref(0)
let updateTimer

const outfitPalettes = [
  { top: '#f1f0eb', bottom: '#202b42', outer: '#b9a387', accent: '#ffffff' },
  { top: '#a9c7dc', bottom: '#30343b', outer: '#26344a', accent: '#edf7fc' },
  { top: '#d8c8ae', bottom: '#25272a', outer: '#6d5948', accent: '#f7f1e7' },
  { top: '#87927a', bottom: '#eee7d8', outer: '#333a35', accent: '#f8f5ed' },
  { top: '#b9bab8', bottom: '#35516d', outer: '#8a7c6c', accent: '#f4f4f2' },
  { top: '#26364d', bottom: '#d5d0c6', outer: '#a8a198', accent: '#eef3f8' }
]

outfitPalette.value = Math.floor(Math.random() * outfitPalettes.length)

const refreshOutfitPalette = () => {
  if (outfitPalettes.length < 2) return

  let nextPalette = outfitPalette.value
  while (nextPalette === outfitPalette.value) {
    nextPalette = Math.floor(Math.random() * outfitPalettes.length)
  }
  outfitPalette.value = nextPalette
}

const outfit = computed(() => {
  const high = props.city?.todayHigh
  const low = props.city?.todayLow
  const palette = outfitPalettes[outfitPalette.value]

  let type = 'sweater'
  let label = '니트와 긴바지'

  if (Number.isFinite(high) && high >= 28) {
    type = 'summer'
    label = '반팔과 반바지'
  } else if (Number.isFinite(high) && high >= 23) {
    type = 'light'
    label = '반팔과 가벼운 바지'
  } else if (Number.isFinite(high) && high >= 17) {
    type = 'shirt'
    label = '긴팔 셔츠와 바지'
  } else if (Number.isFinite(high) && high < 9) {
    type = 'winter'
    label = '두꺼운 니트와 긴바지'
  }

  const needsOuter = Number.isFinite(low) && low < 16
  const outerLabel = !Number.isFinite(low)
    ? '외투 정보 확인 중'
    : low < 5 ? '두꺼운 외투가 필요해요'
      : low < 12 ? '자켓을 챙기세요'
        : low < 16 ? '얇은 외투가 좋아요'
          : '외투 없이도 괜찮아요'

  const topIcon = ['summer', 'light'].includes(type)
    ? tshirtIcon
    : type === 'shirt' ? shirtIcon : sweaterIcon
  const bottomIcon = type === 'summer' ? shortsIcon : pantsIcon
  const outerIcon = Number.isFinite(low) && low < 5 ? coatIcon : jacketIcon

  return { type, label, needsOuter, outerLabel, palette, topIcon, bottomIcon, outerIcon }
})

watch(
  () => props.city?.currentTemp,
  (currentTemp, previousTemp) => {
    if (currentTemp === previousTemp || previousTemp === undefined) return

    isTemperatureUpdating.value = true
    clearTimeout(updateTimer)
    updateTimer = setTimeout(() => {
      isTemperatureUpdating.value = false
    }, 800)
  }
)

const currentTimelineIndex = computed(() => {
  const timeline = props.city?.temperatureTimeline ?? []
  const currentTime = props.city?.observedAt
  const matchedIndex = timeline.findIndex((hour) => hour.time === currentTime)

  if (matchedIndex >= 0) return matchedIndex

  const currentTimestamp = new Date(currentTime).getTime()
  const pastHourCount = timeline.filter((hour) => new Date(hour.time).getTime() <= currentTimestamp).length

  return Math.max(0, pastHourCount - 1)
})

const graphPoints = computed(() => {
  const timeline = props.city?.temperatureTimeline ?? []
  const normalizedTimeline = timeline.map((hour, index) => ({
    ...hour,
    temp: index === currentTimelineIndex.value && Number.isFinite(props.city?.currentTemp)
      ? props.city.currentTemp
      : hour.temp
  }))
  const temperatures = normalizedTimeline.map((hour) => hour.temp).filter(Number.isFinite)

  if (!temperatures.length) return []

  const minimum = Math.min(...temperatures)
  const maximum = Math.max(...temperatures)
  const range = Math.max(maximum - minimum, 1)

  return normalizedTimeline.map((hour, index) => ({
    ...hour,
    x: 28 + (index * 56),
    y: 82 - (((hour.temp - minimum) / range) * 48)
  }))
})

const graphPolyline = computed(() => graphPoints.value.map((point) => `${point.x},${point.y}`).join(' '))

const weatherEmoji = (status) => ({
  '맑음': '☀️',
  '대체로 맑음': '🌤️',
  '구름 조금': '⛅',
  '흐림': '☁️',
  '안개': '🌫️',
  '이슬비': '🌦️',
  '비': '🌧️',
  '강한 비': '🌧️',
  '눈': '🌨️',
  '뇌우': '⛈️'
}[status] || '☁️')

const clothingMask = (icon) => ({
  maskImage: `url("${icon}")`,
  WebkitMaskImage: `url("${icon}")`
})

const formatTime = (time) => {
  return new Date(time).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    hour12: false
  })
}
</script>

<template>
  <section v-if="city" class="current-location-card" aria-live="polite">
    <div
      :key="city.id"
      class="current-location-landmark"
      :class="`landmark-${cityLandmark.type}`"
      :aria-label="`${city.name} ${cityLandmark.label}`"
    >
      <span aria-hidden="true"><b></b><b></b><b></b></span>
      <i aria-hidden="true"></i>
    </div>
    <div>
      <p>현재 위치</p>
      <h2>{{ city.name }}</h2>
    </div>
    <div class="current-location-reading">
      <strong :class="{ updating: isTemperatureUpdating }">{{ formatTemperature(city.currentTemp) }}<small>°C</small></strong>
      <span :class="{ down: city.temperatureChange < 0 }">{{ temperatureChangeText }}</span>
    </div>
    <div class="location-forecast" aria-label="12시간 기온 예보">
      <div class="location-forecast-heading">
        <span>12시간 기온 흐름</span>
      </div>
      <div class="location-forecast-body">
        <div class="location-forecast-scroll">
          <svg class="location-forecast-chart" viewBox="0 0 672 112" role="img" aria-label="시간별 기온 그래프">
          <defs>
            <linearGradient id="forecast-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="var(--theme-accent)" stop-opacity=".28" />
              <stop offset="1" stop-color="var(--theme-accent)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <line v-for="guide in [32, 56, 80]" :key="guide" x1="0" :y1="guide" x2="672" :y2="guide" class="forecast-guide" />
          <polygon
            v-if="graphPoints.length"
            :points="`28,102 ${graphPolyline} ${graphPoints.at(-1).x},102`"
            fill="url(#forecast-area-gradient)"
          />
          <polyline :points="graphPolyline" class="forecast-line" />
          <g
            v-for="(point, index) in graphPoints"
            :key="point.time"
            class="forecast-point"
            :class="{ current: index === currentTimelineIndex }"
          >
            <circle :cx="point.x" :cy="point.y" r="4" />
            <text :x="point.x" :y="point.y - 10">{{ formatTemperature(point.temp) }}°</text>
          </g>
          </svg>
          <div class="location-forecast-track">
            <div
              v-for="(hour, index) in city.temperatureTimeline"
              :key="hour.time"
              class="location-forecast-item"
              :class="{
                current: index === currentTimelineIndex,
                future: index > currentTimelineIndex
              }"
              :style="{ '--forecast-index': index }"
            >
              <span>{{ index === currentTimelineIndex ? '현재' : formatTime(hour.time) }}</span>
              <b class="forecast-weather-emoji" :title="hour.weatherStatus || '예보'" aria-hidden="true">{{ weatherEmoji(hour.weatherStatus) }}</b>
              <small>{{ hour.weatherStatus || '예보' }}</small>
            </div>
          </div>
        </div>
        <aside class="today-extremes" aria-label="오늘 최고 및 최저 기온">
          <div
            class="today-extreme-card today-extreme-card--high"
            :class="`outfit-${outfit.type}`"
            :style="{
              '--outfit-top': outfit.palette.top,
              '--outfit-bottom': outfit.palette.bottom,
              '--outfit-accent': outfit.palette.accent
            }"
          >
            <span>오늘 최고</span>
            <button
              type="button"
              class="outfit-color-refresh"
              aria-label="추천 옷차림 색상 조합 바꾸기"
              title="옷 색상 바꾸기"
              @click="refreshOutfitPalette"
            >
              <i :style="{ background: outfit.palette.top }" aria-hidden="true"></i>
              <i :style="{ background: outfit.palette.bottom }" aria-hidden="true"></i>
            </button>
            <div class="extreme-clothes extreme-clothes--daily" aria-hidden="true">
              <i class="clothing-svg clothing-svg--top" :style="clothingMask(outfit.topIcon)"></i>
              <i class="clothing-svg clothing-svg--bottom" :style="clothingMask(outfit.bottomIcon)"></i>
            </div>
            <small class="extreme-clothes-label">{{ outfit.label }}</small>
            <strong>{{ formatTemperature(city.todayHigh) }}<small>°C</small></strong>
          </div>
          <div
            class="today-extreme-card today-extreme-card--low"
            :class="{ 'outer-not-needed': !outfit.needsOuter }"
            :style="{
              '--outfit-outer': outfit.palette.outer,
              '--outfit-accent': outfit.palette.accent
            }"
          >
            <span>오늘 최저</span>
            <div class="extreme-clothes extreme-clothes--outer" aria-hidden="true">
              <i class="clothing-svg clothing-svg--outer" :style="clothingMask(outfit.outerIcon)"></i>
            </div>
            <small class="extreme-clothes-label">{{ outfit.outerLabel }}</small>
            <strong>{{ formatTemperature(city.todayLow) }}<small>°C</small></strong>
          </div>
        </aside>
      </div>
    </div>
    <RouterLink class="current-location-detail" :to="{ name: 'Detail', params: { cityId: city.id } }">
      상세 날씨 보기 <span aria-hidden="true">→</span>
    </RouterLink>
  </section>
</template>
