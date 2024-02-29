import { useEffect, useState } from "react";
import LeaderBoardTable from "./leaderboard/LeaderBoardTable";

function LeaderBoard(){
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderBoard = async () => {
            const leaderBoardResponse = await fetch('/api/user/leaderboard');
            const leaderBoardData = await leaderBoardResponse.json();
            setLeaderboard(leaderBoardData);
            console.log(leaderBoardData);
        }

        fetchLeaderBoard();
    }, [])


    return(
        <div className="leaderboard-container">
            <h1>LeaderBoard</h1>
            <LeaderBoardTable users={leaderboard}/>
        </div>
    )
}

export default LeaderBoard;