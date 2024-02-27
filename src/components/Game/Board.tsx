import { useEffect, useState } from 'react';

import {Cell, Move, Puzzle } from '../../types/boardtypes';

import bK from '../../assets/pieces/bK.svg';
import bQ from '../../assets/pieces/bQ.svg';
import bR from '../../assets/pieces/bR.svg';
import bB from '../../assets/pieces/bB.svg';
import bN from '../../assets/pieces/bN.svg';
import bP from '../../assets/pieces/bP.svg';
import wK from '../../assets/pieces/wK.svg';
import wQ from '../../assets/pieces/wQ.svg';
import wR from '../../assets/pieces/wR.svg';
import wB from '../../assets/pieces/wB.svg';
import wN from '../../assets/pieces/wN.svg';
import wP from '../../assets/pieces/wP.svg';

/*
import BishopMovement from '../../movements/BishopMovement';
import KingMovement from '../../movements/KingMovement'
import RookMovement from '../../movements/RookMovement'
*/

import completedSound from '../../assets/sounds/puzzle-done.mp3';
import moveSound from '../../assets/sounds/move.mp3';
import useOurSound from '../../hooks/useOurSound';


function Board({ newMoveByBoard, handlePlayerMove, newBoard, moveCount, setMoveCount, hint, isTimerOver } : {
  newMoveByBoard : () => void;
  handlePlayerMove: () => void;
  newBoard: () => void;
  moveCount: number;
  setMoveCount: (count:number) => void;
  hint : Cell
  isTimerOver: () => boolean;
}) {

  const [lastDragStartedAt, setLastDragStartedAt] = useState<Cell | null>(null)
  const [dragStartCell, setDragStartCell] = useState<Cell | null>(null)
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
  const [lastMovedFromCell, setLastMovedFromCell] = useState<Cell | null>(null)
  const [lastMovedToCell, setLastMovedToCell] = useState<Cell | null>(null)
  const [playMoveSound] = useOurSound(moveSound);
  const [playCompletedSound] = useOurSound(completedSound);
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [mousePos, setMousePos] = useState({});
  const [board, setBoard] = useState(
    [
      [bR, bN, bB, bQ, bK, bB, bN, bR],
      [bP, bP, bP, bP, bP, bP, bP, bP],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      [wP, wP, wP, wP, wP, wP, wP, wP],
      [wR, wN, wB, wQ, wK, wB, wN, wR]
    ]
  )

  useEffect(() => {
    newMoveByBoard && boardMovePiece(newMoveByBoard)
  }, [newMoveByBoard])

  useEffect(() => {
    if (newBoard) {
      playCompletedSound()
      setBoard(convertFenToBoard(newBoard))
      setMoveCount(0)
      setSelectedCell(null)
      setLastMovedFromCell(null)
      setLastMovedToCell(null)
    }
  }, [newBoard])

  useEffect(() => {
    clearUpDrag()
  }, [isTimerOver])

  function clearUpDrag(){
    if (isTimerOver()){
      setDragStartCell(null)
      setDraggingPiece(null)
    }
  }

  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    };

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, []);


  function movePiece(move) {
    const newBoard = structuredClone(board) 
    newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]]
    newBoard[move.from[0]][move.from[1]] = ''
    setSelectedCell(null)
    setBoard(newBoard)

    setLastMovedFromCell([move.from[0], move.from[1]])
    setLastMovedToCell([move.to[0], move.to[1]])
    playMoveSound()

    setMoveCount(moveCount + 1)
  }

  async function playerMovePiece(from, to) {

    const boardBeforeMove = structuredClone(board)

    movePiece({
      from: [from[0], from[1]],
      to: [to[0], to[1]]
    })

    const isMoveValid = await handlePlayerMove(convertMoveToLichessMove(from, to), moveCount)

    if (!isMoveValid) {
      setBoard(boardBeforeMove)
      setMoveCount(moveCount)
    }
  }

  function boardMovePiece(lichessMove) {
    console.log(`Board move: ${lichessMove}`)
    movePiece(convertLichessMoveToMove(lichessMove))
  }

  function convertLichessMoveToMove(lichessMove) {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return {
      from: [8 - parseInt(lichessMove[1]), letters.indexOf(lichessMove[0])],
      to: [8 - parseInt(lichessMove[3]), letters.indexOf(lichessMove[2])]
    }
  }

  function convertMoveToLichessMove(from, to) {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return letters[from[1]] + (8 - from[0]) + letters[to[1]] + (8 - to[0])
  }

  function handleCellClick(e) {
    if (Date.now() - lastDragStartedAt > 200) {
      return
    }

    const clickedCell = [parseInt(e.target.className.split(" ")[0].charAt(0)) - 1, parseInt(e.target.className.split(" ")[0].charAt(1)) - 1]
    if (selectedCell) {

      if (clickedCell.join('') === selectedCell.join('')) {
        setSelectedCell(null)
        return
      }

      if (!isClickedCellHasWhitePiece(clickedCell) /* TODO: test if the move is legal */) {
        playerMovePiece(selectedCell, clickedCell)
      } else {
        setSelectedCell(clickedCell);
      }

    } else {
      if (isClickedCellHasWhitePiece(clickedCell)) {
        setSelectedCell(structuredClone(clickedCell))
      }
    }
  }

  function isClickedCellHasWhitePiece(clickedCell) {
    if (board[clickedCell[0]][clickedCell[1]].toString().split('/').at(-1).split('.')[0].charAt(0) === 'w') {
      return true
    }
    return false
  }

  const renderCells = () => {
    const cells = [];
    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        const cellClassName = `${i}${j} cell${(i + j) % 2 === 0 ? ' cell-black' : ''}`;
        cells.push(<div key={`${i}${j}`} className={cellClassName}></div>);
      }
    }
    return cells;
  };


  function handleDragStart(e) {

    const clickedCell = [parseInt(e.target.className.split(" ")[0].charAt(0)) - 1, parseInt(e.target.className.split(" ")[0].charAt(1)) - 1]
    setLastDragStartedAt(Date.now())
    if (isClickedCellHasWhitePiece(clickedCell)) {
      setDragStartCell(clickedCell)
      setDraggingPiece(clickedCell)
    }
  }

  function handleDragEnd(e) {
    const dropCell = [parseInt(e.target.className.split(" ")[0].charAt(0)) - 1, parseInt(e.target.className.split(" ")[0].charAt(1)) - 1]
    if (dragStartCell && (!isClickedCellHasWhitePiece(dropCell)) && !(dragStartCell[0] == dropCell[0] && dragStartCell[1] == dropCell[1])) {
      playerMovePiece(dragStartCell, dropCell)
    }
    setDragStartCell(null)
    setDraggingPiece(null)
  }

  const cellSideLength = document.body.clientHeight * 0.835 / 8
  const boardMarginLeft = ((document.body.clientWidth - document.body.clientHeight * 0.73) / 2)
  const boardMarginTop = ((document.body.clientHeight * 0.23) / 2)

  const dropHighlightLeft = Math.floor((mousePos.x - (boardMarginLeft - cellSideLength / 2)) / cellSideLength)
  const dropHighlightTop = Math.floor((mousePos.y - (boardMarginTop - cellSideLength / 2)) / cellSideLength) - 1

  return (
    <div className="Board" onClick={handleCellClick} onMouseDown={handleDragStart} onMouseUp={handleDragEnd}>

      {lastMovedFromCell && lastMovedToCell && (
        <>
          <div className="cell highlight-cell" style={{ left: `calc(${lastMovedFromCell[1]} * (72vh / 8)`, top: `calc(${lastMovedFromCell[0]} * (72vh / 8)` }}></div>
          <div className="cell highlight-cell" style={{ left: `calc(${lastMovedToCell[1]} * (72vh / 8)`, top: `calc(${lastMovedToCell[0]} * (72vh / 8)` }}></div>
        </>
      )}

      {hint && (
        <div className="cell highlight-hint" style={{ left: `calc(${hint[1]} * (72vh / 8)`, top: `calc(${hint[0]} * (72vh / 8)` }}></div>
      )}

      {draggingPiece && Date.now() - lastDragStartedAt > 100 && dropHighlightLeft >= 0 && dropHighlightLeft <= 7 && dropHighlightTop >= 0 && dropHighlightTop <= 7 && (
        <div className="cell highlight-drop" style={{
          left: `calc(${dropHighlightLeft} * (72vh / 8))`,
          top: `calc(${dropHighlightTop} * (72vh / 8))`
        }}></div>
      )}

      {board.map((row, rowId) => {
        return row.map((piece, pieceId) => {

          const modifierClasses = []
          if (selectedCell && (rowId === selectedCell[0] && pieceId === selectedCell[1])) {
            modifierClasses.push('selected-piece')
          }

          if (draggingPiece && draggingPiece[0] == rowId && draggingPiece[1] == pieceId) {
            return piece != '' && <img
              key={`${rowId}${pieceId}`}
              className={`piece ${modifierClasses.join(' ')}`}
              src={piece}
              draggable={false}
              style={{ zIndex: '5', left: `calc(${mousePos.x}px - ((100vw - 72vh) / 2) - ((72vh / 8) / 2))`, top: `calc(${mousePos.y}px - ((100vh - 72vh) / 2) - 3.5vh - ((72vh / 8) / 2))` }}
            ></img>

          } else {
            return piece != '' && <img
              key={`${rowId}${pieceId}`}
              className={`piece ${modifierClasses.join(' ')}`}
              src={piece}
              draggable={false}
              style={{ left: `calc(${pieceId} * (72vh / 8))`, top: `calc(${rowId} * (72vh / 8))` }}
            ></img>
          }
        })
      })}

      {renderCells()}

      {[8, 7, 6, 5, 4, 3, 2, 1].map((num, index) => {
        return (
          <p key={num} className='legend legend-num' style={{ marginTop: `calc(${index} * (72vh / 8)` }}>{num}</p>
        )
      })}

      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((letter, index) => {
        return (
          <p key={letter} className='legend legend-letter' style={{ marginLeft: `calc(${index} * (72vh / 8)` }}>{letter}</p>
        )
      })}

    </div>
  )
}

function convertFenToBoard(fen : string) {
  fen = replaceNumbersWithSpacesInFen(fen)
  const result = []
  const pieceRepo :{ [key: string]: string[] } = {
    k: [bK, wK],
    q: [bQ, wQ],
    r: [bR, wR],
    b: [bB, wB],
    n: [bN, wN],
    p: [bP, wP]
  }

  for (const row of fen.split('/')) {
    result.push([])
    for (const char of row.split('')) {
      result.at(-1).push(char === ' ' ? '' : [pieceRepo[char.toLowerCase()][char === char.toUpperCase() ? 1 : 0]])
    }
  }
  return result
}

function replaceNumbersWithSpacesInFen(fen: string) {
  let result = ''
  for (const char of fen.split('')) {
    result += /^\d+$/.test(char) ? ' '.repeat(parseInt(char)) : char
  }
  return result
}



export default Board

export { convertFenToBoard, replaceNumbersWithSpacesInFen};