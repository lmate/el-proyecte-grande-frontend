import { useEffect, useState } from "react";

function Rush({disableCick, invalidMoveCount, changePuzzle, changeMoveByBoard, validMoveCount}){
    const [timer, setTimer] = useState<number>(3000);
    

    const [currentDifficultyMin, setCurrentDifficultyMin] = useState<number>(400);
    const [currentDifficultyMax, setCurrentDificultyMax] = useState<number>(450);
    const [currentInvalidCount, setCurrentInvalidCount] = useState<number>(invalidMoveCount);
    const difficultyIncrementor = 50


    async function getPuzzleByDifficulty(min:number, max:number) {
        const newPuzzleData = await fetch(`/api/puzzle?min=${min}&max=${max}`);
        const newPuzzleResponse = await newPuzzleData.json();
        console.log(newPuzzleResponse.rating);
        changePuzzle(newPuzzleResponse);
        setTimeout(() => {changeMoveByBoard(newPuzzleResponse.firstMove)}, 0)
    }

    useEffect(() => {
        if(invalidMoveCount !== 0){
            setCurrentInvalidCount(invalidMoveCount);
            getPuzzleByDifficulty(currentDifficultyMin, currentDifficultyMax);
        }
        
        if(validMoveCount !== 0 && invalidMoveCount === currentInvalidCount){
            const newDifficultiMin: number = currentDifficultyMin + difficultyIncrementor;
            const newDifficultiMax: number = currentDifficultyMax + difficultyIncrementor;
            setCurrentDifficultyMin(newDifficultiMin);
            setCurrentDificultyMax(newDifficultiMax);
            getPuzzleByDifficulty(newDifficultiMin, newDifficultiMax);
        }
    },[invalidMoveCount, validMoveCount]);


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

    return(
        <div className="timer">
            <h1>Timer: </h1>
            <h1> {timer}</h1>
        </div>
        
    )
}

export default Rush;