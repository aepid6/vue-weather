<template>
  <section class="weather-loading" role="status" aria-live="polite" aria-label="날씨 정보를 불러오는 중">
    <div class="loading-sky" aria-hidden="true">
      <span class="loading-orbit orbit-outer"></span>
      <span class="loading-orbit orbit-inner"></span>
      <span class="loading-cloud cloud-back">☁</span>
      <span class="loading-cloud cloud-front">☁</span>
      <span class="loading-sun">☀</span>
      <span class="loading-scan"></span>
      <span class="loading-star load-star-one">✦</span>
      <span class="loading-star load-star-two">·</span>
    </div>
    <p class="loading-kicker">WEATHER SATELLITE</p>
    <h1>하늘의 신호를<br><em>수신하고 있어요.</em></h1>
    <div class="loading-progress" aria-hidden="true"><span></span></div>
    <p class="loading-copy">각 도시의 최신 기상 정보를 연결하는 중입니다.</p>
  </section>
</template>
