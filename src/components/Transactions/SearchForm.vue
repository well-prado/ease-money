<script setup lang="ts"></script>

<template>
  <main class="search-container">
    <form class="search-form">
      <input type="text" placeholder="Search" />

      <button type="submit">
        <img src="@/assets/search.svg" alt="Search" />
        Search
      </button>
    </form>
  </main>
</template>

<style scoped lang="scss">
.search-container {
  width: 100%;
  max-width: 1120px;
  margin: 4rem auto 0;
  padding: 0 1.5rem;

  .search-form {
    display: flex;
    gap: 1rem;

    input {
      flex: 1;
      border-radius: 6px;
      border: 0;
      background-color: $gray-900;
      color: $gray-300;
      padding: 1rem;

      &::placeholder {
        color: $gray-500;
      }
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      border: 0;
      padding: 1rem;
      background-color: transparent;
      color: $green-300;
      border: 1px solid $green-300;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background-color: $green-500;
        border-color: $green-500;
        color: $white;
        transition: background-color 0.2s, color 0.2s, border-color 0.2s;

        img {
          filter: brightness(0) invert(1);
        }
      }
    }
  }
}
</style>
