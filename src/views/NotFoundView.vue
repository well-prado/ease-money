<script setup lang="ts"></script>

<template>
  <div class="not-found-view">
    <h1>404</h1>
    <h2>Page not found</h2>
    <RouterLink to="/">Go to home</RouterLink>
  </div>
</template>

<style scoped lang="scss">
.not-found-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
  padding-bottom: 8rem;
  h1 {
    font-size: 10rem;
    font-weight: 700;
    margin: 0;
  }
  h2 {
    font-size: 2rem;
    font-weight: 400;
    margin: 0;
  }
}
</style>
