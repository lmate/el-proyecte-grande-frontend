import LeaderboardUser from "../../types/leaderboardUserDial";
import LeaderBoardRow from "./LeaderBoardRow";

function LeaderBoardTable({users}: {users: LeaderboardUser[]}){

    return(
        <table className="leader-board-table">
            <tr className="leader-board-title">
                <th>Rank</th>
                <th>User</th>
                <th>Rating</th>
            </tr>

            {users.map((user, i) => <LeaderBoardRow key={user.username} user={user} rank={i + 1}/>) }
            
        </table>
    )
}

export default LeaderBoardTable;