import { useUserStore } from "@/stores/user";
import { computed } from "vue";

const expires = computed(() => {
  return useUserStore().getExpiresIn;
});

export function isTokenExpired(): boolean {
  if (expires.value === null) return true;
  const currentTime = new Date().getTime() / 1000;
  return currentTime >= expires.value;
}
