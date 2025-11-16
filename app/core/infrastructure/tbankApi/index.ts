import type { Candles } from '~/core/domain/candle';
import type { MarketDataPort, MarketRequestParams } from '~/core/ports/MarketDataPort';
import type { TBankCandleResponse } from './tbankTypes';
import { mapTBankResponseToCandles } from './mapTBankResponseToCandles';

const ONE_HOUR = 3_600_000; // 1 час в миллисекундах
const DEFAULT_LIMIT = 150;

export class TBankApiAdapter implements MarketDataPort {
  private async getCandlesFromApi(params: MarketRequestParams): Promise<TBankCandleResponse> {
    return (await $fetch('/api/tbank/candles', {
      method: 'POST',
      body: {
        from: params.from || new Date(Date.now() - ONE_HOUR).toISOString(),
        to: params.to || new Date(Date.now()).toISOString(),
        instrumentId: params.tickerID,
        limit: params.amount || DEFAULT_LIMIT,
      },
    })) as TBankCandleResponse;
  }

  async getCandles(params: MarketRequestParams): Promise<Candles> {
    const rawCandles = await this.getCandlesFromApi(params);
    return mapTBankResponseToCandles(rawCandles);
  }
}
