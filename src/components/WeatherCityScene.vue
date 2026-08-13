<script setup>
import { computed } from 'vue'
import { getCitySceneType, isSmallCity } from '@/constants/cityScene'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  compact: Boolean,
})

const sceneType = computed(() => getCitySceneType(props.city.id))
const hasSmallCityEffect = computed(() => isSmallCity(props.city.id))
</script>

<template>
  <div class="city-scene" :class="[`scene-${sceneType}`, { compact, 'scene-small-city': hasSmallCityEffect }]" aria-hidden="true">
    <span class="scene-light"></span>
    <span class="scene-cloud scene-cloud-one"></span>
    <span class="scene-cloud scene-cloud-two"></span>

    <div class="small-city-effect">
      <span class="small-city-house small-city-house--one"><b></b></span>
      <span class="small-city-house small-city-house--two"><b></b><em></em></span>
      <span class="small-city-house small-city-house--three"><b></b></span>
      <span class="small-city-smoke small-city-smoke--one"></span>
      <span class="small-city-smoke small-city-smoke--two"></span>
      <i class="small-city-light small-city-light--one"></i>
      <i class="small-city-light small-city-light--two"></i>
      <i class="small-city-light small-city-light--three"></i>
      <i class="small-city-light small-city-light--four"></i>
      <i class="small-city-light small-city-light--five"></i>
    </div>

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
        <i v-for="stone in 7" :key="stone" :class="`stone--${stone}`"></i>
      </div>
      <i class="jeju-wind wind-one"></i>
      <i class="jeju-wind wind-two"></i>
      <i class="island-wave"></i>
    </div>
  </div>
</template>
