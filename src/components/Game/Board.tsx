/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';


import {Cell, Move } from '../../types/boardtypes';

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

const BOARD_SIZE = "80vh";


function Board({ newMoveByBoard, handlePlayerMove, newBoard, moveCount, setMoveCount, hint, isTimerOver } : {
  newMoveByBoard : Move | null;
  handlePlayerMove: (move: Move, moveCount: number) => Promise<boolean>;
  newBoard: string | null;
moveCount: number;
  setMoveCount: (count:number) => void;
  hint : Cell | null
  isTimerOver: () => boolean;
}) {


  const [lastDragStartedAt, setLastDragStartedAt] = useState<number>(0)
  const [dragStartCell, setDragStartCell] = useState<number[] | null>(null)
  const [selectedCell, setSelectedCell] = useState<number[] | null>(null)
  const [lastMovedFromCell, setLastMovedFromCell] = useState<number[] | null>(null)
  const [lastMovedToCell, setLastMovedToCell] = useState<number[] | null>(null)
  const [playMoveSound] = useOurSound(moveSound);
  const [playCompletedSound] = useOurSound(completedSound);
  const [draggingPiece, setDraggingPiece] = useState<number[] | null>(null);
  const [mousePos, setMousePos] = useState<{[key: string]: any}>({});
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
    const handleMouseMove = (e: {[key: string]: any}) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    };

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, []);


  function movePiece(move: {[key: string]: number[]}) {
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

  async function playerMovePiece(from: number[], to: number[]) {
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

  function boardMovePiece(lichessMove: Move) {
    movePiece(convertLichessMoveToMove(lichessMove))
  }

  function convertLichessMoveToMove(lichessMove: Move) {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return {
      from: [8 - parseInt(lichessMove[1]), letters.indexOf(lichessMove[0])],
      to: [8 - parseInt(lichessMove[3]), letters.indexOf(lichessMove[2])]
    }
  }

  function convertMoveToLichessMove(from: number[], to: number[]) : Move {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return letters[from[1]] + (8 - from[0]) + letters[to[1]] + (8 - to[0]) as Move
  }

  function handleCellClick(e: {[key: string]: any}) {
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

  function isClickedCellHasWhitePiece(clickedCell: number[]) {
    const splitFen: string[] = board[clickedCell[0]][clickedCell[1]].toString().split('/');
    if (splitFen[splitFen.length - 1].split('.')[0].charAt(0) === 'w') {
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


  function handleDragStart(e: {[key: string]: any}) {
    const clickedCell: number[] = [parseInt(e.target.className.split(" ")[0].charAt(0)) - 1, parseInt(e.target.className.split(" ")[0].charAt(1)) - 1]
    setLastDragStartedAt(Date.now())
    if (isClickedCellHasWhitePiece(clickedCell)) {
      setDragStartCell(clickedCell)
      setDraggingPiece(clickedCell)
    }
  }

  function handleDragEnd(e: {[key: string]: any}) {
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
          <div className="cell highlight-cell" style={{ left: `calc(${lastMovedFromCell[1]} * (${BOARD_SIZE} / 8)`, top: `calc(${lastMovedFromCell[0]} * (${BOARD_SIZE} / 8)` }}></div>
          <div className="cell highlight-cell" style={{ left: `calc(${lastMovedToCell[1]} * (${BOARD_SIZE} / 8)`, top: `calc(${lastMovedToCell[0]} * (${BOARD_SIZE} / 8)` }}></div>
        </>
      )}

      {hint && (
        <div className="cell highlight-hint" style={{ left: `calc(${hint[1]} * (${BOARD_SIZE} / 8)`, top: `calc(${hint[0]} * (${BOARD_SIZE} / 8)` }}></div>
      )}

      {draggingPiece && Date.now() - lastDragStartedAt > 100 && dropHighlightLeft >= 0 && dropHighlightLeft <= 7 && dropHighlightTop >= 0 && dropHighlightTop <= 7 && (
        <div className="cell highlight-drop" style={{
          left: `calc(${dropHighlightLeft} * (${BOARD_SIZE} / 8))`,
          top: `calc(${dropHighlightTop} * (${BOARD_SIZE} / 8))`
        }}></div>
      )}

      {board.map((row, rowId: number) => {
        return row.map((piece, pieceId: number) => {

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
              style={{ zIndex: '5', left: `calc(${mousePos.x}px - ((100vw - ${BOARD_SIZE}) / 2) - ((${BOARD_SIZE} / 8) / 2))`, top: `calc(${mousePos.y}px - ((100vh - ${BOARD_SIZE}) / 2) - 3.5vh - ((${BOARD_SIZE} / 8) / 2))` }}
            ></img>

          } else {
            return piece != '' && <img
              key={`${rowId}${pieceId}`}
              className={`piece ${modifierClasses.join(' ')}`}
              src={piece}
              draggable={false}
              style={{ left: `calc(${pieceId} * (${BOARD_SIZE} / 8))`, top: `calc(${rowId} * (${BOARD_SIZE} / 8))` }}
            ></img>
          }
        })
      })}

      {renderCells()}

      {[8, 7, 6, 5, 4, 3, 2, 1].map((num, index) => {
        return (
          <p key={num} className='legend legend-num' style={{ marginTop: `calc(${index} * (${BOARD_SIZE} / 8)` }}>{num}</p>
        )
      })}

      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter, index) => {
        return (
          <p key={letter} className='legend legend-letter' style={{ marginLeft: `calc(${index} * (${BOARD_SIZE} / 8)` }}>{letter}</p>
        )
      })}

    </div>
  )
}

function convertFenToBoard(fen : string) {
  fen = replaceNumbersWithSpacesInFen(fen)
  const result: string[][] = []
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
      result[ result.length -1].push(char === ' ' ? '' : pieceRepo[char.toLowerCase()][char === char.toUpperCase() ? 1 : 0])
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