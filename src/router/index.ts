import { createRouter, createWebHistory } from "vue-router";
import TransactionsView from "../views/TransactionsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Transactions",
      component: TransactionsView,
    },
  ],
});

export default router;
