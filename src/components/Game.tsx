import {useEffect, useState } from "react"

import Board from "../components/Board"
import checkIcon from '../assets/check-icon.svg'
import SingleGame from "./SingleGame";
import Race from "./Race";


type Move = `${string}${number}${string}${number}`;
type Cell = `${string}${number}`;

interface Puzzle{
  // DTO : String id, String table, String firstMove, float rating, float popularity
  id: string,
  table: string,
  firstMove: Move,
  rating: number,
  popularity: number
}

function Game() {

  const [moveCount, setMoveCount] = useState(0)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [diableClick, setDisableClick] = useState<boolean>(false)
  const [isShowCompleteIndicator, setIsShowCompleteIndicator] = useState<boolean>(false);
  const [isHomeScreen, setIsHomeScreen] = useState<boolean>(true);
  const [hint, setHint] = useState<Cell | null>(null);

  const [newMoveByBoard, setNewMoveByBoard] = useState<Move | null>(null);

  const [isRace, setIsRace] = useState<boolean>(false);

  async function handlePlayerMove(move:Move, moveCount:number):Promise<boolean> {

    setDisableClick(true)
    const response = await fetch(`/api/puzzle/valid/${puzzle!.id}/${move}/${moveCount}`)
    const result = await response.text()
    console.log(result)
    setDisableClick(false)

    if (result === 'win') {
      getRandomPuzzle()
      showCompleteIndicator()
      return true
    } else if (!result) {
      return false
    }
    setNewMoveByBoard(result as Move)
    return true
  }

  async function getRandomPuzzle() {
    const response = await fetch('/api/puzzle?min=399&max=550')
    const result = await response.json()
    setPuzzle(result)
    setTimeout(() => {setNewMoveByBoard(result.firstMove)}, 0)
  }

  async function showHint(moveCount:number){
    const response = await fetch(`/api/puzzle/hint/${puzzle!.id}/${moveCount}`);
    const result = await response.text();
    console.log(result);
    const hint = result as Cell;
    setHint(convertHint(hint));
  }
  function convertHint(hint:Cell) {
    const letterToNumMap: { [key: string]: string } = {
      'a': '0',
      'b': '1',
      'c': '2',
      'd': '3',
      'e': '4',
      'f': '5',
      'g': '6',
      'h': '7'
    };  
    const row = hint.charAt(1);
    const column = hint.charAt(0);
    const numColumn = letterToNumMap[column];
  
    return `${Math.abs(row - 8)}${(numColumn)}`
  }


  function showCompleteIndicator() {
    setIsShowCompleteIndicator(true)
    setTimeout(() => setIsShowCompleteIndicator(false), 600)
  } 

  function startRace(){
    setIsRace(true);
    setIsHomeScreen(false);
    getRandomPuzzle();
  }

  return (
    <div className="Game">
      <Board newMoveByBoard={newMoveByBoard} handlePlayerMove={handlePlayerMove} newBoard={puzzle && puzzle.table.split(' ')[0]} moveCount={moveCount} setMoveCount={setMoveCount} hint={hint} setHint={setHint}/>
      {isHomeScreen ?(
        <>
          <div className="blur"></div>
          <button className="play-btn"onClick={() => {getRandomPuzzle(), setIsHomeScreen(false)}}>Start playing!</button>
          <button className="race-btn" onClick={() => startRace()}>Play Race!</button>
        </> 
      ) : (
        <>
          {!isRace ? 
            <SingleGame getRandomPuzzle={getRandomPuzzle} setDisableClick={(disableValue) => setDisableClick(disableValue)} showHint={() => showHint(moveCount)} setHint={() => setHint(null)}/>
            :
            <Race disableCick={() => setDisableClick(true)}/>
        }
          
        </>
        )}
        {diableClick && 
          <div className="disabler"></div>
          }
      <div className="complete-indicator" style={{top: isShowCompleteIndicator ? '5vh' : '-26vh'}}><img src={checkIcon} /></div>
    </div>
  )
}

export default Game