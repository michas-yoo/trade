export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: number;
};

export type Candles = Candle[];

export function hasEnoughCandlesData(candles: Candles, amount: number): boolean {
  return candles.length >= amount;
}

export function getOnlyClosedCandles(candles: Candles): Candles {
  return candles.filter((candle) => candle.close && candle.close > 0);
}
