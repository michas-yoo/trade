import { type Candles, hasEnoughCandlesData } from '../candle';

export type SimpleMovingAverage = {
  time: number;
  value: number;
};

export function calculateSMA(candles: Candles, period: number): SimpleMovingAverage[] {
  if (!hasEnoughCandlesData(candles, period)) {
    return [];
  }

  const smaValues: SimpleMovingAverage[] = [];

  for (let i = period - 1; i < candles.length; i++) {
    const slice = candles.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, cur) => acc + cur.close, 0);
    const sma = sum / period;
    smaValues.push({ time: candles?.[i]?.time || 0, value: sma });
  }

  return smaValues;
}
