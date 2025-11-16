<script setup lang="ts">
import { Operation } from '~/core/domain/trade';

defineProps<{
  operation: Operation;
}>();
</script>

<template>
  <p
    class="text-2xl font-semibold uppercase"
    :class="{
      'text-green-600': operation === Operation.BUY,
      'text-red-600': operation === Operation.SELL,
      'text-yellow-600': operation === Operation.HOLD,
    }"
  >
    {{ operation }}
  </p>
</template>

<style scoped></style>
