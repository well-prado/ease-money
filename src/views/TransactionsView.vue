<script setup lang="ts">
import { capitalize, computed, onMounted, ref, type Ref } from "vue";

import { deskree } from "@/deskree";
import { isTokenExpired } from "@/composable/interceptor";

import { useUserStore } from "@/stores/user";

import HeaderComponent from "@/components/Transactions/HeaderComponent.vue";
import SearchForm from "@/components/Transactions/SearchForm.vue";
import SummaryComponent from "@/components/Transactions/SummaryComponent.vue";
import TableComponent from "@/components/Transactions/TableComponent.vue";
import FilterWidget from "@/components/ReusableComponents/FilterWidget.vue";

export type Transaction = {
  uid: string;
  description: string;
  category: string;
  type: string;
  amount: string;
  createdAt: string;
};

const isLoading = ref(false);

const transactions: Ref<Transaction[]> = ref([]);

const refreshToken = computed(() => useUserStore().getRefreshToken);

const user = computed(() => useUserStore().getUser);

async function getAllTransactions() {
  try {
    if (isTokenExpired()) {
      await useUserStore().refreshToken(refreshToken.value);
    }
    isLoading.value = true;

    const response = await deskree
      .database()
      .from("transactions")
      .get({
        where: [
          {
            attribute: "author",
            operator: "==",
            value: user.value.uid,
          },
        ],
        "sorted[how]": "asc",
        "sorted[param]": "createdAt",
      });
    const transactionArray = response.data.data;
    transactions.value = transactionArray.map((transaction: any) => {
      return {
        ...transaction.attributes,
        uid: transaction.uid,
      };
    });
  } catch (e: any) {
    console.error(e);
    const status = e.response.data.errors[0].code
      ? e.response.data.errors[0].code
      : e.response.data.errors.errors[0].code;
    if (status === "403" || status === "401" || status === "400") {
      const response = await useUserStore().refreshToken(refreshToken.value);
      console.log(response);
      if (response.status === 200) {
        window.location.reload();
      }
    }
  } finally {
    isLoading.value = false;
  }
}

function createNewTransaction(transaction: Transaction) {
  transactions.value.push(transaction);
}

function deleteTransaction(uid: string) {
  transactions.value = transactions.value.filter(
    (transaction) => transaction.uid !== uid
  );
}

const monthFilterOptions = [
  { text: "Janeiro", value: "01" },
  { text: "Fevereiro", value: "02" },
  { text: "Março", value: "03" },
  { text: "Abril", value: "04" },
  { text: "Maio", value: "05" },
  { text: "Junho", value: "06" },
  { text: "Julho", value: "07" },
  { text: "Agosto", value: "08" },
  { text: "Setembro", value: "09" },
  { text: "Outubro", value: "10" },
  { text: "Novembro", value: "11" },
  { text: "Dezembro", value: "12" },
];

const currentMonth = capitalize(
  new Date().toLocaleString("default", { month: "long" })
);

onMounted(async () => {
  await getAllTransactions();
  console.log(currentMonth);
});
</script>

<template>
  <main>
    <HeaderComponent @create-new-transaction="createNewTransaction($event)" />
    <SummaryComponent :transactions="transactions" :is-loading="isLoading" />
    <SearchForm />
    <FilterWidget :options="monthFilterOptions" :selected="currentMonth" />
    <TableComponent
      :transactions="transactions"
      :is-loading="isLoading"
      @delete-transaction="deleteTransaction($event)"
    />
  </main>
</template>
