import { useState } from "react";

import Board from "./Board";
import checkIcon from "../../assets/check-icon.svg";
import Casual from "./gametypes/Casual";
import Rush from "./gametypes/Rush";

import { Cell, Move, Puzzle } from '../../types/boardtypes';


function Game() {
  const [moveCount, setMoveCount] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [diableClick, setDisableClick] = useState<boolean>(false);
  const [isShowCompleteIndicator, setIsShowCompleteIndicator] =
    useState<boolean>(false);
  const [isHomeScreen, setIsHomeScreen] = useState<boolean>(true);
  const [hint, setHint] = useState<Cell | null>(null);

  const [newMoveByBoard, setNewMoveByBoard] = useState<Move | null>(null);

  const [isRush, setIsRush] = useState<boolean>(false);
  const [currentMaxDifficulty, setCurrentMaxDifficulty] = useState<number>(550);
  const [currentMinDifficulty, setCurrentMinDifficulty] = useState<number>(399);
  const [puzzleResults, setPuzzleResults] = useState<boolean[]>([]);

  async function handlePlayerMove(
    move: Move,
    moveCount: number
  ): Promise<boolean> {
    setDisableClick(true);
    const response = await fetch(
      `/api/puzzle/valid/${puzzle!.id}/${move}/${moveCount}`
    );
    const result = await response.text();
    setDisableClick(false);

    if (result === "win") {
      getRandomPuzzle();
      showCompleteIndicator();
      setPuzzleResults((prev) => [...prev, true]);
      return true;
    } else if (!result) {
      setPuzzleResults((prev) => [...prev, false]);
      return false;
    }
    setNewMoveByBoard(result as Move);
    return true;
  }

  async function getRandomPuzzle() {
    const response = await fetch(`/api/puzzle`);
    const result = await response.json();
    setPuzzle(result);
    setTimeout(() => {
      setNewMoveByBoard(result.firstMove);
    }, 0);
  }

  async function getPuzzleByRating() {
    const sentRequestAt = Date.now();
    const response = await fetch(
      `/api/puzzle?min=${currentMinDifficulty}&max=${currentMaxDifficulty}`
    );
    const result = await response.json();

    setPuzzle(result);
    if (Date.now() - sentRequestAt < 200) {
      setTimeout(() => {
        setNewMoveByBoard(result.firstMove);
      }, 500);
    } else {
      setTimeout(() => {
        setNewMoveByBoard(result.firstMove);
      }, 0);
    }
  }

  async function showHint(moveCount: number) {
    const response = await fetch(`/api/puzzle/hint/${puzzle!.id}/${moveCount}`);
    const result = await response.text();
    console.log(result);
    const hint = result as Cell;
    setHint(convertHint(hint));
  }
  function convertHint(hint: Cell): Cell {
    const letterToNumMap: { [key: string]: number } = {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
      e: 4,
      f: 5,
      g: 6,
      h: 7,
    };

    const row = Number(hint.charAt(1));
    const column = hint.charAt(0);
    const numColumn = letterToNumMap[column];

    return `${Math.abs(row - 8).toString()}${numColumn}`;
  }

  function showCompleteIndicator() {
    setIsShowCompleteIndicator(true);
    setTimeout(() => setIsShowCompleteIndicator(false), 600);
  }

  function startRace() {
    setIsRush(true);
    setIsHomeScreen(false);
    getRandomPuzzle();
  }

  /*function changeMaxMinDifficulty(max: number, min: number) {
    setCurrentMaxDifficulty(max);
    setCurrentMinDifficulty(min);
    getRandomPuzzle();
  }*/

  return (
    <div className="Game">
      <Board
        newMoveByBoard={newMoveByBoard}
        handlePlayerMove={handlePlayerMove}
        newBoard={puzzle && puzzle.table.split(" ")[0]}
        moveCount={moveCount}
        setMoveCount={setMoveCount}
        hint={hint}
      />
      {isHomeScreen ? (
        <>
          <div className="blur"></div>
          <button
            className="play-btn"
            onClick={() => {
              getRandomPuzzle(), setIsHomeScreen(false);
            }}
          >
            Start playing!
          </button>
          <button className="race-btn" onClick={() => startRace()}>
            Puzzle Rush!
          </button>
        </>
      ) : (
        <>
          {!isRush ? (
            <Casual
              getRandomPuzzle={getRandomPuzzle}
              setDisableClick={(disableValue) => setDisableClick(disableValue)}
              showHint={() => showHint(moveCount)}
              onHintReset={() => setHint(null)}
            />
          ) : (
            <Rush
              disableClick={() => setDisableClick(true)}
              getPuzzle={getPuzzleByRating}
              puzzleResults={puzzleResults}
              changePuzzle={(newPuzzle) => setPuzzle(newPuzzle)}
              changeMoveByBoard={(firstMove) => setNewMoveByBoard(firstMove)}
              setIsHomeScreen={(value) => setIsHomeScreen(value)}
            />
          )}
        </>
      )}
      {diableClick && <div className="disabler"></div>}
      <div
        className="complete-indicator"
        style={{ top: isShowCompleteIndicator ? "5vh" : "-26vh" }}
      >
        <img src={checkIcon} />
      </div>
    </div>
  );
}

export default Game;
