<script setup lang="ts">
import type { CandlesGraph } from '~/core/infrastructure/apexcharts/graph';

const props = defineProps<{
  data: CandlesGraph;
}>();

const series = computed(() => [
  {
    name: 'candle',
    data: props.data || [],
  },
]);
</script>

<template>
  <ClientOnly>
    <CandlestickChart v-if="data?.length" :series="series" />
    <p v-else>Loading...</p>
  </ClientOnly>
</template>
