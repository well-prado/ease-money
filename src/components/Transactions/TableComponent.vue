<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";

import { deskree } from "@/deskree";

import moment from "moment";
import LoadingWidget from "../ReusableComponents/LoadingWidget.vue";

type Transaction = {
  uid: string;
  description: string;
  category: string;
  type: string;
  amount: string;
  createdAt: string;
};

const transactions: Ref<Transaction[]> = ref([]);

const isLoading = ref(false);

async function getAllTransactions() {
  try {
    isLoading.value = true;
    const response = await deskree.database().from("transactions").get();
    const transactionArray = response.data.data;
    transactions.value = transactionArray.map((transaction: any) => {
      return {
        ...transaction.attributes,
        uid: transaction.uid,
      };
    });
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}

const formatAmountToBrl = (amount: string) => {
  const newAmount = parseFloat(amount);
  return newAmount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

onMounted(async () => {
  await getAllTransactions();
});
</script>

<template>
  <main class="table-container">
    <table v-if="!isLoading">
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.uid">
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
        </tr>
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
      padding: 1.25rem 2rem;
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
    }
  }

  .loading {
    margin: 0 auto;
  }
}
</style>
