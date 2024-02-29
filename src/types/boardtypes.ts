type MoveWithPromotion=`${string}${number}${string}${number}${string}`;
type MoveWithoutPromotion= `${string}${number}${string}${number}`;

export type Move = MoveWithPromotion | MoveWithoutPromotion;

export type Cell = `${string}${number}`;

export interface Puzzle {
  id: string;
  table: string;
  firstMove: Move;
  rating: number;
  popularity: number;
}
