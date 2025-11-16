<script setup lang="ts">
import { Operation } from '~/core/domain/trade';

defineProps<{ signal: Operation }>();
</script>

<template>
  <div>
    <svg
      v-if="signal === Operation.BUY"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-trending-up h-6 w-6 text-green-600"
      aria-hidden="true"
    >
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </svg>
    <svg
      v-else-if="signal === Operation.SELL"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-trending-down h-6 w-6 text-red-600"
      aria-hidden="true"
    >
      <path d="M16 17h6v-6" />
      <path d="m22 17-8.5-8.5-5 5L2 7" />
    </svg>
    <svg
      v-else-if="signal === Operation.HOLD"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-minus h-6 w-6 text-yellow-600"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
    <span v-else>Неверный сигнал</span>
  </div>
</template>

<style scoped></style>
