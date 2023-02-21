<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { deskree } from "@/deskree";
import { isTokenExpired } from "@/composable/interceptor";
import { useUserStore } from "@/stores/user";

import { onClickOutside, onKeyStroke } from "@vueuse/core";

import LoadingWidget from "../ReusableComponents/LoadingWidget.vue";

const target = ref<HTMLElement | null>(null);

onClickOutside(target, () => {
  emit("toggleModal");
});

onKeyStroke("Escape", () => {
  emit("toggleModal");
});

// onKeyStroke("Enter", () => {
//   emit("toggleModal");
//   console.log("Enter");
// });

const emit = defineEmits(["toggleModal", "createNewTransaction"]);

const isLoading = ref(false);

const token = computed(() => useUserStore().getAccessToken);

const refreshToken = computed(() => useUserStore().getRefreshToken);

async function onSubmit() {
  try {
    if (isTokenExpired()) {
      await useUserStore().refreshToken(refreshToken.value);
    }
    isLoading.value = true;
    const response = await deskree.database().from("transactions").create({
      description: transactionObject.value.description,
      category: transactionObject.value.category,
      type: transactionObject.value.type,
      amount: transactionObject.value.amount,
    });
    transactionObject.value.uid = response.data.data.uid;
    transactionObject.value.createdAt = response.data.data.createdAt;
    emit("createNewTransaction", transactionObject.value);
    emit("toggleModal");
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}

const focusFirstInput = () => {
  const input = document.getElementById("title");
  if (input) {
    input.focus();
  }
};

onMounted(() => {
  focusFirstInput();
});

const focusInput = (inputType: string) => {
  const input = document.getElementById(inputType);
  input?.click();
};

const transactionObject = ref({
  description: "",
  category: "",
  type: "" as any,
  amount: "",
  uid: "",
  createdAt: "",
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-container" ref="target">
        <header>
          <h2>Nova Transação</h2>
          <button
            class="close-modal"
            @click="$emit('toggleModal')"
            @keypress="onKeyStroke"
          >
            <img src="@/assets/close.svg" alt="Close modal" />
          </button>
        </header>
        <form @submit.prevent="onSubmit">
          <div class="input-group">
            <input
              v-model="transactionObject.description"
              type="text"
              id="title"
              placeholder="Descrição"
              v-on:focus="true"
              required
            />
          </div>
          <div class="input-group">
            <input
              v-model="transactionObject.amount"
              type="text"
              id="amount"
              placeholder="Valor"
              required
            />
          </div>
          <div class="input-group">
            <input
              v-model="transactionObject.category"
              type="text"
              id="category"
              placeholder="Categoria"
              required
            />
          </div>

          <div class="transaction-type">
            <div
              class="transaction-type-income"
              @click="focusInput('income')"
              :class="{
                'transaction-type-income-active':
                  transactionObject.type === 'income',
              }"
            >
              <img src="@/assets/income.svg" alt="Entrada" />
              <input
                v-model="transactionObject.type"
                type="radio"
                name="type"
                id="income"
                value="income"
              />
              <label for="income">Entrada</label>
            </div>
            <div
              class="transaction-type-outcome"
              @click="focusInput('outcome')"
              :class="{
                'transaction-type-outcome-active':
                  transactionObject.type === 'outcome',
              }"
            >
              <img src="@/assets/outcome.svg" alt="Saída" />
              <input
                v-model="transactionObject.type"
                type="radio"
                name="type"
                id="outcome"
                value="outcome"
              />
              <label for="outcome">Saída</label>
            </div>
          </div>
          <button type="submit" :disabled="isLoading">
            <LoadingWidget v-if="isLoading" />
            <span v-else>Salvar</span>
          </button>
        </form>
        <p class="footer-tip">
          Pressione <strong>ESC</strong> para fechar ou
          <strong>Enter</strong> para Salvar
        </p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  &.active {
    display: flex;
  }

  .modal-container {
    width: 100%;
    max-width: 576px;
    background-color: $gray-800;
    border-radius: 0.25rem;
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 2rem;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 3rem;
      margin-top: 3rem;

      h2 {
        font-size: 1.5rem;
        font-weight: 600;
      }

      .close-modal {
        border: 0;
        background-color: transparent;
        cursor: pointer;
      }
    }

    form {
      padding: 0 3rem;
      .input-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.5rem;

        label {
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        input {
          border-radius: 6px;
          border: 0;
          background-color: $gray-900;
          color: $gray-300;
          padding: 1rem;

          &::placeholder {
            color: $gray-500;
          }
        }
      }

      button {
        width: 100%;
        padding: 0 1.5rem;
        height: 3rem;
        background-color: $green-500;
        color: $white;
        border-radius: 0.25rem;
        border: 0;
        font-size: 1rem;
        font-weight: 600;
        transition: filter 0.2s;

        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;

        &:hover {
          filter: brightness(0.9);
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      }

      .transaction-type {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1.5rem;

        .transaction-type-income {
          background-color: $gray-700;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 6px;
          border: 0;
          color: $gray-300;
          cursor: pointer;
          width: 100%;

          label {
            cursor: pointer;
          }

          &:hover {
            filter: brightness(0.9);
            transition: filter 0.2s;
          }
        }

        .transaction-type-outcome {
          background-color: $gray-700;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 6px;
          border: 0;
          color: $gray-300;
          cursor: pointer;
          width: 100%;

          label {
            cursor: pointer;
          }

          &:hover {
            filter: brightness(0.9);
            transition: filter 0.2s;
          }
        }

        .transaction-type-income-active {
          background-color: $green-500;
          color: $white;
          filter: brightness(0.8);

          img {
            filter: brightness(0) invert(1);
          }
        }

        .transaction-type-outcome-active {
          background-color: $red-500;
          color: $white;
          filter: brightness(0.8);

          img {
            filter: brightness(0) invert(1);
          }
        }
      }
    }
    .footer-tip {
      padding: 0 3rem;
      margin-bottom: 1rem;

      font-size: 0.775rem;
      color: $gray-400;
    }
  }
}

#income,
#outcome {
  display: none;
}
</style>
