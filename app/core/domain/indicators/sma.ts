import { type Candles, hasEnoughCandlesData } from '../candle';
import type { IndicatorSeries } from '~/core/domain/strategies/crossover';

export function calculateSMA(candles: Candles, period: number): IndicatorSeries {
  if (!hasEnoughCandlesData(candles, period)) {
    return [];
  }

  const smaValues: IndicatorSeries = [];

  for (let i = period - 1; i < candles.length; i++) {
    const slice = candles.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, cur) => acc + cur.close, 0);
    const sma = sum / period;
    smaValues.push({ time: candles?.[i]?.time || 0, value: sma });
  }

  return smaValues;
}
