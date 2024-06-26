import { useEffect, useState } from "react";
import LeaderBoardTable from "./leaderboard/LeaderBoardTable";
import User from "../types/user";

function LeaderBoard({currentUser}: {currentUser: User | null}){
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderBoard = async () => {
            const leaderBoardResponse = await fetch('/api/user/leaderboard');
            const leaderBoardData = await leaderBoardResponse.json();
            setLeaderboard(leaderBoardData);
        }
        fetchLeaderBoard();
    }, [])
    
    return(
        <div className="leaderboard-container">
            <h1>Leaderboard</h1>
            <LeaderBoardTable users={leaderboard} currentUser={currentUser}/>
        </div>
    )
}

export default LeaderBoard;