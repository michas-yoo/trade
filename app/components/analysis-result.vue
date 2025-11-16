<script setup lang="ts">
import { Operation, type Signal } from '~/core/domain/trade';
import GraphIcon from '~/components/graph-icon.vue';

defineProps<{
  result: Signal;
  graphShown: boolean;
  daysSpan: number;
}>();

const emit = defineEmits(['toggle-graph']);
</script>

<template>
  <div class="card">
    <h3>Результат анализа</h3>

    <div class="result-block">
      <div class="flex items-center gap-3">
        <SignalIcon :signal="result.signal" />
        <div>
          <p class="text-sm text-slate-600">Сигнал</p>
          <ColoredOperation :operation="result.signal" />
        </div>
      </div>
    </div>

    <div
      v-if="result.signal === Operation.HOLD && result.lastOperation"
      class="result-block border-l-4 border-slate-300"
    >
      <div class="flex items-center gap-3">
        <SignalIcon :signal="result.lastOperation" />
        <div>
          <p class="text-sm text-slate-600">Последний сигнал</p>
          <ColoredOperation :operation="result.lastOperation" />
        </div>
      </div>
    </div>

    <div class="result-block">
      <div class="flex items-center gap-3">
        <GraphIcon />
        <div>
          <p class="text-sm text-slate-600">Данные по акции</p>
          <p class="text-slate-600">
            Информация за
            <template v-if="daysSpan > 0"> {{ daysSpan }} {{ pluralize(daysSpan, ['день', 'дня', 'дней']) }} </template>
            <template v-else>—</template>
          </p>
        </div>
      </div>

      <button type="button" @click="emit('toggle-graph')">{{ graphShown ? 'Скрыть' : 'Показать' }} график</button>
    </div>
  </div>
</template>

<style scoped>
.result-block {
  @apply flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-4;

  &:not(:first-child) {
    @apply mt-4;
  }
}
</style>
