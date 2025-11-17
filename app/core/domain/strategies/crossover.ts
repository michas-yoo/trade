import type { Candles } from '~/core/domain/candle';
import { Operation, type Signal } from '~/core/domain/trade';
import type { TradeConfig } from '~/core/domain/config';

export type IndicatorPoint = { time: number, value: number };
export type IndicatorSeries = IndicatorPoint[];
export type IndicatorCalculator = (candles: Candles, period: number) => IndicatorSeries;

/**
 * Функция отдает команду и последнюю операцию в зависимости от пересечения индикаторов.
 * Это используется для MA (Moving Average) стратегий, сравнивается последнее и предпоследнее значение.
 */
function getCrossoverSignal(fast: IndicatorSeries, slow: IndicatorSeries): Signal {
  if (!fast.length || !slow.length) {
    return { signal: Operation.HOLD, lastOperation: null };
  }

  const fastNow = fast.at(-1)?.value;
  const fastPrev = fast.at(-2)?.value;
  const slowNow = slow.at(-1)?.value;
  const slowPrev = slow.at(-2)?.value;

  if (fastNow === undefined || fastPrev === undefined || slowNow === undefined || slowPrev === undefined) {
    return { signal: Operation.HOLD, lastOperation: null };
  }

  const isCrossUp = fastNow > slowNow && fastPrev <= slowPrev;
  const isCrossDown = fastNow < slowNow && fastPrev >= slowPrev;

  if (isCrossUp) return { signal: Operation.BUY, lastOperation: Operation.BUY };
  if (isCrossDown) return { signal: Operation.SELL, lastOperation: Operation.SELL };

  if (fastNow > slowNow) return { signal: Operation.HOLD, lastOperation: Operation.BUY };
  if (fastNow < slowNow) return { signal: Operation.HOLD, lastOperation: Operation.SELL };

  return { signal: Operation.HOLD, lastOperation: null };
}

export function buildCrossoverSignal(
  candles: Candles,
  config: TradeConfig,
  calculate: IndicatorCalculator
): Signal {
  const fast = calculate(candles, config.fastPeriod);
  const slow = calculate(candles, config.slowPeriod);
  return getCrossoverSignal(fast, slow);
}
