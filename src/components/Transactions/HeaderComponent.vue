<script setup lang="ts">
import { useUserStore, type User } from "@/stores/user";
import { onKeyStroke, useElementHover } from "@vueuse/core";
import { computed, ref, type ComputedRef } from "vue";

import ModalComponent from "./ModalComponent.vue";
import Avatar from "@/components/ReusableComponents/AvatarWidget.vue";
import DropdownMenu from "../ReusableComponents/DropdownMenu.vue";

const isModalActive = ref(false);

const toggleModal = () => {
  isModalActive.value = !isModalActive.value;
};

onKeyStroke("Control" && "b", () => {
  isModalActive.value = true;
});

const hoverButtonTip = ref();
const isHovered = useElementHover(hoverButtonTip);

const user: ComputedRef<User | null> = computed(() => useUserStore().getUser);

const emit = defineEmits(["createNewTransaction"]);
</script>

<template>
  <main class="header-container">
    <div class="header-content">
      <img src="@/assets/logo.svg" alt="Logo image" />
      <div class="header-right-wrapper">
        <button ref="hoverButtonTip" class="button" @click="toggleModal">
          {{ isHovered ? "Pressione CTRL + B" : "Nova Transação" }}
        </button>
        <Avatar :image="user?.avatarUrl" @click="useUserStore().logout()" />
        <DropdownMenu title="Test" :is-open="false" />
      </div>
    </div>
    <ModalComponent
      v-if="isModalActive"
      @toggle-modal="toggleModal"
      @create-new-transaction="emit('createNewTransaction', $event)"
    />
  </main>
</template>

<style scoped lang="scss">
.header-container {
  background-color: $gray-900;
  padding: 2.5rem 0 7.5rem;

  .header-content {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 1.5rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-right-wrapper {
      display: flex;
      gap: 3rem;
      align-items: center;
    }

    .button {
      height: 50px;
      border: 0;
      background-color: $green-500;
      color: $white;
      font-weight: bold;
      padding: 0 1.25rem;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background-color: $green-700;
        transition: background-color 0.5s;
      }
    }
  }
}
</style>
