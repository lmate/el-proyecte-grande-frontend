import { useEffect, useState } from "react";
import {Move, Puzzle } from '../../../types/boardtypes';

import correctPuzzle from '../../../assets/puzzle-complete-correct.svg';
import wrongPuzzle from '../../../assets/puzzle-complete-wrong.svg';
import Timer from "../Timer";


function Rush({ changePuzzle, changeMoveByBoard, puzzleResults, getPuzzle, setIsHomeScreen, setIsTimerOver, isTimerOver} : {
    changePuzzle: (p: Puzzle) => void;
    changeMoveByBoard: (move : Move) => void;
    puzzleResults: boolean[];
    getPuzzle: () => Promise<void>;
    setIsHomeScreen: (bool:boolean) => void;
    setIsTimerOver: (bool:boolean) => void;
    isTimerOver: () => boolean;
}){

    const START_TIMER:number = 180;
    const MIN_DIFFICULTY:number = 400;
    const DIFFICULTY_INCREMENTOR:number = 50;

    const [currentDifficultyMin, setCurrentDifficultyMin] = useState<number>(MIN_DIFFICULTY);
    const [currentDifficultyMax, setCurrentDificultyMax] = useState<number>(MIN_DIFFICULTY + DIFFICULTY_INCREMENTOR);


    async function getPuzzleByDifficulty(min:number, max:number): Promise<void>{
        const newPuzzleData = await fetch(`/api/puzzle?min=${min}&max=${max}`);
        const newPuzzleResponse = await newPuzzleData.json();
        changePuzzle(newPuzzleResponse);
        setTimeout(() => {changeMoveByBoard(newPuzzleResponse.firstMove)}, 0)
    }

    useEffect(() => {
        if(puzzleResults[puzzleResults.length - 1] === false){
            getPuzzleByDifficulty(currentDifficultyMin, currentDifficultyMax);
        } 
        else if(puzzleResults[puzzleResults.length - 1] === true){
            const newDifficultiMin: number = currentDifficultyMin + DIFFICULTY_INCREMENTOR;
            const newDifficultiMax: number = currentDifficultyMax + DIFFICULTY_INCREMENTOR;
            setCurrentDifficultyMin(newDifficultiMin);
            setCurrentDificultyMax(newDifficultiMax);
            getPuzzleByDifficulty(newDifficultiMin, newDifficultiMax);
        }
        else{
            getPuzzle()
        }

    },[puzzleResults]);


    return(
        <>
        <Timer
         setIsTimerOver={setIsTimerOver}
         START_TIMER={START_TIMER}
         isRaceTimer = {false}
        />
            <div className="score">
                {
                    puzzleResults.map((result: boolean, index:number ) => (
                    <img key={index} src={result ? correctPuzzle : wrongPuzzle} />))
                }
            </div>

        {isTimerOver() && (
        <>
        <div className="blur">
        </div>
        <dialog open className="rush-end-dialog">
            <h2>Congrats!</h2>
            <h2>You finished {puzzleResults.length} puzzles!</h2>
            <h2>Success rate: {Math.round((puzzleResults.filter((result:boolean) => result == true).length / puzzleResults.length) * 100)}% </h2>
            <h2>Average time per puzzle: {Math.round((START_TIMER / puzzleResults.length) * 100 ) / 100 }  seconds </h2>
            <button className="rush-end-button" onClick={() => setIsHomeScreen(true)}>Go Home</button>
        </dialog> 
        </>
        )
        }
        </>
    )
}

export default Rush;