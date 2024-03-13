import User from "./user";

export interface GameProps {
    startGamemode: string;
    race: {
      racePuzzleFirst: string | null,
      racePuzzleStep: number | null,
      handlePuzzleDone: (success: boolean) => void
     }
    user: User | null;
  }