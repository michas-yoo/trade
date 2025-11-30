import type { CalculationResult } from '~/shared/types';
import type { MarketDataPort } from '~/core/ports/MarketDataPort';
import type { TradeConfig } from '~/core/domain/config';
import { MS_PER_WEEK } from '~/shared/constants';
import { getSignalForParams } from '~/core/application/getSignalForParams';

export async function calculateSignalForAllTickers(
  config: TradeConfig,
  markerApi: MarketDataPort,
  tickers: { figi: string; ticker: string }[]
): Promise<CalculationResult[]> {
  const result: CalculationResult[] = [];

  for await (let ticker of tickers) {
    const signal = await getSignalForParams(
      markerApi,
      {
        tickerID: ticker.figi,
        from: new Date(Date.now() - MS_PER_WEEK).toISOString(),
      },
      config
    );

    result.push({
      figi: ticker.figi,
      ticker: ticker.ticker,
      lastClosingPrice: signal.candles.at(-1)?.close || 0,
      ...signal.signal,
    });
  }

  return result;
}
