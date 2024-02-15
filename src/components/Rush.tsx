import { useEffect, useState } from "react";

function Rush({disableCick}){
    const [timer, setTimer] = useState<number>(10);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [invalidCount, setInvalidCount] = useState<number>(0);

    const [currentDifficultyMin, setCurrentDifficultyMin] = useState<number>(400);
    const [currentDifficultyMax, setCurrentDificultyMax] = useState<number>(450);
    const difficultyIncrementor = 50

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