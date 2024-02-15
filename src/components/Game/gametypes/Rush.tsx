import { useEffect, useState } from "react";

function Rush({disableCick, changePuzzle, changeMoveByBoard, puzzleResults}){
    const [timer, setTimer] = useState<number>(3000);
    

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
        
        if(puzzleResults[puzzleResults.length - 1] === true){
            const newDifficultiMin: number = currentDifficultyMin + difficultyIncrementor;
            const newDifficultiMax: number = currentDifficultyMax + difficultyIncrementor;
            setCurrentDifficultyMin(newDifficultiMin);
            setCurrentDificultyMax(newDifficultiMax);
            getPuzzleByDifficulty(newDifficultiMin, newDifficultiMax);
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

    return(
        <>
            <div className="timer">
                <h1>Timer: </h1>
                <h1> {timer}</h1>
            </div>
            <div className="score">
                <p>Correct puzzle count: {puzzleResults.filter(result => result == true).length}</p>
                {
                    puzzleResults.map(result => <span>{result ? '1 ' : '0 '}</span>)
                }
            </div>
        </>
    )
}

export default Rush;