import type { Strategy } from './strategies/strategy';

export type TradeConfig = {
  selectedStrategy: Strategy | null;
  fastPeriod: number;
  slowPeriod: number;
};

type InitialConfigParams = {
  fastPeriod?: number;
  slowPeriod?: number;
  selectedStrategy: Strategy | null;
};

export function createInitialConfig({
  fastPeriod = 5,
  slowPeriod = 15,
  selectedStrategy = null,
}: InitialConfigParams): TradeConfig {
  return {
    fastPeriod,
    slowPeriod,
    selectedStrategy,
  };
}
