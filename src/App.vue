<script setup></script>

<template>
  <header class="site-header">
    <div class="brand">
      <span class="brand-mark">☼</span>
      <span>SKALA Weather</span>
    </div>
    <div class="header-nav">
      <nav aria-label="주요 메뉴">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/cities">Cities</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <main class="app-content">
    <RouterView />
  </main>
</template>

<style scoped></style>
