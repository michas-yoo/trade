import { MS_PER_WEEK } from '~/shared/constants';

type PossibleInterval = 'CANDLE_INTERVAL_HOUR' | 'CANDLE_INTERVAL_4_HOUR';

function getRequestInterval(from: Date, to: Date): PossibleInterval {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  let interval: PossibleInterval = 'CANDLE_INTERVAL_HOUR';

  if (!Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime())) {
    const diffMs = toDate.getTime() - fromDate.getTime();

    if (diffMs > MS_PER_WEEK) {
      interval = 'CANDLE_INTERVAL_4_HOUR';
    }
  }

  return interval;
}

export default defineEventHandler(async (event) => {
  const { tBankToken, tBankApiURL } = useRuntimeConfig();

  const requestBody = await readBody(event);
  const interval = getRequestInterval(requestBody.from, requestBody.to);

  return await $fetch(`${tBankApiURL}.MarketDataService/GetCandles`, {
    method: 'POST',
    body: JSON.stringify({
      ...requestBody,
      interval,
      candleSourceType: 'CANDLE_SOURCE_UNSPECIFIED',
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tBankToken}`,
    }),
  });
});
