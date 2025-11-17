import { type Candles, getOnlyClosedCandles } from '../domain/candle';
import type { TradeConfig } from '../domain/config';
import type { Signal } from '../domain/trade';
import { buildCrossoverSignal } from '../domain/strategies/crossover';
import { calculateEMA } from '../domain/indicators/ema';

export function getEMAResult(candles: Candles, config: TradeConfig): Signal {
  const availableCandles = getOnlyClosedCandles(candles);
  return buildCrossoverSignal(availableCandles, config, calculateEMA);
}
