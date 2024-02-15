import { useEffect, useState } from "react";

function Rush({disableCick, invalidMoveCount, changePuzzle, changeMoveByBoard}){
    const [timer, setTimer] = useState<number>(3000);
    

    const [currentDifficultyMin, setCurrentDifficultyMin] = useState<number>(400);
    const [currentDifficultyMax, setCurrentDificultyMax] = useState<number>(450);
    const difficultyIncrementor = 50


    useEffect(() => {
        console.log(invalidMoveCount);
        if(invalidMoveCount !== 0){
            const getPuzzleByDifficulty = async () => {
                const newPuzzleData = await fetch(`/api/puzzle?min=${currentDifficultyMin}&max=${currentDifficultyMax}`);
                const newPuzzleResponse = await newPuzzleData.json();
                changePuzzle(newPuzzleResponse);
                setTimeout(() => {changeMoveByBoard(newPuzzleResponse.firstMove)}, 0)
            }

            getPuzzleByDifficulty();
        }
    },[invalidMoveCount]);


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
        <div>
            {timer}
        </div>
    )
}

export default Rush;