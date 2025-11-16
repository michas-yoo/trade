import type { Candles } from '~/core/domain/candle';

export type CandlesGraph = Array<Array<number>>;

export function mapCandlesToApexCharts(candles: Candles): CandlesGraph {
  return candles.map((candle) => [candle.time, candle.open, candle.high, candle.low, candle.close]);
}
