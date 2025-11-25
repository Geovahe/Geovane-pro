import { LotteryType, LotteryConfig } from './types';

export const LOTTERIES: Record<LotteryType, LotteryConfig> = {
  [LotteryType.MEGA_SENA]: {
    id: LotteryType.MEGA_SENA,
    name: 'Mega-Sena',
    minNumber: 1,
    maxNumber: 60,
    drawCount: 6,
    color: 'bg-emerald-600',
  },
  [LotteryType.LOTOFACIL]: {
    id: LotteryType.LOTOFACIL,
    name: 'Lotofácil',
    minNumber: 1,
    maxNumber: 25,
    drawCount: 15,
    color: 'bg-purple-600',
  },
  [LotteryType.QUINA]: {
    id: LotteryType.QUINA,
    name: 'Quina',
    minNumber: 1,
    maxNumber: 80,
    drawCount: 5,
    color: 'bg-blue-600',
  },
  [LotteryType.LOTOMANIA]: {
    id: LotteryType.LOTOMANIA,
    name: 'Lotomania',
    minNumber: 0,
    maxNumber: 99,
    drawCount: 20, // Usually people choose 50, drawn 20. We will simulate drawn count for suggestions.
    color: 'bg-orange-500',
  },
  [LotteryType.TIMEMANIA]: {
    id: LotteryType.TIMEMANIA,
    name: 'Timemania',
    minNumber: 1,
    maxNumber: 80,
    drawCount: 10,
    color: 'bg-yellow-500',
  },
  [LotteryType.DIA_DE_SORTE]: {
    id: LotteryType.DIA_DE_SORTE,
    name: 'Dia de Sorte',
    minNumber: 1,
    maxNumber: 31,
    drawCount: 7,
    color: 'bg-amber-700',
  },
};
