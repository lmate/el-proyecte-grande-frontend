import { useEffect, useState } from "react";

import correctPuzzle from '../../../assets/puzzle-complete-correct.svg';
import wrongPuzzle from '../../../assets/puzzle-complete-wrong.svg';


function Rush({disableCick, changePuzzle, changeMoveByBoard, puzzleResults, getPuzzle, setIsHomeScreen}){

    const START_TIMER = 45;
    const [timer, setTimer] = useState<number>(2);
    

    const [currentDifficultyMin, setCurrentDifficultyMin] = useState<number>(400);
    const [currentDifficultyMax, setCurrentDificultyMax] = useState<number>(450);
    const difficultyIncrementor = 50


    async function getPuzzleByDifficulty(min:number, max:number) {
        const newPuzzleData = await fetch(`/api/puzzle?min=${min}&max=${max}`);
        const newPuzzleResponse = await newPuzzleData.json();
        console.log(newPuzzleResponse.rating);
        changePuzzle(newPuzzleResponse);
        setTimeout(() => {changeMoveByBoard(newPuzzleResponse.firstMove)}, 0)
    }

    useEffect(() => {
        if(puzzleResults[puzzleResults.length - 1] === false){
            getPuzzleByDifficulty(currentDifficultyMin, currentDifficultyMax);
        } 
        else if(puzzleResults[puzzleResults.length - 1] === true){
            const newDifficultiMin: number = currentDifficultyMin + difficultyIncrementor;
            const newDifficultiMax: number = currentDifficultyMax + difficultyIncrementor;
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
                    disableCick();
                }
                currTime--;
                setTimer(currTime);
            }, 1000);
        }

        countDown();
    }, []);

    function formatSeconds(sec) {
        let min = Math.floor(sec / 60);
        let remainingSec = sec % 60;
        let formattedSec = remainingSec < 10 ? "0" + remainingSec : remainingSec;
        return min + ":" + formattedSec;
    }
    
    return(
        <>
            <div className="timer">
                <h1> {formatSeconds(timer)}</h1>
            </div>
            <div className="score">
                {
                    puzzleResults.map((result, index ) => (
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
            <h2>Success rate: {Math.round((puzzleResults.filter((result) => result == true).length / puzzleResults.length) * 100)}% </h2>
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