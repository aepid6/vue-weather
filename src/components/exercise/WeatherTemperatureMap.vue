<script setup>
const props = defineProps({
  weatherList: {
    type: Array,
    default: () => []
  },
  currentLocationId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select-city'])

// SVG의 광역시 경계 중심점과 실제 위도·경도를 대조해 계산한 보정 계수입니다.
// 새 도시를 CITIES에 추가하면 lat/lon만으로 SVG viewBox(800 × 760) 좌표가 계산됩니다.
const svgProjection = {
  width: 800,
  height: 760,
  xFromLongitude: 113.062317,
  xFromLatitude: 3.090174,
  xOffset: -14213.123706,
  yFromLongitude: -0.725762,
  yFromLatitude: -135.653151,
  yOffset: 5337.531217
}

const projectCity = (city) => {
  const x = (city.lon * svgProjection.xFromLongitude)
    + (city.lat * svgProjection.xFromLatitude)
    + svgProjection.xOffset
  const y = (city.lon * svgProjection.yFromLongitude)
    + (city.lat * svgProjection.yFromLatitude)
    + svgProjection.yOffset

  return {
    left: `${Math.min(100, Math.max(0, (x / svgProjection.width) * 100))}%`,
    top: `${Math.min(100, Math.max(0, (y / svgProjection.height) * 100))}%`
  }
}

const temperatureColor = (temperature) => {
  if (temperature === null || temperature === undefined) return '#8ba5b6'
  if (temperature < 10) return '#70d9ff'
  if (temperature < 20) return '#84e8ca'
  if (temperature < 27) return '#ffe18b'
  return '#ff8d79'
}
</script>

<template>
  <section class="temperature-map" aria-label="전국 기온 지도">
    <div class="map-heading">
      <div>
        <p class="map-kicker">LIVE TEMPERATURE</p>
        <h2>전국 기온 지도</h2>
      </div>
      <p>도시를 선택해 상세 날씨를 확인하세요</p>
    </div>
    <div class="map-stage">
      <div class="map-grid" aria-hidden="true"></div>
      <div class="map-projection">
        <img class="korea-map-shape" src="/korea-provinces.svg" alt="" />
        <div class="map-city-layer">
        <button
          v-for="city in props.weatherList"
          :key="city.id"
          class="map-city"
          :class="{ 'is-current-location': city.id === props.currentLocationId }"
          :style="{ ...projectCity(city), '--temperature-color': temperatureColor(city.currentTemp) }"
          :aria-label="`${city.name} ${city.currentTemp ?? '정보 없음'}도 선택`"
          @click="emit('select-city', city.id)"
        >
          <span class="map-city-pulse" aria-hidden="true"></span>
          <span class="map-city-dot" aria-hidden="true"></span>
          <span class="map-city-label">{{ city.name }}</span>
        </button>
        </div>
      </div>
      <p class="map-note">KOREA WEATHER NETWORK · UPDATED LIVE</p>
    </div>

    <div class="map-legend" aria-label="기온 범례">
      <span><i class="legend-cold"></i>선선함</span>
      <span><i class="legend-mild"></i>포근함</span>
      <span><i class="legend-warm"></i>더움</span>
    </div>
  </section>
</template>
