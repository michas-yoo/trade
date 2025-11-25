<script setup lang="ts">
import type { TradePrediction } from '~/core/domain/trade';
import { TBankApiAdapter } from '~/core/infrastructure/tbankApi';
import { getSignalForParams } from '~/core/application/getSignalForParams';
import { createInitialConfig } from '~/core/domain/config';
import { Strategy } from '~/core/domain/strategies/strategy';
import { AVAILABLE_TICKERS, MS_PER_WEEK, STRATEGIES } from '~/shared/constants';
import MultiToggle from '~/components/multi-toggle.vue';

const emit = defineEmits<{
  (name: 'submit', value: TradePrediction): void;
  (name: 'error', value: string): void;
  (name: 'loading'): void;
}>();

const isLoading = ref(false);
const from = ref(new Date(new Date().getTime() - MS_PER_WEEK).toISOString().slice(0, 16));
const currentTicker = ref(AVAILABLE_TICKERS[0]!.figi);
const currentStrategy = ref<Strategy>(STRATEGIES[0]!.value);

const tBankApi = new TBankApiAdapter();
const config = createInitialConfig({ selectedStrategy: currentStrategy.value });

async function runLogic() {
  isLoading.value = true;
  emit('loading');

  config.selectedStrategy = currentStrategy.value;

  const prediction = await getSignalForParams(
    tBankApi,
    {
      tickerID: currentTicker.value,
      from: new Date(from.value).toISOString(),
    },
    config
  );

  isLoading.value = false;
  emit('submit', prediction);
}

function setDateTime(weeks = 1) {
  const now = new Date();
  from.value = new Date(now.getTime() - MS_PER_WEEK * weeks).toISOString().slice(0, 16);
}
</script>

<template>
  <main>
    <form action="#" @submit.prevent="runLogic" class="card">
      <h3>Параметры анализа</h3>
      <div class="form-field">
        <label for="ticker">Выберите акцию</label>
        <select name="ticker" id="ticker" v-model="currentTicker">
          <option v-for="ticker in AVAILABLE_TICKERS" :key="ticker.figi" :value="ticker.figi">
            {{ ticker.ticker }}
          </option>
        </select>
      </div>
      <div class="form-field">
        <label for="from">С какого числа достать данные</label>
        <div class="flex items-center gap-2 max-sm:flex-wrap">
          <input type="datetime-local" name="from" id="from" v-model="from" />

          <multi-toggle
            :options="[
              { name: 'За неделю', callback: () => setDateTime(1) },
              { name: 'За две', callback: () => setDateTime(2) },
              { name: 'За четыре', callback: () => setDateTime(4) },
            ]"
          />
        </div>
      </div>

      <div class="form-field">
        <label for="strategy">По какой стратегии работать</label>
        <select name="strategy" id="strategy">
          <option v-for="strategy in STRATEGIES" :key="strategy.value" :value="strategy.value">
            {{ strategy.name }}
          </option>
        </select>
      </div>
      <button
        class="text-primary-foreground h-9 w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85"
      >
        {{ isLoading ? 'Рассчитываю...' : 'Получить результат' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.form-field {
  @apply mb-4 flex flex-col gap-2;

  label {
    @apply font-medium;
  }

  select,
  input {
    @apply block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm;
  }
}
</style>
