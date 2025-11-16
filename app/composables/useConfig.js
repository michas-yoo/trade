import { Strategy } from '~/core/domain/strategies/strategy.ts';

export function useConfig() {
  const strategies = [
    {
      name: 'SMA',
      value: Strategy.SMA,
    },
    {
      name: 'EMA',
      value: Strategy.EMA,
    },
  ];

  const availableTickers = [
    {
      figi: 'TCS00A106YF0',
      ticker: 'VKCO',
    },
    {
      figi: 'TCS80A107UL4',
      ticker: 'T',
    },
    {
      figi: 'TCS03A108X38',
      ticker: 'X5',
    },
    {
      figi: 'TCS00A10ANA1',
      ticker: 'CNRU',
    },
  ];

  return { strategies, availableTickers };
}
