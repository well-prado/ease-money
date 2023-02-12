<script setup lang="ts">
import HeaderComponent from "@/components/Transactions/HeaderComponent.vue";
import SearchForm from "@/components/Transactions/SearchForm.vue";
import SummaryComponent from "@/components/Transactions/SummaryComponent.vue";
import TableComponent from "@/components/Transactions/TableComponent.vue";
</script>

<template>
  <main>
    <HeaderComponent />
    <SummaryComponent />
    <SearchForm />
    <TableComponent />
  </main>
</template>
