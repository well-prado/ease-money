<script setup lang="ts">
import { computed } from "vue";

import { deskree } from "@/deskree";
import { isTokenExpired } from "@/composable/interceptor";

import { useUserStore } from "@/stores/user";

import moment from "moment";

import LoadingWidget from "../ReusableComponents/LoadingWidget.vue";

import type { Transaction } from "@/views/TransactionsView.vue";

defineProps<{
  transactions: Transaction[];
  isLoading: boolean;
}>();

const emit = defineEmits(["deleteTransaction"]);

const formatAmountToBrl = (amount: string) => {
  const newAmount = parseFloat(amount);
  return newAmount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const token = computed(() => useUserStore().getAccessToken);

const refreshToken = computed(() => useUserStore().getRefreshToken);

async function deleteTransaction(uid: string) {
  try {
    if (isTokenExpired(token.value)) {
      await useUserStore().refreshToken(refreshToken.value);
    }
    await deskree.database().from("transactions").delete(uid);
    emit("deleteTransaction", uid);
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <main class="table-container">
    <table v-if="!isLoading">
      <tbody>
        <TransitionGroup name="slide">
          <tr
            v-for="(transaction, index) in transactions"
            :key="index"
            v-bind="$attrs"
          >
            <td>
              <strong>{{ transaction.description }}</strong>
            </td>
            <td
              :style="
                transaction.type === 'income'
                  ? { color: '#00B37E' }
                  : { color: '#F75A68' }
              "
            >
              {{ formatAmountToBrl(transaction.amount) }}
            </td>
            <td>{{ transaction.category }}</td>
            <td>{{ moment(transaction.createdAt).format("DD/MM/YYYY") }}</td>
            <td>
              <img
                src="@/assets/close.svg"
                alt="Delete transaction"
                class="delete-icon"
                @click="deleteTransaction(transaction.uid)"
              />
            </td>
          </tr>
        </TransitionGroup>
      </tbody>
    </table>
    <LoadingWidget width="4rem" height="4rem" class="loading" v-else />
  </main>
</template>

<style scoped lang="scss">
.table-container {
  width: 100%;
  max-width: 1120px;
  margin: 0.5rem auto 0;
  padding: 0 1.5rem;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.5rem;

    td {
      padding: 1.25rem 1rem;
      background-color: $gray-700;

      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        width: 50%;
      }

      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }

      .delete-icon {
        width: 1.5rem;
        height: 1.5rem;
        cursor: pointer;
        transition: filter 0.2s;

        &:hover {
          filter: brightness(0.8);
        }
      }
    }
  }

  .loading {
    margin: 0 auto;
  }
}
</style>
