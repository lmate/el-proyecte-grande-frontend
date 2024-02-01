import { useEffect, useState } from "react"

import Board from "../components/Board"
import checkIcon from '../assets/check-icon.svg'

function Game() {

  const [puzzle, setPuzzle] = useState(null)
  const [diableClick, setDisableClick] = useState(false)
  const [isShowCompleteIndicator, setIsShowCompleteIndicator] = useState(false);
  const [isHomeScreen, setIsHomeScreen] = useState(true);

  const [newMoveByBoard, setNewMoveByBoard] = useState(null);

  async function handlePlayerMove(move, moveCount) {
    setDisableClick(true)

    const response = await fetch(`/api/puzzle/valid/${puzzle.id}/${move}/${moveCount}`)
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

    setNewMoveByBoard(result)
    return true
  }

  async function getRandomPuzzle() {
    const response = await fetch('/api/puzzle')
    const result = await response.json()
    setPuzzle(result)
    setTimeout(() => {setNewMoveByBoard(result.firstMove)}, 0)
  }

  useEffect(() => {
  }, [])

  function showCompleteIndicator() {
    setIsShowCompleteIndicator(true)
    setTimeout(() => setIsShowCompleteIndicator(false), 1000)
  }

  return (
    <div className="Game">
      <Board newMoveByBoard={newMoveByBoard} handlePlayerMove={handlePlayerMove} newBoard={puzzle && puzzle.table.split(' ')[0]}/>
      {isHomeScreen ?(
        <>
        <div className="blur"></div>
      <button className="play-btn"onClick={() => {getRandomPuzzle(), setIsHomeScreen(false)}}>Start playing!</button>
        </> 
      ) : (
        <button className="next-puzzle-btn"onClick={() => {getRandomPuzzle(), setDisableClick(true), setTimeout(() => {
          setDisableClick(false)
        }, 1000)}}>Get new puzzle</button>
        )}
        {diableClick && (
          <div className="disabler"></div>
        )}
      <div className="complete-indicator" style={{top: isShowCompleteIndicator ? '5vh' : '-26vh'}}><img src={checkIcon} /></div>
    </div>
  )
}

export default Game