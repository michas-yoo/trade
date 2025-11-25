import { TBankApiAdapter } from '~/core/infrastructure/tbankApi';
import { createInitialConfig, TradeConfig } from '~/core/domain/config';
import { Strategy } from '~/core/domain/strategies/strategy';
import { AVAILABLE_TICKERS, MS_PER_WEEK } from '~/shared/constants';
import { getSignalForParams } from '~/core/application/getSignalForParams';
import { Operation, type TradePrediction } from '~/core/domain/trade';

type CalculationResult = {
  ticker: string;
  signal: TradePrediction['signal']['signal'];
  lastOperation: TradePrediction['signal']['lastOperation'];
};

async function calculateSignalForAllTickers(config: TradeConfig): Promise<CalculationResult[]> {
  const tBankApi = new TBankApiAdapter();
  const result: CalculationResult[] = [];

  for await (let ticker of AVAILABLE_TICKERS) {
    const signal = await getSignalForParams(
      tBankApi,
      {
        tickerID: ticker.figi,
        from: new Date(Date.now() - MS_PER_WEEK).toISOString(),
      },
      config
    );

    result.push({ ticker: ticker.ticker, ...signal.signal });
  }

  return result;
}

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

export default defineEventHandler(async (event) => {
  const config = createInitialConfig({ selectedStrategy: Strategy.EMA });

  const calculationResults: CalculationResult[] = await calculateSignalForAllTickers(config);
  const message = generateMessage(calculationResults);

  return $fetch('/api/telegram/send-message', {
    method: 'POST',
    body: JSON.stringify({ text: message }),
  });
});
