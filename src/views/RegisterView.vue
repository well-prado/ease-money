<script setup lang="ts">
import { onMounted, ref } from "vue";
import router from "@/router";

import { deskree, options } from "@/deskree";
import { isAxiosError } from "axios";

import { useUserStore } from "@/stores/user";

import LoadingWidget from "@/components/ReusableComponents/LoadingWidget.vue";

const registerUserObject = ref({
  fullName: "",
  email: "",
  password: "",
});

const isLoading = ref(false);

async function handleRegistration() {
  try {
    isLoading.value = true;
    const user = await registerUser();
    const token = await getToken();
    user["data"]["data"]["uid"] = token.data.uid;
    useUserStore().setUser(user.data.data);
    useUserStore().saveTokens(token.data.idToken, token.data.refreshToken);
    router.replace({ name: "Transactions" });
  } catch (e) {
    isLoading.value = false;
    console.error(e);
    throw e;
  } finally {
    isLoading.value = false;
  }
}
async function registerUser() {
  try {
    isLoading.value = true;
    const signup = await deskree
      .auth()
      .signUpEmail(
        registerUserObject.value.email,
        registerUserObject.value.password
      );
    options["userToken"] = signup.data.idToken;
    const user = await deskree
      .database()
      .from("users")
      .update(signup.data.uid, {
        fullName: registerUserObject.value.fullName,
      });
    return user;
  } catch (e) {
    isLoading.value = false;
    if (isAxiosError(e)) {
      console.error(e.response?.data.errors.errors[0]);
    } else {
      console.error(e);
    }
  }
}
async function getToken() {
  try {
    isLoading.value = true;
    const token = await deskree
      .auth()
      .signInEmail(
        registerUserObject.value.email,
        registerUserObject.value.password
      );
    return token;
  } catch (e) {
    isLoading.value = false;
    if (isAxiosError(e)) {
      console.error(e.response?.data.errors.errors[0]);
    } else {
      console.error(e);
    }
  }
}

onMounted(() => {
  const input = document.getElementById("name");
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
        <h4>Registrar</h4>
        <form @submit.prevent="handleRegistration">
          <div class="input-group">
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              v-model="registerUserObject.fullName"
              required
            />
          </div>
          <div class="input-group">
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              v-model="registerUserObject.email"
              required
            />
          </div>
          <div class="input-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              v-model="registerUserObject.password"
              required
            />
          </div>
          <div class="input-group">
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
            />
          </div>
          <button type="submit" :disabled="isLoading">
            <LoadingWidget v-if="isLoading" />
            <span v-else>Criar conta</span>
          </button>
        </form>
        <p>
          Você já possui um cadastro?
          <RouterLink to="/login"
            ><span><strong>Clique aqui</strong></span></RouterLink
          >
          para ir ao login.
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
  padding-top: 4rem;

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
