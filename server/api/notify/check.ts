import { TBankApiAdapter } from '~/core/infrastructure/tbankApi';
import { createInitialConfig } from '~/core/domain/config';
import { Strategy } from '~/core/domain/strategies/strategy';
import { AVAILABLE_TICKERS } from '~/shared/constants';
import { Operation } from '~/core/domain/trade';
import type { CalculationResult } from '~/shared/types';
import { calculateSignalForAllTickers } from '~/shared/calculateSignalForTickers';

function getEmojiFromSignal(signal: Operation | null) {
  let emoji = '🤨';

  if (signal === Operation.BUY) {
    emoji = '🚀';
  } else if (signal === Operation.SELL) {
    emoji = '📉';
  }

  return emoji;
}

function generateMessage(results: CalculationResult[]): string {
  const result: string[] = [new Date().toLocaleString('ru-RU'), ''];

  for (let { ticker, signal, lastOperation } of results) {
    const current = `${signal} ${getEmojiFromSignal(signal)}`;
    const last = `${lastOperation ? `(last: ${lastOperation} ${getEmojiFromSignal(lastOperation)})` : ''}`;
    result.push(`${ticker}: ${current} ${last}`);
  }

  return result.join('\n');
}

export default defineEventHandler(async () => {
  const config = createInitialConfig({ selectedStrategy: Strategy.EMA });
  const tBankApi = new TBankApiAdapter();

  const calculationResults: CalculationResult[] = await calculateSignalForAllTickers(
    config,
    tBankApi,
    AVAILABLE_TICKERS
  );
  const message = generateMessage(calculationResults);

  return $fetch('/api/telegram/send-message', {
    method: 'POST',
    body: JSON.stringify({ text: message }),
  });
});
