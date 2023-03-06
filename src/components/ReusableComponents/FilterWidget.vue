<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps({
  options: {
    type: Array as () => Array<{ text: string; value: string }>,
    required: true,
  },
  selected: {
    type: String,
    required: true,
  },
});

const selected = ref();

defineEmits(["filterTransactions"]);

onMounted(() => {
  // emit("filterTransactions", selected.value);
  console.log(props.options);
  console.log(props.selected);
});
</script>

<template>
  <div>
    <select v-model="selected">
      <option
        v-for="option in props.options"
        :value="option.value"
        :key="option.text"
        :selected="option.text === props.selected"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss"></style>
