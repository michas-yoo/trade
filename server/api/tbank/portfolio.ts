import { convertUnitToSingleNumber } from '~/shared/convertUnitToSingleNumber';
import type { TBankPortfolioResponse, TBankPortfolioStock, UnitData } from '~/core/infrastructure/tbankApi/tbankTypes';

enum PortfolioInstrumentType {
  STOCK = 'stock',
  CURRENCY = 'currency',
}

type PortfolioQuantityWithCurrency = UnitData & {
  currency: string;
};

// Неполный тип, тут только нужные поля
type PortfolioPosition = {
  figi: string;
  ticker: string;
  instrumentType: PortfolioInstrumentType;
  quantity: UnitData;
  currentPrice: PortfolioQuantityWithCurrency;
};

type TBankPortfolio = {
  totalAmountCurrencies: PortfolioQuantityWithCurrency;
  positions: PortfolioPosition[];
};

async function fetchPortfolio(url: string, tBankToken: string, tBankAccountId: string): Promise<TBankPortfolio> {
  return await $fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      accountId: tBankAccountId,
      currency: 'RUB',
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tBankToken}`,
    }),
  });
}

export default defineEventHandler(async (): Promise<TBankPortfolioResponse> => {
  const { isSandboxMode, tBankApiURL, tBankApiURLSandbox, tBankToken, tBankAccountId } = useRuntimeConfig();

  const url = isSandboxMode
    ? `${tBankApiURLSandbox}.SandboxService/GetSandboxPortfolio`
    : `${tBankApiURL}.OperationsService/GetPortfolio`;
  const portfolio = await fetchPortfolio(url, tBankToken, tBankAccountId);

  return {
    cash: convertUnitToSingleNumber(portfolio.totalAmountCurrencies),
    stocks: portfolio.positions.reduce((acc: TBankPortfolioStock[], cur: PortfolioPosition): TBankPortfolioStock[] => {
      if (cur.instrumentType === PortfolioInstrumentType.CURRENCY) return acc;

      acc.push({
        ticker: cur.ticker,
        figi: cur.figi,
        quantity: convertUnitToSingleNumber(cur.quantity),
        price: convertUnitToSingleNumber(cur.currentPrice),
      });

      return acc;
    }, []),
  };
});
