import type { Candles } from './candle';

export enum Operation {
  HOLD = 'hold',
  BUY = 'buy',
  SELL = 'sell',
}

export type Signal = {
  signal: Operation;
  lastOperation: Operation | null;
};

export type TradePrediction = {
  signal: Signal;
  candles: Candles;
};
