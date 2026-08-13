<script setup>
import WEATHERGRAPHIC from '@/components/WeatherGraphic.vue'
</script>

<template>
  <section class="not-found-page">
    <div class="not-found-orbit" aria-hidden="true">
      <span class="orbit-ring ring-one"></span>
      <span class="orbit-ring ring-two"></span>
      <WEATHERGRAPHIC class="lost-cloud" type="cloudy" size="large" />
      <span class="lost-star star-a"></span>
      <span class="lost-star star-b"></span>
      <span class="lost-star star-c"></span>
    </div>
    <p class="not-found-kicker">SIGNAL NOT FOUND</p>
    <h1>구름 너머로<br /><em>길을 잃었어요.</em></h1>
    <p class="not-found-copy">요청하신 페이지는 현재 관측 범위에 없습니다.<br />날씨 지도로 돌아가 새로운 경로를 찾아보세요.</p>
    <RouterLink class="not-found-link" to="/"><span aria-hidden="true">←</span> 날씨 지도 돌아가기</RouterLink>
  </section>
</template>
