import type { TBankCandleResponse } from './tbankTypes';
import type { Candles } from '~/core/domain/candle';
import { convertUnitToSingleNumber } from '~/shared/convertUnitToSingleNumber';

export function mapTBankResponseToCandles(response: TBankCandleResponse): Candles {
  return response.candles.map((candle) => ({
    open: convertUnitToSingleNumber(candle.open),
    high: convertUnitToSingleNumber(candle.high),
    low: convertUnitToSingleNumber(candle.low),
    close: convertUnitToSingleNumber(candle.close),
    volume: Number(candle.volume),
    time: new Date(candle.time).getTime(),
  }));
}
