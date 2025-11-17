import { type Candles, getOnlyClosedCandles } from '../domain/candle';
import type { TradeConfig } from '../domain/config';
import type { Signal } from '../domain/trade';
import { buildCrossoverSignal } from '../domain/strategies/crossover';
import { calculateSMA } from '../domain/indicators/sma';

export function getSMAResult(candles: Candles, config: TradeConfig): Signal {
  const availableCandles = getOnlyClosedCandles(candles);
  return buildCrossoverSignal(availableCandles, config, calculateSMA);
}
