export enum LotteryType {
  MEGA_SENA = 'Mega-Sena',
  LOTOFACIL = 'Lotofácil',
  QUINA = 'Quina',
  LOTOMANIA = 'Lotomania',
  TIMEMANIA = 'Timemania',
  DIA_DE_SORTE = 'Dia de Sorte'
}

export interface LotteryConfig {
  id: LotteryType;
  name: string;
  minNumber: number;
  maxNumber: number;
  drawCount: number; // How many numbers are drawn
  color: string;
}

export interface GeneratedGame {
  id: string;
  numbers: number[];
  strategy: string; // e.g., "Hot Numbers", "Random", "Gemini AI"
  createdAt: number;
  lotteryType: LotteryType;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AIAnalysisResult {
  text: string;
  suggestedGames: number[][];
  sources: GroundingSource[];
}

export interface StatPoint {
  number: number;
  frequency: number;
}
