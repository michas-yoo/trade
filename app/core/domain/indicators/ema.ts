import { type Candle, type Candles, hasEnoughCandlesData } from '../candle';
import { calculateSMA } from './sma';

export type ExponentialMovingAverage = {
  time: number;
  value: number;
};

const defaultEMA: ExponentialMovingAverage = { time: 0, value: 1 };

export function calculateEMA(candles: Candles, period: number): ExponentialMovingAverage[] {
  if (!hasEnoughCandlesData(candles, period)) {
    return [];
  }

  const ema: ExponentialMovingAverage[] = [];
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
