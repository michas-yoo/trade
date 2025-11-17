import { type Candle, type Candles, hasEnoughCandlesData } from '../candle';
import type { IndicatorPoint, IndicatorSeries } from '~/core/domain/strategies/crossover';
import { calculateSMA } from './sma';

const defaultEMA: IndicatorPoint = { time: 0, value: 1 };

export function calculateEMA(candles: Candles, period: number): IndicatorSeries {
  if (!hasEnoughCandlesData(candles, period)) {
    return [];
  }

  const ema: IndicatorSeries = [];
  const alpha = 2 / (period + 1);

  // Первое значение EMA = простое среднее за "period" свечей
  const sma = calculateSMA(candles, period).at(-1);
  if (sma) {
    ema.push(sma);
  }

  // Все последующие значения EMA
  for (let i = period - 1; i < candles.length; i++) {
    const prevEMA = ema[i - period + 1] || defaultEMA;
    const current = candles[i] as Candle;
    const nextEMA = alpha * current.close + (1 - alpha) * prevEMA.value;
    ema.push({ time: current.time, value: nextEMA });
  }

  return ema;
}
