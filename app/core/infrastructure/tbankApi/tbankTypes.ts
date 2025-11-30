export type UnitData = {
  units: string;
  nano: number;
};

export type TBankCandleDTO = {
  open: UnitData;
  high: UnitData;
  low: UnitData;
  close: UnitData;
  volume: string;
  time: string;
  isComplete: boolean;
  candleSource: string;
};

export type TBankCandleResponse = {
  candles: TBankCandleDTO[];
};

export type TBankPortfolioStock = {
  ticker: string;
  figi: string;
  quantity: number;
  price: number;
};

export type TBankPortfolioResponse = {
  cash: number;
  stocks: TBankPortfolioStock[];
};
