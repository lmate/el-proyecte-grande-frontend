import bK from '../assets/pieces/bK.svg'
import bQ from '../assets/pieces/bQ.svg'
import bR from '../assets/pieces/bR.svg'
import bB from '../assets/pieces/bB.svg'
import bN from '../assets/pieces/bN.svg'
import bP from '../assets/pieces/bP.svg'

import wK from '../assets/pieces/wK.svg'
import wQ from '../assets/pieces/wQ.svg'
import wR from '../assets/pieces/wR.svg'
import wB from '../assets/pieces/wB.svg'
import wN from '../assets/pieces/wN.svg'
import wP from '../assets/pieces/wP.svg'

import { useState } from 'react'

function Board() {

  const [selectedCell, setSelectedCell] = useState(null);
  const [board, setBoard] = useState(
    [
      [bR, bN, bB, bQ, bK, bB, bN, bR],
      [bP, bP, bP, bP, bP, bP, bP, bP],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      [wP, wP, wP, wP, wP, wP, wP, wP],
      [wR, wN, wB, wQ, wK, wB, wN, wR],
    ]
  );

  function handleCellClick(e) {
    const clickedCell = [parseInt(e.target.className.split(" ")[0].charAt(0)) - 1, parseInt(e.target.className.split(" ")[0].charAt(1)) - 1]

    if (selectedCell) {
      const newBoard = structuredClone(board);
      newBoard[clickedCell[0]][clickedCell[1]] = newBoard[selectedCell[0]][selectedCell[1]]
      newBoard[selectedCell[0]][selectedCell[1]] = '';
      setSelectedCell(null);
      setBoard(newBoard);

    } else if (board[clickedCell[0]][clickedCell[1]] !== '') {
      setSelectedCell(structuredClone(clickedCell));
    }
  }

  return (
    <div className="Board" onClick={handleCellClick}>

      {board.map((row, rowId) => {
        return row.map((piece, pieceId) => {
          let styleToSet = {left: pieceId * ((window.innerHeight * 0.8) / 8), top: rowId * ((window.innerHeight * 0.8) / 8)}

          if (selectedCell && (rowId === selectedCell[0] && pieceId === selectedCell[1])) {
            styleToSet = {left: pieceId * ((window.innerHeight * 0.8) / 8), top: rowId * ((window.innerHeight * 0.8) / 8), opacity: .5}
          }
          return piece != '' && <img
            key={`${rowId}${pieceId}`}
            className="piece"
            src={piece}
            style={styleToSet}
          ></img>
        })
      })}

      <div className="11 cell"></div>
      <div className="12 cell cell-black"></div>
      <div className="13 cell"></div>
      <div className="14 cell cell-black"></div>
      <div className="15 cell"></div>
      <div className="16 cell cell-black"></div>
      <div className="17 cell"></div>
      <div className="18 cell cell-black"></div>

      <div className="21 cell cell-black"></div>
      <div className="22 cell"></div>
      <div className="23 cell cell-black"></div>
      <div className="24 cell"></div>
      <div className="25 cell cell-black"></div>
      <div className="26 cell"></div>
      <div className="27 cell cell-black"></div>
      <div className="28 cell"></div>

      <div className="31 cell"></div>
      <div className="32 cell cell-black"></div>
      <div className="33 cell"></div>
      <div className="34 cell cell-black"></div>
      <div className="35 cell"></div>
      <div className="36 cell cell-black"></div>
      <div className="37 cell"></div>
      <div className="38 cell cell-black"></div>

      <div className="41 cell cell-black"></div>
      <div className="42 cell"></div>
      <div className="43 cell cell-black"></div>
      <div className="44 cell"></div>
      <div className="45 cell cell-black"></div>
      <div className="46 cell"></div>
      <div className="47 cell cell-black"></div>
      <div className="48 cell"></div>

      <div className="51 cell"></div>
      <div className="52 cell cell-black"></div>
      <div className="53 cell"></div>
      <div className="54 cell cell-black"></div>
      <div className="55 cell"></div>
      <div className="56 cell cell-black"></div>
      <div className="57 cell"></div>
      <div className="58 cell cell-black"></div>

      <div className="61 cell cell-black"></div>
      <div className="62 cell"></div>
      <div className="63 cell cell-black"></div>
      <div className="64 cell"></div>
      <div className="65 cell cell-black"></div>
      <div className="66 cell"></div>
      <div className="67 cell cell-black"></div>
      <div className="68 cell"></div>

      <div className="71 cell"></div>
      <div className="72 cell cell-black"></div>
      <div className="73 cell"></div>
      <div className="74 cell cell-black"></div>
      <div className="75 cell"></div>
      <div className="76 cell cell-black"></div>
      <div className="77 cell"></div>
      <div className="78 cell cell-black"></div>

      <div className="81 cell cell-black"></div>
      <div className="82 cell"></div>
      <div className="83 cell cell-black"></div>
      <div className="84 cell"></div>
      <div className="85 cell cell-black"></div>
      <div className="86 cell"></div>
      <div className="87 cell cell-black"></div>
      <div className="88 cell"></div>
    </div>
  )
}

export default Board;