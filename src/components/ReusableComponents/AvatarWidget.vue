<script setup lang="ts"></script>

<template>
  <main class="avatar-widget">
    <img src="https://i.pravatar.cc/50" alt="Logo image" />
  </main>
</template>

<style scoped lang="scss">
.avatar-widget {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: $gray-900;
  border: 2px solid $green-500;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  :hover {
    -webkit-animation: popin 0.2s steps(22) forwards;
    animation: popin 0.2s steps(22) forwards;
  }

  @keyframes popin {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
    }
  }
}
</style>
