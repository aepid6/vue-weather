<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: {
    type: Object,
    required: true
  },
  compact: Boolean
})

const portCities = ['부산', '울산', '포항', '인천', '목포', '여수', '창원', '강릉', '속초', '동해', '삼척', '서산', '보령', '군산', '광양', '통영', '거제']
const mountainCities = ['춘천', '원주', '태백', '홍천', '충주', '제천', '영주', '문경', '김천']
const heritageCities = ['전주', '경주', '안동', '공주', '남원']

const sceneType = computed(() => {
  if (['제주', '서귀포'].includes(props.city.name)) return 'island'
  if (heritageCities.includes(props.city.name)) return 'heritage'
  if (portCities.includes(props.city.name)) return 'port'
  if (mountainCities.includes(props.city.name)) return 'mountain'
  return 'city'
})

const cityIndex = computed(() => {
  return [...props.city.id].reduce((total, character) => total + character.charCodeAt(0), 0)
})
</script>

<template>
  <div
    class="city-scene"
    :class="[`scene-${sceneType}`, { compact }]"
    :style="{ '--city-scene-index': cityIndex }"
    aria-hidden="true"
  >
    <span class="scene-light"></span>
    <span class="scene-cloud scene-cloud-one"></span>
    <span class="scene-cloud scene-cloud-two"></span>

    <div class="scene-buildings">
      <i class="building building-one"></i>
      <i class="building building-two"></i>
      <i class="building building-three"></i>
      <i class="building building-four"></i>
      <i class="city-tower"></i>
    </div>

    <div class="scene-mountains">
      <i class="mountain mountain-back"></i>
      <i class="mountain mountain-front"></i>
      <i class="mountain-snow"></i>
    </div>

    <div class="scene-heritage-view">
      <div class="hanok-house">
        <i class="roof roof-back"></i>
        <i class="roof roof-front"></i>
        <i class="hanok-wall"></i>
        <i class="hanok-door"></i>
        <i class="hanok-window window-left"></i>
        <i class="hanok-window window-right"></i>
        <i class="heritage-pillar pillar-one"></i>
        <i class="heritage-pillar pillar-two"></i>
        <i class="heritage-pillar pillar-three"></i>
        <i class="hanok-foundation"></i>
        <i class="hanok-lantern lantern-left"></i>
        <i class="hanok-lantern lantern-right"></i>
      </div>
    </div>

    <div class="scene-port-view">
      <div class="port-ship">
        <i class="ship-hull"></i>
        <i class="ship-deck"></i>
        <i class="ship-cabin"></i>
        <i class="ship-window window-one"></i>
        <i class="ship-window window-two"></i>
        <i class="ship-mast"></i>
        <i class="ship-light"></i>
        <i class="ship-smoke smoke-one"></i>
        <i class="ship-smoke smoke-two"></i>
      </div>
      <i class="wave wave-one"></i>
      <i class="wave wave-two"></i>
      <i class="ship-wake"></i>
    </div>

    <div class="scene-island-view">
      <i class="jeju-sun"></i>
      <i class="hallasan"></i>
      <i class="hallasan-crater"></i>
      <div class="jeju-palm">
        <i class="palm-trunk"></i>
        <i class="palm-leaf leaf-one"></i>
        <i class="palm-leaf leaf-two"></i>
        <i class="palm-leaf leaf-three"></i>
        <i class="palm-leaf leaf-four"></i>
        <i class="palm-leaf leaf-five"></i>
      </div>
      <div class="jeju-stone-wall">
        <i v-for="stone in 7" :key="stone" :style="{ '--stone-index': stone }"></i>
      </div>
      <i class="jeju-wind wind-one"></i>
      <i class="jeju-wind wind-two"></i>
      <i class="island-wave"></i>
    </div>
  </div>
</template>
