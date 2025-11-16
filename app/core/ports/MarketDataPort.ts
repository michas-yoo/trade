import type { Candles } from '../domain/candle';

export type MarketRequestParams = {
  tickerID: string;
  from?: string;
  to?: string;
  amount?: number;
};

export interface MarketDataPort {
  getCandles(params: MarketRequestParams): Promise<Candles>;
}
