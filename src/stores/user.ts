import { deskree } from "@/deskree";
import router from "@/router";
import { useCookies } from "@vueuse/integrations/useCookies";
import { defineStore } from "pinia";

export interface User {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    access_token: null as string | null,
    refresh_token: null as string | null,
    expires_in: null as number | null,
  }),
  getters: {
    getUser(state) {
      const localState = JSON.parse(localStorage.getItem("user") ?? "{}");
      const user = state.user === null ? localState : state.user;
      if (user) this.user = user;
      return user;
    },
    getAccessToken(state) {
      const access_token =
        state.access_token === null
          ? useCookies().get("access_token")
          : state.access_token;
      if (access_token) this.access_token = access_token;
      return access_token;
    },
    getRefreshToken(state) {
      const refresh_token =
        state.refresh_token === null
          ? useCookies().get("refresh_token")
          : state.refresh_token;
      if (refresh_token) this.refresh_token = refresh_token;
      return refresh_token;
    },
    getExpiresIn(state) {
      const expires_in =
        state.expires_in === null
          ? JSON.parse(sessionStorage.getItem("expires_in") ?? "0")
          : state.expires_in;
      if (expires_in) this.expires_in = expires_in;
      return expires_in;
    },
  },
  actions: {
    setUser(user: User) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    saveTokens(access_token: string, refresh_token: string) {
      useCookies().set("access_token", access_token);
      useCookies().set("refresh_token", refresh_token);
      this.access_token = access_token;
      this.refresh_token = refresh_token;
      this.expires_in = new Date().getTime() / 1000 + 3600;
      sessionStorage.setItem("expires_in", JSON.stringify(this.expires_in));
    },
    async refreshToken(refreshToken: string) {
      const response = await deskree.auth().refreshToken(refreshToken);
      const { access_token, refresh_token } = response.data;
      useCookies().set("access_token", access_token);
      useCookies().set("refresh_token", refresh_token);
      this.access_token = access_token;
      this.refresh_token = refresh_token;
    },
    logout() {
      this.user = null;
      this.access_token = null;
      this.refresh_token = null;
      localStorage.clear();
      sessionStorage.clear();
      useCookies().remove("access_token");
      useCookies().remove("refresh_token");
      router.replace({ name: "Login" });
    },
  },
});
