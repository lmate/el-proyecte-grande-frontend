import { useEffect } from "react";

function LeaderBoard(){
    useEffect(() => {
        const fetchLeaderBoard = async () => {
            const leaderBoardResponse = await fetch('/api/user/leaderboard');
            const leaderBoardData = await leaderBoardResponse.json();
            console.log(leaderBoardData);
        }

        fetchLeaderBoard();
    }, [])


    return(
        <h1>LeaderBoard</h1>
    )
}

export default LeaderBoard;