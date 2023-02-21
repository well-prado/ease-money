<script setup lang="ts">
import type { Transaction } from "@/views/TransactionsView.vue";
import { computed } from "vue";

const props = defineProps<{
  transactions: Transaction[];
  isLoading: boolean;
}>();

const summary = computed(() => {
  const summary = props.transactions.reduce(
    (acc: any, transaction: Transaction) => {
      if (transaction.type === "income") {
        acc.income += Number(transaction.amount);
        acc.total += Number(transaction.amount);
      } else {
        acc.outcome += Number(transaction.amount);
        acc.total -= Number(transaction.amount);
      }
      return acc;
    },
    {
      income: 0,
      outcome: 0,
      total: 0,
    }
  );
  return summary;
});

const formatAmountToBrl = (amount: string) => {
  const newAmount = parseFloat(amount);
  return newAmount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};
</script>

<template>
  <main class="summary-container">
    <div class="summary-card">
      <header>
        <p>Entradas</p>
        <img src="@/assets/income.svg" alt="Income image" />
      </header>
      <strong>+ {{ formatAmountToBrl(summary.income) }}</strong>
    </div>
    <div class="summary-card">
      <header>
        <p>Saídas</p>
        <img src="@/assets/outcome.svg" alt="Outcome image" />
      </header>
      <strong>- {{ formatAmountToBrl(summary.outcome) }}</strong>
    </div>
    <div class="summary-card highlight-background">
      <header>
        <p>Total</p>
        <img src="@/assets/total.svg" alt="Total image" />
      </header>
      <strong>{{ formatAmountToBrl(summary.total) }}</strong>
    </div>
  </main>
</template>

<style scoped lang="scss">
.summary-container {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.5rem;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  margin-top: -5rem;

  .summary-card {
    background-color: $gray-600;
    padding: 1.5rem 2rem;
    border-radius: 6px;
    color: $white;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    strong {
      display: block;
      margin-top: 1rem;
      font-size: 2rem;
      font-weight: 500;
      line-height: 3rem;
    }

    &.highlight-background {
      background-color: $green-500;
    }
  }
}
</style>
