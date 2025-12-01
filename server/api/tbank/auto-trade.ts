import { Operation } from '~/core/domain/trade';
import { createInitialConfig } from '~/core/domain/config';
import { Strategy } from '~/core/domain/strategies/strategy';
import { TBankApiAdapter } from '~/core/infrastructure/tbankApi';
import type { TBankPortfolioResponse } from '~/core/infrastructure/tbankApi/tbankTypes';
import type { CalculationResult } from '~/shared/types';
import { calculateSignalForAllTickers } from '~/shared/calculateSignalForTickers';
import { AVAILABLE_TICKERS } from '~/shared/constants';

type QueueItem = CalculationResult & {
  success?: boolean;
};

async function runTrade(operation: Operation, figi: string, quantity: number) {
  return await $fetch('/api/tbank/trade', {
    method: 'POST',
    body: JSON.stringify({
      operation,
      figi,
      quantity,
    }),
  });
}

export default defineEventHandler(async () => {
  let portfolio: TBankPortfolioResponse = await $fetch('/api/tbank/portfolio');
  const config = createInitialConfig({ selectedStrategy: Strategy.EMA });
  const tBankApi = new TBankApiAdapter();

  const calculationResults: CalculationResult[] = await calculateSignalForAllTickers(
    config,
    tBankApi,
    AVAILABLE_TICKERS
  );

  const buyQueue: QueueItem[] = [];
  const sellQueue: QueueItem[] = [];

  for (let stock of calculationResults) {
    if (
      stock.signal === Operation.SELL ||
      (stock.signal === Operation.HOLD && stock.lastOperation === Operation.SELL)
    ) {
      sellQueue.push(stock);
    }

    if (stock.signal === Operation.BUY || (stock.signal === Operation.HOLD && stock.lastOperation === Operation.BUY)) {
      buyQueue.push(stock);
    }
  }

  for await (const sell of sellQueue) {
    const stockInfo = portfolio.stocks.find((stock) => stock.ticker === sell.ticker);

    if (!stockInfo) continue;

    await runTrade(Operation.SELL, stockInfo.figi, stockInfo.quantity);
    portfolio = await $fetch('/api/tbank/portfolio');
  }

  if (!buyQueue.length) return;

  const sortedByPriceDesc = buyQueue.toSorted((a, b) => b.lastClosingPrice - a.lastClosingPrice);
  for await (const buy of sortedByPriceDesc) {
    const amount = Math.floor(portfolio.cash / buy.lastClosingPrice);

    if (amount <= 0) {
      buy.success = false;
      continue;
    }

    await runTrade(Operation.BUY, buy.figi, amount);
    buy.success = true;
    portfolio = await $fetch('/api/tbank/portfolio');
  }

  return { portfolio, buyQueue, sellQueue };
});
