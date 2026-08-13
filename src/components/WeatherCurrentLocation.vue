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
import { CITY_SCENE_LABELS, getCitySceneType } from '@/constants/cityScene'
import { OUTFIT_PALETTES } from '@/constants/outfit'
import { DEFAULT_WEATHER_EMOJI, WEATHER_EMOJIS } from '@/constants/weatherDisplay'

const props = defineProps({
  city: {
    type: Object,
    default: null,
  },
})

const cityLandmark = computed(() => {
  const type = getCitySceneType(props.city?.id)

  return { type, label: CITY_SCENE_LABELS[type] }
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

outfitPalette.value = Math.floor(Math.random() * OUTFIT_PALETTES.length)

const refreshOutfitPalette = () => {
  if (OUTFIT_PALETTES.length < 2) return

  let nextPalette = outfitPalette.value
  while (nextPalette === outfitPalette.value) {
    nextPalette = Math.floor(Math.random() * OUTFIT_PALETTES.length)
  }
  outfitPalette.value = nextPalette
}

const outfit = computed(() => {
  const high = props.city?.todayHigh
  const low = props.city?.todayLow
  const palette = OUTFIT_PALETTES[outfitPalette.value]

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
  const outerLabel = !Number.isFinite(low) ? '외투 정보 확인 중' : low < 5 ? '두꺼운 외투가 필요해요' : low < 12 ? '자켓을 챙기세요' : low < 16 ? '얇은 외투가 좋아요' : '외투 없이도 괜찮아요'

  const topIcon = ['summer', 'light'].includes(type) ? tshirtIcon : type === 'shirt' ? shirtIcon : sweaterIcon
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
  },
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
    temp: index === currentTimelineIndex.value && Number.isFinite(props.city?.currentTemp) ? props.city.currentTemp : hour.temp,
  }))
  const temperatures = normalizedTimeline.map((hour) => hour.temp).filter(Number.isFinite)

  if (!temperatures.length) return []

  const minimum = Math.min(...temperatures)
  const maximum = Math.max(...temperatures)
  const range = Math.max(maximum - minimum, 1)

  return normalizedTimeline.map((hour, index) => ({
    ...hour,
    x: 28 + index * 56,
    y: 82 - ((hour.temp - minimum) / range) * 48,
  }))
})

const graphPolyline = computed(() => graphPoints.value.map((point) => `${point.x},${point.y}`).join(' '))
const hasHourlyForecast = computed(() => graphPoints.value.length > 0)

const weatherGraphicVariant = (status = '') => {
  if (status.includes('뇌우')) return 'storm'
  if (status.includes('눈')) return 'snow'
  if (status.includes('비')) return 'rain'
  if (status.includes('안개')) return 'fog'
  if (status === '맑음') return 'clear'
  if (status.includes('흐림') || status.includes('구름')) return 'cloud'
  return 'partly-cloudy'
}

const visibilityGraphicVariant = (visibility) => {
  if (!Number.isFinite(visibility)) return 'unknown'
  if (visibility >= 10000) return 'clear'
  if (visibility >= 5000) return 'moderate'
  return 'cloudy'
}

const fallbackWeatherItems = computed(() => [
  {
    label: '기압',
    value: Number.isFinite(props.city?.details?.pressure) ? props.city.details.pressure : '--',
    unit: Number.isFinite(props.city?.details?.pressure) ? 'hPa' : '',
    graphic: 'pressure',
  },
  {
    label: '가시거리',
    value: Number.isFinite(props.city?.details?.visibility) ? (props.city.details.visibility / 1000).toFixed(1) : '--',
    unit: Number.isFinite(props.city?.details?.visibility) ? 'km' : '',
    graphic: 'visibility',
    variant: visibilityGraphicVariant(props.city?.details?.visibility),
  },
  {
    label: '현재 날씨',
    value: props.city?.status || '정보 없음',
    unit: '',
    graphic: 'weather',
  },
])

const weatherEmoji = (status) => WEATHER_EMOJIS[status] || DEFAULT_WEATHER_EMOJI

const clothingIconClass = (icon) =>
  ({
    [tshirtIcon]: 'clothing-icon--tshirt',
    [shirtIcon]: 'clothing-icon--shirt',
    [sweaterIcon]: 'clothing-icon--sweater',
    [shortsIcon]: 'clothing-icon--shorts',
    [pantsIcon]: 'clothing-icon--pants',
    [jacketIcon]: 'clothing-icon--jacket',
    [coatIcon]: 'clothing-icon--coat',
  })[icon]

const formatTime = (time) => {
  return new Date(time).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    hour12: false,
  })
}
</script>

<template>
  <section v-if="city" class="current-location-card" aria-live="polite">
    <div :key="city.id" class="current-location-landmark" :class="`landmark-${cityLandmark.type}`" :aria-label="`${city.name} ${cityLandmark.label}`">
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
    <div class="location-forecast" :aria-label="hasHourlyForecast ? '12시간 기온 예보' : '현재 상세 날씨'">
      <div class="location-forecast-heading">
        <span>{{ hasHourlyForecast ? '12시간 기온 흐름' : '현재 상세 날씨' }}</span>
        <small v-if="!hasHourlyForecast">예보 호출 한도로 현재 관측값을 표시합니다</small>
      </div>
      <div v-if="hasHourlyForecast" class="location-forecast-body">
        <div class="location-forecast-scroll">
          <svg class="location-forecast-chart" viewBox="0 0 672 112" role="img" aria-label="시간별 기온 그래프">
            <defs>
              <linearGradient id="forecast-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="var(--theme-accent)" stop-opacity=".28" />
                <stop offset="1" stop-color="var(--theme-accent)" stop-opacity="0" />
              </linearGradient>
            </defs>
            <line v-for="guide in [32, 56, 80]" :key="guide" x1="0" :y1="guide" x2="672" :y2="guide" class="forecast-guide" />
            <polygon v-if="graphPoints.length" :points="`28,102 ${graphPolyline} ${graphPoints.at(-1).x},102`" fill="url(#forecast-area-gradient)" />
            <polyline :points="graphPolyline" class="forecast-line" />
            <g v-for="(point, index) in graphPoints" :key="point.time" class="forecast-point" :class="{ current: index === currentTimelineIndex }">
              <circle :cx="point.x" :cy="point.y" r="4" />
              <text :x="point.x" :y="point.y - 10">{{ formatTemperature(point.temp) }}°</text>
            </g>
          </svg>
          <div class="location-forecast-track">
            <div
              v-for="(hour, index) in city.temperatureTimeline"
              :key="hour.time"
              class="location-forecast-item"
              :class="[
                `forecast-delay--${index}`,
                {
                  current: index === currentTimelineIndex,
                  future: index > currentTimelineIndex,
                },
              ]"
            >
              <span>{{ index === currentTimelineIndex ? '현재' : formatTime(hour.time) }}</span>
              <b class="forecast-weather-emoji" :title="hour.weatherStatus || '예보'" aria-hidden="true">{{ weatherEmoji(hour.weatherStatus) }}</b>
              <small>{{ hour.weatherStatus || '예보' }}</small>
            </div>
          </div>
        </div>
        <aside class="today-extremes" aria-label="오늘 최고 및 최저 기온">
          <div class="today-extreme-card today-extreme-card--high" :class="[`outfit-${outfit.type}`, `outfit-palette--${outfitPalette}`]">
            <span>오늘 최고</span>
            <button type="button" class="outfit-color-refresh" aria-label="추천 옷차림 색상 조합 바꾸기" title="옷 색상 바꾸기" @click="refreshOutfitPalette">
              <i class="palette-swatch--top" aria-hidden="true"></i>
              <i class="palette-swatch--bottom" aria-hidden="true"></i>
            </button>
            <div class="extreme-clothes extreme-clothes--daily" aria-hidden="true">
              <i class="clothing-svg clothing-svg--top" :class="clothingIconClass(outfit.topIcon)"></i>
              <i class="clothing-svg clothing-svg--bottom" :class="clothingIconClass(outfit.bottomIcon)"></i>
            </div>
            <small class="extreme-clothes-label">{{ outfit.label }}</small>
            <strong>{{ formatTemperature(city.todayHigh) }}<small>°C</small></strong>
          </div>
          <div class="today-extreme-card today-extreme-card--low" :class="[`outfit-palette--${outfitPalette}`, { 'outer-not-needed': !outfit.needsOuter }]">
            <span>오늘 최저</span>
            <div class="extreme-clothes extreme-clothes--outer" aria-hidden="true">
              <i class="clothing-svg clothing-svg--outer" :class="clothingIconClass(outfit.outerIcon)"></i>
            </div>
            <small class="extreme-clothes-label">{{ outfit.outerLabel }}</small>
            <strong>{{ formatTemperature(city.todayLow) }}<small>°C</small></strong>
          </div>
        </aside>
      </div>
      <div v-else class="location-fallback-body">
        <div class="location-fallback-metrics">
          <article v-for="item in fallbackWeatherItems" :key="item.label">
            <span>{{ item.label }}</span>
            <i class="fallback-metric-graphic" :class="[`fallback-metric-graphic--${item.graphic}`, item.graphic === 'weather' ? `fallback-metric-graphic--weather-${weatherGraphicVariant(city.status)}` : item.variant ? `fallback-metric-graphic--${item.graphic}-${item.variant}` : null]" aria-hidden="true"><b></b></i>
            <strong
              >{{ item.value }}<small v-if="item.unit"> {{ item.unit }}</small></strong
            >
          </article>
        </div>
        <aside class="today-extremes today-extremes--fallback" aria-label="체감온도 및 습도">
          <div class="today-extreme-card current-detail-card">
            <span>체감온도</span>
            <i class="current-detail-icon current-detail-icon--temperature" aria-hidden="true"></i>
            <strong>{{ formatTemperature(city.details?.feelsLike) }}<small>°C</small></strong>
          </div>
          <div class="today-extreme-card current-detail-card">
            <span>습도</span>
            <i class="current-detail-icon current-detail-icon--humidity" aria-hidden="true"></i>
            <strong>{{ city.details?.humidity ?? '--' }}<small>%</small></strong>
          </div>
        </aside>
      </div>
    </div>
    <RouterLink class="current-location-detail" :to="{ name: 'Detail', params: { cityId: city.id } }"> 상세 날씨 보기 <span aria-hidden="true">→</span> </RouterLink>
  </section>
</template>

<!-- prettier-ignore -->
<style scoped>
.fallback-metric-graphic { width: 72px; height: 72px; position: relative; place-self: center; display: block; color: var(--theme-accent); filter: drop-shadow(0 0 12px color-mix(in srgb, currentColor 30%, transparent)); animation: fallback-graphic-float 4s ease-in-out infinite; }
.fallback-metric-graphic b, .fallback-metric-graphic::before, .fallback-metric-graphic::after { content: ''; position: absolute; display: block; }
.fallback-metric-graphic--pressure::before { width: 52px; height: 52px; left: 10px; top: 9px; border: 3px solid currentColor; border-bottom-color: color-mix(in srgb, currentColor 24%, transparent); border-radius: 50%; background: radial-gradient(circle, transparent 55%, color-mix(in srgb, currentColor 10%, transparent) 57%, transparent 60%), color-mix(in srgb, var(--theme-stage) 74%, transparent); box-shadow: inset 0 0 16px color-mix(in srgb, currentColor 12%, transparent); }
.fallback-metric-graphic--pressure::after { width: 8px; height: 8px; left: 32px; top: 33px; border-radius: 50%; background: currentColor; box-shadow: 0 0 9px currentColor; }
.fallback-metric-graphic--pressure b { width: 3px; height: 23px; left: 35px; top: 14px; border-radius: 3px; background: currentColor; transform: rotate(42deg); transform-origin: 50% 100%; animation: pressure-needle 4.8s ease-in-out infinite; }
.fallback-metric-graphic--visibility::before { width: 48px; height: 17px; left: 8px; top: 38px; border-radius: 18px; background: currentColor; box-shadow: 11px -10px 0 -3px currentColor, 27px -7px 0 -5px currentColor, 0 0 14px color-mix(in srgb, currentColor 28%, transparent); transition: opacity 0.3s, transform 0.3s; animation: visibility-cloud-drift 4.2s ease-in-out infinite; }
.fallback-metric-graphic--visibility::after { width: 39px; height: 14px; right: 5px; top: 20px; border-radius: 16px; background: currentColor; box-shadow: 9px -8px 0 -3px currentColor, 22px -5px 0 -5px currentColor; transition: opacity 0.3s, transform 0.3s; animation: visibility-cloud-drift 5s -2s ease-in-out infinite reverse; }
.fallback-metric-graphic--visibility b { width: 56px; height: 1px; left: 8px; bottom: 7px; opacity: 0.42; background: linear-gradient(90deg, transparent, currentColor, transparent); box-shadow: 0 -5px color-mix(in srgb, currentColor 50%, transparent); }
.fallback-metric-graphic--visibility-clear::before { opacity: 0.38; transform: translate(10px, -3px) scale(0.72); }
.fallback-metric-graphic--visibility-clear::after { opacity: 0; transform: translateX(16px) scale(0.65); }
.fallback-metric-graphic--visibility-moderate::before { opacity: 0.76; transform: translate(2px, 0) scale(0.9); }
.fallback-metric-graphic--visibility-moderate::after { opacity: 0.38; transform: translate(7px, -2px) scale(0.78); }
.fallback-metric-graphic--visibility-cloudy::before { opacity: 0.98; transform: translate(-3px, 1px) scale(1.08); }
.fallback-metric-graphic--visibility-cloudy::after { opacity: 0.78; transform: translate(-8px, 2px) scale(1.02); }
.fallback-metric-graphic--visibility-unknown::before, .fallback-metric-graphic--visibility-unknown::after { opacity: 0.3; filter: grayscale(1); }
.fallback-metric-graphic--weather::before { width: 31px; height: 31px; left: 12px; top: 9px; border: 3px solid currentColor; border-radius: 50%; background: color-mix(in srgb, currentColor 22%, transparent); box-shadow: 0 0 18px color-mix(in srgb, currentColor 34%, transparent); transition: opacity 0.25s, transform 0.25s; }
.fallback-metric-graphic--weather::after { width: 43px; height: 21px; left: 20px; top: 34px; border: 3px solid currentColor; border-radius: 18px; background: var(--theme-stage); box-shadow: -13px 4px 0 -1px var(--theme-stage), -15px 4px 0 2px currentColor, inset 0 0 13px color-mix(in srgb, currentColor 12%, transparent); transition: opacity 0.25s, transform 0.25s; }
.fallback-metric-graphic--weather b { width: 3px; height: 9px; left: 27px; top: 59px; border-radius: 4px; opacity: 0; background: currentColor; box-shadow: 11px 0 currentColor, 22px 0 currentColor; }
.fallback-metric-graphic--weather-clear::after { opacity: 0; transform: translate(8px, 5px) scale(0.7); }
.fallback-metric-graphic--weather-clear::before { left: 20px; top: 19px; transform: scale(1.2); }
.fallback-metric-graphic--weather-cloud::before, .fallback-metric-graphic--weather-fog::before { opacity: 0.24; transform: translate(9px, 8px) scale(0.78); }
.fallback-metric-graphic--weather-rain b, .fallback-metric-graphic--weather-snow b, .fallback-metric-graphic--weather-storm b, .fallback-metric-graphic--weather-fog b { opacity: 0.9; }
.fallback-metric-graphic--weather-rain b, .fallback-metric-graphic--weather-storm b { transform: skewX(-16deg); animation: weather-rain 1.15s linear infinite; }
.fallback-metric-graphic--weather-snow b { width: 5px; height: 5px; border-radius: 50%; animation: weather-snow 2.4s ease-in-out infinite; }
.fallback-metric-graphic--weather-fog b { width: 51px; height: 2px; left: 11px; top: 58px; border-radius: 3px; background: linear-gradient(90deg, transparent, currentColor 20% 80%, transparent); box-shadow: 0 7px color-mix(in srgb, currentColor 72%, transparent); animation: weather-fog 3s ease-in-out infinite; }
.fallback-metric-graphic--weather-storm b { height: 15px; clip-path: polygon(44% 0, 100% 0, 66% 38%, 100% 38%, 15% 100%, 37% 55%, 0 55%); box-shadow: none; }
@keyframes fallback-graphic-float {
0%, 100% { transform: translateY(2px); }
50% { transform: translateY(-3px); }
}
@keyframes pressure-needle {
0%, 100% { transform: rotate(29deg); }
50% { transform: rotate(55deg); }
}
@keyframes visibility-cloud-drift {
0%, 100% { margin-left: -3px; filter: brightness(0.86); }
50% { margin-left: 4px; filter: brightness(1.12); }
}
@keyframes weather-rain {
from { transform: translateY(-3px) skewX(-16deg); opacity: 0; }
35% { opacity: 0.9; }
to { transform: translateY(4px) skewX(-16deg); opacity: 0; }
}
@keyframes weather-snow {
0%, 100% { transform: translateY(-2px); opacity: 0.45; }
50% { transform: translateY(4px); opacity: 1; }
}
@keyframes weather-fog {
0%, 100% { transform: translateX(-3px); opacity: 0.45; }
50% { transform: translateX(3px); opacity: 0.9; }
}
@media (prefers-reduced-motion: reduce) {
.fallback-metric-graphic, .fallback-metric-graphic b { animation: none; }
}
</style>
