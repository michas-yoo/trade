import { Strategy } from '~/core/domain/strategies/strategy';

export const MS_PER_DAY = 86_400_000;

export const MS_PER_WEEK = 604_800_000;

export const STRATEGIES = [
  {
    name: 'SMA',
    value: Strategy.SMA,
  },
  {
    name: 'EMA',
    value: Strategy.EMA,
  },
];

export const AVAILABLE_TICKERS = [
  {
    figi: 'TCS80A107UL4',
    ticker: 'T',
  },
  {
    figi: 'TCS03A108X38',
    ticker: 'X5',
  },
  {
    figi: 'TCS00A106YF0',
    ticker: 'VKCO',
  },
  {
    figi: 'TCS00A10ANA1',
    ticker: 'CNRU',
  },
];
