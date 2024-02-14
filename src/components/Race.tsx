import { useEffect, useState } from "react";

function Race({disableCick}){
    const [timer, setTimer] = useState<number>(10);

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

export default Race;