import type { TradePrediction } from '~/core/domain/trade';

export type CalculationResult = {
  figi: string;
  ticker: string;
  lastClosingPrice: number;
  signal: TradePrediction['signal']['signal'];
  lastOperation: TradePrediction['signal']['lastOperation'];
};
