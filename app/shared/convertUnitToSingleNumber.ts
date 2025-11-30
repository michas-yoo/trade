import type { UnitData } from '~/core/infrastructure/tbankApi/tbankTypes';

export const convertUnitToSingleNumber = (units: UnitData) => Number(`${units.units}.${units.nano.toString().slice(0, 2)}`);
