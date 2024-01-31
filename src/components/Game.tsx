import { useEffect, useState } from "react";
import Board from "../components/Board";

function Game() {

  const [puzzle, setPuzzle] = useState(null)
  const [diableClick, setDisableClick] = useState(false)

  const [newMoveByBoard, setNewMoveByBoard] = useState(null);

  async function handlePlayerMove(move, moveCount) {
    setDisableClick(true)

    const response = await fetch(`/api/puzzle/valid/${puzzle.id}/${move}/${moveCount}`)
    const result = await response.text()
    console.log(result)

    setDisableClick(false)

    if (result === 'win') {
      getRandomPuzzle()
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
    setTimeout(() => {setNewMoveByBoard(result.firstMove)}, 1000)
  }

  useEffect(() => {
    getRandomPuzzle()
  }, [])

  return (
    <div className="Game">
      <Board newMoveByBoard={newMoveByBoard} handlePlayerMove={handlePlayerMove} newBoard={puzzle && puzzle.table.split(' ')[0]}/>
      {diableClick && (
        <div className="disabler"></div>
      )}

      {/*<div className="start-ribbon">Click to start a puzzle!</div>*/}
    </div>
  )
}

export default Game