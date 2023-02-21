<script setup lang="ts">
import { onMounted, ref } from "vue";
import router from "@/router";

import { deskree, options } from "@/deskree";

import LoadingWidget from "@/components/ReusableComponents/LoadingWidget.vue";
import { isAxiosError } from "axios";
import { useUserStore } from "@/stores/user";

const loginUserObject = ref({
  email: "",
  password: "",
});
const isLoading = ref(false);

async function loginUser() {
  try {
    isLoading.value = true;
    const login = await deskree
      .auth()
      .signInEmail(loginUserObject.value.email, loginUserObject.value.password);
    options["userToken"] = login.data.idToken;
    const user = await deskree
      .database()
      .from("users")
      .getByUID(login.data.uid);
    user["data"]["data"]["uid"] = login.data.uid;
    useUserStore().setUser(user.data.data);
    useUserStore().saveTokens(login.data.idToken, login.data.refreshToken);
    router.replace({ name: "Transactions" });
  } catch (e) {
    if (isAxiosError(e)) {
      console.error(e.response?.data.errors.errors[0]);
    } else {
      console.error(e);
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  const input = document.getElementById("email");
  input?.focus();
});
</script>

<template>
  <main class="login-page">
    <div class="login-wrapper">
      <header>
        <img src="@/assets/logo.svg" alt="Logo" />
      </header>
      <div class="login-container">
        <h4>Acessar</h4>
        <form @submit.prevent="loginUser">
          <div class="input-group">
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              v-model="loginUserObject.email"
              required
            />
          </div>
          <div class="input-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              v-model="loginUserObject.password"
              required
            />
          </div>
          <button type="submit" :disabled="isLoading">
            <LoadingWidget v-if="isLoading" />
            <span v-else>Entrar</span>
          </button>
        </form>
        <p>
          Novo por aqui? Crie uma conta
          <RouterLink to="/register"
            ><span><strong>clicando aqui</strong></span></RouterLink
          >!
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background-color: $gray-900;
  position: relative;
  padding-top: 10rem;

  .login-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 8rem;
  }
  .login-container {
    padding: 3rem;
    width: 100%;
    max-width: 576px;
    background-color: $gray-800;
    border-radius: 0.25rem;
    position: relative;
    margin-bottom: 10rem;

    display: flex;
    flex-direction: column;
    gap: 2rem;

    h4 {
      font-family: "Roboto";
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 140%;
      color: #e1e1e6;
    }

    form {
      .input-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.5rem;

        input {
          border-radius: 6px;
          border: 0;
          background-color: $gray-900;
          color: $gray-300;
          padding: 1rem;

          &::placeholder {
            color: $gray-500;
          }
        }
      }

      button {
        width: 100%;
        padding: 0 1.5rem;
        height: 3rem;
        background-color: $green-500;
        color: $white;
        border-radius: 0.25rem;
        border: 0;
        font-size: 1rem;
        font-weight: 600;
        transition: filter 0.2s;
        margin-top: 2.5rem;

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        &:hover {
          filter: brightness(0.9);
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
