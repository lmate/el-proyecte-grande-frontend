
export type Move = `${string}${number}${string}${number}`;

export type Cell = `${string}${number}`;

export interface Puzzle {
  id: string;
  table: string;
  firstMove: Move;
  rating: number;
  popularity: number;
}
