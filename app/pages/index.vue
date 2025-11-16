<script setup lang="ts">
import type { Signal, TradePrediction } from '~/core/domain/trade';
import { type CandlesGraph, mapCandlesToApexCharts } from '~/core/infrastructure/apexcharts/graph';
import { MS_PER_DAY } from '~/shared/constants';

const result = ref<Signal | null>();
const errorMessage = ref<string>('');
const graphData = ref<CandlesGraph>([]);
const isGraphVisible = ref<boolean>(false);
const daysSpan = ref<number>(0);

const onLoading = () => {
  result.value = null;
  errorMessage.value = '';
  graphData.value = [];
  isGraphVisible.value = false;
  daysSpan.value = 0;
};

const onResult = (prediction: TradePrediction) => {
  const candles = prediction.candles || [];

  result.value = prediction.signal;
  graphData.value = mapCandlesToApexCharts(candles);

  if (!candles.length) {
    daysSpan.value = 0;
    return;
  }

  const first = candles[0]!.time;
  const last = candles[candles.length - 1]!.time;
  daysSpan.value = Math.max(1, Math.ceil(Math.abs(last - first) / MS_PER_DAY));
};

const onError = (message: string) => (errorMessage.value = message);

const onGraph = () => (isGraphVisible.value = !isGraphVisible.value);
</script>

<template>
  <div class="min-h-screen bg-gray-200 px-4 py-12">
    <div class="mx-auto flex max-w-2xl flex-col gap-5">
      <div class="mb-8 text-center">
        <h1 class="mb-2 text-xl font-medium text-slate-900">Анализатор акции</h1>
        <p class="text-slate-600">Проанализируйте показатель акции с помощью нужной стратегии</p>
      </div>

      <TradingForm @loading="onLoading" @submit="onResult" @error="onError" />

      <Transition name="fade">
        <div v-if="errorMessage" class="card">
          <h2 class="text-red-600">{{ errorMessage }}</h2>
        </div>
      </Transition>

      <Transition name="fade">
        <AnalysisResult
          v-if="result"
          :result="result"
          :graph-shown="isGraphVisible"
          :days-span="daysSpan"
          @toggle-graph="onGraph"
        />
      </Transition>

      <Transition name="fade">
        <div v-if="isGraphVisible" class="card">
          <CandlesGraph v-if="graphData.length" :data="graphData" />
          <p v-else>Нет данных для графика</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped></style>
