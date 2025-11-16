<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps<{
  series: Array<{
    name: string;
    data: Array<Array<number>>;
  }>;
  options?: any;
  width?: string;
}>();

const options = {
  ...props.options,
  id: `-candlestick-chart-${Math.random().toString(36).substring(7)}`,
  xaxis: {
    type: 'datetime',
    categories: props.series[0]?.data?.map?.((el) => new Date(el[0] as number).toLocaleDateString('ru-RU')) || [],
  },
  tooltip: {
    x: {
      formatter: function (_: number, { dataPointIndex }: any) {
        if (!props.series || !props.series[0]) return;
        const pointData = new Date(props.series[0].data[dataPointIndex]?.[0] || 0);
        return `${pointData.toLocaleDateString('ru-RU')}, ${pointData.toLocaleTimeString('ru-RU')}`;
      },
    },
  },
};

const DEFAULT_WIDTH = '100%';
const DEFAULT_HEIGHT = '500';
</script>

<template>
  <VueApexCharts
    :options="options"
    type="candlestick"
    :width="width || DEFAULT_WIDTH"
    :height="DEFAULT_HEIGHT"
    :series="series"
  />
</template>
