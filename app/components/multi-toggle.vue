<script setup lang="ts">
defineProps<{
  options: {
    name: string;
    callback: () => void;
  }[];
}>();

const selected = ref(0);
</script>

<template>
  <div class="flex items-center gap-2 max-sm:flex-wrap">
    <button
      v-for="(option, i) in options"
      :key="i"
      :class="{ selected: i === selected }"
      type="button"
      @click="
        () => {
          selected = i;
          option.callback();
        }
      "
    >
      {{ option.name }}
    </button>
  </div>
</template>

<style scoped>
button.selected {
  @apply bg-gray-200;
}
</style>
