import LeaderboardUser from "../../types/leaderboardUserDial";
import User from "../../types/user";
import LeaderBoardRow from "./LeaderBoardRow";

function LeaderBoardTable({users, currentUser}: {users: LeaderboardUser[], currentUser: User}){

    return(
        <table className="leader-board-table">
            <tr className="leader-board-title">
                <th>Rank</th>
                <th>User</th>
                <th>Rating</th>
            </tr>

            {users.map((user, i) => <LeaderBoardRow key={user.username} user={user} currentUser={currentUser} rank={i + 1}/>) }
            
        </table>
    )
}

export default LeaderBoardTable;