// import { useUserStore } from "@/stores/user";
import { useUserStore } from "@/stores/user";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/transactions",
      name: "Transactions",
      component: () => import("../views/TransactionsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === "/" || to.path === null || to.path === undefined) {
    next("/transactions");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  const token = useUserStore().getAccessToken;
  const user = useUserStore().getUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !token && !user) {
    next("/login");
  } else {
    next();
  }
});

export default router;
