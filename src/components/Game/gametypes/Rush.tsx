import { useEffect, useState } from "react";
import {Move, Puzzle } from '../../../types/boardtypes';

import correctPuzzle from '../../../assets/puzzle-complete-correct.svg';
import wrongPuzzle from '../../../assets/puzzle-complete-wrong.svg';


function Rush({disableClick, changePuzzle, changeMoveByBoard, puzzleResults, getPuzzle, setIsHomeScreen, setIsTimerOver} : {
    disableClick: () => void;
    changePuzzle: (difficulty:number) => Puzzle;
    changeMoveByBoard: (move : Move) => Move;
    puzzleResults: boolean[];
    getPuzzle: () => Promise<void>;
    setIsHomeScreen: (bool:boolean) => void;
    setIsTimerOver: (bool:boolean) => void;
}){
    const START_TIMER:number = 180;
    const MIN_DIFFICULTY:number = 400;
    const DIFFICULTY_INCREMENTOR:number = 50;

    const [timer, setTimer] = useState<number>(START_TIMER);
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


    useEffect(() => {
        function countDown(){
            let currTime: number = timer;
            const interval = setInterval(() => {
                if(currTime === 1){
                    clearInterval(interval);
                    disableClick();
                    setIsTimerOver(true);
                }
                currTime--;
                setTimer(currTime);
            }, 1000);
        }

        countDown();
    }, []);

    function formatSeconds(sec:number) : string {
        const min:number = Math.floor(sec / 60);
        const remainingSec = sec % 60;
        const formattedSec = remainingSec < 10 ? "0" + remainingSec : remainingSec;
        return min + ":" + formattedSec;
    }
    
    return(
        <>
            <div className="timer">
                <h1> {formatSeconds(timer)}</h1>
            </div>
            <div className="score">
                {
                    puzzleResults.map((result: boolean, index:number ) => (
                    <img key={index} src={result ? correctPuzzle : wrongPuzzle} />))
                }
            </div>

        {timer < 1 && (
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