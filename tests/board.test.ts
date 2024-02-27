import {expect, test} from 'vitest';
import { convertFenToBoard, replaceNumbersWithSpacesInFen } from '../src/components/Game/Board';


  const fen: string = 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1'
  console.log(convertFenToBoard(fen))

 test("replace numbers with spaces", () =>{
    expect(replaceNumbersWithSpacesInFen('5K1R')).toBe('     K R')
})