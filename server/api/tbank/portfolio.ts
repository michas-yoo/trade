import { convertUnitToSingleNumber } from '~/shared/convertUnitToSingleNumber';
import type { TBankPortfolioResponse, TBankPortfolioStock, UnitData } from '~/core/infrastructure/tbankApi/tbankTypes';

type PortfolioInstrumentType = 'stock' | 'currency';

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

async function fetchPortfolio(): Promise<TBankPortfolio> {
  const { tBankApiURL, tBankToken, tBankAccountId } = useRuntimeConfig();

  return await $fetch(`${tBankApiURL}.SandboxService/GetSandboxPortfolio`, {
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
  const portfolio = await fetchPortfolio();

  return {
    cash: convertUnitToSingleNumber(portfolio.totalAmountCurrencies),
    stocks: portfolio.positions.reduce((acc: TBankPortfolioStock[], cur: PortfolioPosition): TBankPortfolioStock[] => {
      if (cur.instrumentType === 'stock') return acc;

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
