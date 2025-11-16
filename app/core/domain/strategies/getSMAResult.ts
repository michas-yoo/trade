import type { TradeConfig } from '../config';
import { type Candles, getOnlyClosedCandles } from '../candle';
import { Operation, type Signal } from '../trade';
import { calculateSMA } from '../indicators/sma';

export function getSMAResult(candles: Candles, config: TradeConfig): Signal {
  const availableCandles = getOnlyClosedCandles(candles);

  const slowSMAs = calculateSMA(availableCandles, config.slowPeriod);
  const fastSMAs = calculateSMA(availableCandles, config.fastPeriod);

  if (!slowSMAs.length || !fastSMAs.length) {
    return { signal: Operation.HOLD, lastOperation: null };
  }

  const fastNow = fastSMAs.at(-1)?.value;
  const fastPrev = fastSMAs.at(-2)?.value;
  const slowNow = slowSMAs.at(-1)?.value;
  const slowPrev = slowSMAs.at(-2)?.value;

  if (!fastNow || !fastPrev || !slowNow || !slowPrev) {
    return { signal: Operation.HOLD, lastOperation: null };
  }

  const isCrossUp = fastNow > slowNow && fastPrev <= slowPrev;
  const isCrossDown = fastNow < slowNow && fastPrev >= slowPrev;

  if (isCrossUp) {
    return { signal: Operation.BUY, lastOperation: Operation.BUY };
  }

  if (isCrossDown) {
    return { signal: Operation.SELL, lastOperation: Operation.SELL };
  }

  if (fastNow > slowNow) return { signal: Operation.HOLD, lastOperation: Operation.BUY };
  if (fastNow < slowNow) return { signal: Operation.HOLD, lastOperation: Operation.SELL };

  return { signal: Operation.HOLD, lastOperation: null };
}
