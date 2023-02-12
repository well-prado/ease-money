<script setup lang="ts">
import moment from "moment";

const transactions = [
  {
    id: 1,
    title: "Desenvolvimento de site",
    type: "income",
    category: "Venda",
    amount: 12000,
    createdAt: new Date("2023-02-12 09:00:00"),
  },
  {
    id: 2,
    title: "Aluguel",
    type: "outcome",
    category: "Moradia",
    amount: 1200,
    createdAt: new Date("2023-02-14 11:00:00"),
  },
];

const formatAmountToBrl = (amount: number) => {
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};
</script>

<template>
  <main class="table-container">
    <table>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>
            <strong>{{ transaction.title }}</strong>
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
}
</style>
