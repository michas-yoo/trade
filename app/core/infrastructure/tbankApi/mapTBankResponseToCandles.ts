import type { TBankCandleResponse, UnitData } from './tbankTypes';
import type { Candles } from '~/core/domain/candle';

const convertUnitToSingleNumber = (units: UnitData) => Number(`${units.units}.${units.nano.toString().slice(0, 2)}`);

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
