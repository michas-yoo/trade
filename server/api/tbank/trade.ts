import { Operation } from '~/core/domain/trade';

type TBankTradeRequestParams = {
  quantity: number;
  operation: Operation;
  figi: string;
};

const getDirection = (operation: Operation) => {
  if (operation === Operation.BUY) return 'ORDER_DIRECTION_BUY';
  return 'ORDER_DIRECTION_SELL';
};

export default defineEventHandler(async (event) => {
  const { tBankToken, tBankApiURL, tBankAccountId, isSandboxMode } = useRuntimeConfig();
  const requestBody: TBankTradeRequestParams = await readBody(event);

  const url = isSandboxMode ? 'SandboxService/PostSandboxOrder' : 'OrdersService/PostOrder';

  return await $fetch(`${tBankApiURL}.${url}`, {
    method: 'POST',
    body: JSON.stringify({
      quantity: String(requestBody.quantity),
      direction: getDirection(requestBody.operation),
      accountId: tBankAccountId,
      instrumentId: requestBody.figi,
      // Случайный ID для операции
      orderId: crypto.randomUUID(),
      // Покупаем автоматически по Рыночной цене
      price: {
        nano: 0,
        units: 0,
      },
      orderType: 'ORDER_TYPE_MARKET',
      timeInForce: 'TIME_IN_FORCE_UNSPECIFIED',
      priceType: 'PRICE_TYPE_CURRENCY',
      confirmMarginTrade: false,
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tBankToken}`,
    }),
  });
});
