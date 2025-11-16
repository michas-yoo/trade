import type { Candles } from '../domain/candle';
import type { TradeConfig } from '../domain/config';
import type { TradePrediction } from '../domain/trade';
import type { MarketDataPort, MarketRequestParams } from '../ports/MarketDataPort';
import { getSignalForCandles } from './getSignalForCandles';

export async function getSignalForParams(
  markerApi: MarketDataPort,
  params: MarketRequestParams,
  config: TradeConfig
): Promise<TradePrediction> {
  const candles: Candles = await markerApi.getCandles(params);
  return getSignalForCandles(candles, config);
}
