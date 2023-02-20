<script setup lang="ts">
const props = defineProps<{
  width?: string;
  height?: string;
}>();

const width = props.width || "1.5rem";
const height = props.height || "1.5rem";
</script>

<template>
  <div class="widget-component">
    <svg>
      <path
        stroke="#fff"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10.5 2.544a6 6 0 1 1-5 0"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.widget-component {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind(width);
  height: v-bind(height);

  svg {
    width: 1rem;
    height: 1rem;
    animation: animate-spin 1s linear infinite;
    fill: none;
  }

  @keyframes animate-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
