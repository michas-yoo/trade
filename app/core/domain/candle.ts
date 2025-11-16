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

export function getLatestClosedCandle(candles: Candles): Candle | null {
  return candles.at(-1) || null;
}

export function getNextOpenCandle(candles: Candles, candleTime: number): Candle | null {
  return candles.find((candle) => candle.time > candleTime) || null;
}

export function findNextOpenCandle(candles: Candles, candleTime: number): Candle | null {
  return candles.find((candle) => candle.time > candleTime) || null;
}
