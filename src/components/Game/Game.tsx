import { useEffect, useState } from "react";
import Board from "./Board";
import Casual from "./gametypes/Casual";
import Rush from "./gametypes/Rush";

import { Cell, Move, Puzzle } from '../../types/boardtypes';
import { GameProps } from "../../types/gameprops";

import checkIcon from "../../assets/check-icon.svg"







function Game({ startGamemode, race, user }: GameProps): JSX.Element {
  const [moveCount, setMoveCount] = useState<number>(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [disableClick, setDisableClick] = useState<boolean>(false);
  const [isShowCompleteIndicator, setIsShowCompleteIndicator] = useState<boolean>(false);
  const [isHomeScreen, setIsHomeScreen] = useState<boolean>(true);

  const [hint, setHint] = useState<Cell | null >(null);
  
  const [newMoveByBoard, setNewMoveByBoard] = useState<Move | null>(null);
  const [isRush, setIsRush] = useState<boolean>(false);
  const [isRace, setIsRace] = useState<boolean>(false);
  const [isCasual, setIsCasual] = useState<boolean>(false);
  const [currentMaxDifficulty, setCurrentMaxDifficulty] = useState<number>(0);
  const [currentMinDifficulty, setCurrentMinDifficulty] = useState<number>(0);
  const [puzzleResults, setPuzzleResults] = useState<boolean[]>([]);
  const [isTimerOver, setIsTimerOver] = useState<boolean>(false);
  useEffect(() => {
    setCurrentMaxDifficulty(550);
    setCurrentMinDifficulty(399);
  },[])
   useEffect(() => {
    if (startGamemode === 'Race') {
      startRace();
    } else if (startGamemode === 'Rush') {
      startRush();
    } else if (startGamemode === 'Casual') {
      startCasual();
    }
  }, [startGamemode]);
  
  useEffect(() => {
    if (isRace) {
      getNextPuzzleForRace();
      race.handlePuzzleDone(puzzleResults[puzzleResults.length - 1]);
    }
  }, [puzzleResults]); 


  /* async function uploadSolvedPuzzle() {
    if (!user) return;
    await fetch(`/api/user/savePuzzle/${user.username}/${puzzle?.id}`, {
      method: "PUT"
    });
  } */

  async function handlePlayerMove(move: Move, moveCount: number): Promise<boolean> {
    setDisableClick(true);
    const response = await fetch(`/api/puzzle/valid/${puzzle!.id}/${move}/${moveCount}`);
    const result = await response.text();
    setDisableClick(false);

    if (isRace) {
      if (result === "win") {
        showCompleteIndicator();
        setPuzzleResults(prev => [...prev, true]);
      } else if (!result) {
        setPuzzleResults(prev => [...prev, false]);
      } else {
        setNewMoveByBoard(result as Move);
      }
      return true;
    } else {
      if (result === "win") {
        getRandomPuzzle();
        showCompleteIndicator();
        setPuzzleResults(prev => [...prev, true]);
        return true;
      } else if (!result) {
        setPuzzleResults(prev => [...prev, false]);
        return false;
      }
      setNewMoveByBoard(result as Move);
      return true;
    }
  }

  /* async function getFilteredPuzzle() {
    const response = await fetch(`/api/puzzle/new/${user?.username}`);
    const result = await response.json();
    setPuzzle(result);
    setTimeout(() => {
      setNewMoveByBoard(result.firstMove);
    }, 0);
  } */


  async function getRandomPuzzle() {
    const response = await fetch(`/api/puzzle`);
    const result = await response.json();
    setPuzzle(result);
    setTimeout(() => {
      setNewMoveByBoard(result.firstMove);
    }, 0);
  }

  async function getNextPuzzleForRace() {
    const response = await fetch(`/api/puzzle/next/${race.racePuzzleFirst}/${race.racePuzzleStep}/${puzzleResults.length + 1}`);
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

  async function startRush() {
    setPuzzleResults([]);
    setDisableClick(false);
    setIsRush(true);
    setIsHomeScreen(false);
    await getRandomPuzzle();
    setIsTimerOver(false);
  }

  async function startCasual() {
    setIsCasual(true);
    if (user) {
      await getPuzzleByRating();
    } else {
      await getPuzzleByRating();
    }
    setIsHomeScreen(false);
  }

  function startRace() {
    setIsRace(true);
    setIsHomeScreen(false);
    getNextPuzzleForRace();
  }

  function returnTimerValue() {
    return isTimerOver;
  }

  return (
    <div className="Game">
      <Board
        newMoveByBoard={newMoveByBoard}
        handlePlayerMove={handlePlayerMove}
        newBoard={puzzle && puzzle.table.split(" ")[0]}
        moveCount={moveCount}
        setMoveCount={setMoveCount}
        hint={hint}
        isTimerOver={returnTimerValue}
      />
      {isHomeScreen ? (
        <>
          <div className="blur"></div>
          <button className="play-btn" onClick={startCasual}>
            Practice
          </button>
          <button className="race-btn" onClick={startRush}>
            Puzzle Rush
          </button>
        </>
      ) : (
        <>
          {isRush && (
            <Rush
              getPuzzle={getPuzzleByRating}
              puzzleResults={puzzleResults}
              changePuzzle={(newPuzzle) => setPuzzle(newPuzzle)}
              changeMoveByBoard={(firstMove) => setNewMoveByBoard(firstMove)}
              setIsHomeScreen={(value) => setIsHomeScreen(value)}
              setIsTimerOver={setIsTimerOver}
              isTimerOver={returnTimerValue}
            />
          )}
          {isRace && (
            <> {/* Put Race component JSX here */}
            </>
          )}
          {isCasual && (
            <Casual
              getRandomPuzzle={getRandomPuzzle}
              setDisableClick={(disableValue) => setDisableClick(disableValue)}
              showHint={() => showHint(moveCount)}
              onHintReset={() => setHint(null)}
            />
          )}
        </>
      )}
      {disableClick && <div className="disabler"></div>}
      <div
        className="complete-indicator"
        style={{ top: isShowCompleteIndicator ? "5vh" : "-26vh" }}
      >
        <img src={checkIcon} alt="check icon" />
      </div>
    </div>
  );
}

export default Game;