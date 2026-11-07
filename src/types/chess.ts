export interface Move {
  san: string;
  comment?: string;
}

export interface Variation {
  id: string;
  name: string;
  moves: string[]; // Array of SAN moves
  side: 'white' | 'black';
}

export interface Opening {
  id: string;
  name: string;
  category: 'Open game' | 'Semi-open' | 'Closed game';
  description: string;
  variations: Variation[];
}

export interface SRSData {
  id: string; // variationId
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastAccuracy: number;
}

export type GameStatus = 'idle' | 'playing' | 'completed' | 'mistake';
