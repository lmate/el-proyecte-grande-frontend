import { useEffect, useState } from "react";
import Board from "../components/Board";

function Game() {

  const [puzzle, setPuzzle] = useState(null)

  const [newMoveByBoard, setNewMoveByBoard] = useState(null);

  async function handlePlayerMove(move, moveCount) {
    const response = await fetch(`/api/puzzle/valid/${puzzle.id}/${move}/${moveCount}`)
    const result = await response.text()
    console.log(result)

    if (!result) {
      console.log('yesnull')
      return false
    }

    setNewMoveByBoard(result)
    return true
  }

  useEffect(() => {
    async function getRandomPuzzle() {
      const response = await fetch('/api/puzzle')
      const result = await response.json()
      setPuzzle(result)
      setTimeout(() => {setNewMoveByBoard(result.firstMove)}, 1000)
    }
    getRandomPuzzle()
  }, [])

  return (
    <div className="Game">
      <Board newMoveByBoard={newMoveByBoard} handlePlayerMove={handlePlayerMove} newBoard={puzzle && puzzle.table.split(' ')[0]}/>
    </div>
  )
}

export default Game