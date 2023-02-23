<script setup lang="ts">
defineProps<{
  title: string;
  isOpen: boolean;
}>();

defineEmits(["closeMenu"]);
</script>

<template>
  <div v-if="isOpen" class="dropdown-menu">
    <div class="dropdown-menu__header">
      <h4>{{ title }}</h4>
      <button @click="$emit('closeMenu')">
        <img src="@/assets/icons/close.svg" alt="Close" />
      </button>
    </div>
    <div class="dropdown-menu__body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dropdown-menu {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &__body {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: calc(100% - 50px);
    background-color: #fff;
    padding: 1rem;
    overflow-y: auto;
  }
}
</style>
