import type { Signal, TradePrediction } from '../domain/trade';
import type { Candles } from '../domain/candle';
import type { TradeConfig } from '../domain/config';
import { Strategy } from '../domain/strategies/strategy';
import { getSMAResult } from './getSMAResult';
import { getEMAResult } from './getEMAResult';

export function getSignalForCandles(candles: Candles, config: TradeConfig): TradePrediction {
  let signal: Signal;

  switch (config.selectedStrategy) {
    case Strategy.SMA:
      signal = getSMAResult(candles, config);
      break;
    case Strategy.EMA:
      signal = getEMAResult(candles, config);
      break;
    default:
      throw new Error(`Unknown strategy: ${config.selectedStrategy}`);
  }

  return { signal, candles };
}
