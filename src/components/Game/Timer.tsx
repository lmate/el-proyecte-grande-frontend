import { useEffect, useState } from "react";

function Timer({ setIsTimerOver, START_TIMER }: { setIsTimerOver: (bool: boolean) => void, START_TIMER: number }) {

    const [timer, setTimer] = useState<number>(START_TIMER);

    useEffect(() => {
        function countDown() {
            let currTime: number = timer;
            const interval = setInterval(() => {
                if (currTime === 1) {
                    clearInterval(interval);
                    setIsTimerOver(true);
                }
                currTime--;
                setTimer(currTime);
            }, 1000);
        }

        countDown();
    }, []);

    function formatSeconds(sec: number): string {
        const min: number = Math.floor(sec / 60);
        const remainingSec = sec % 60;
        const formattedSec = remainingSec < 10 ? "0" + remainingSec : remainingSec;
        return min + ":" + formattedSec;
    }

    return (
        <div className={isRaceTimer == true ? 'raceTimer' : 'timer'}>
            <h1>{formatSeconds(timer)}</h1>
        </div>
    )
}


export default Timer;