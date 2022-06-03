import type { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

const ONE_BILLION = 1000000000;

export const parseBalance = (
  value: BigNumberish,
  decimals = 18,
  decimalsToDisplay = 8
) => Number(formatUnits(value, decimals)).toFixed(decimalsToDisplay);
