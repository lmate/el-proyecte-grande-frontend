import LeaderboardUser from "../../types/leaderboardUserDial";
import UserDial from "./UserDial";

function LeaderBoardRow({user, rank}: {user: LeaderboardUser, rank: number}){

    return(
        <tr className="leader-board-row">
            <td>{rank}#</td>
            <td>
                <UserDial user={user}/>
            </td>
            <td>{user.rating}</td>
        </tr>
    )
}

export default LeaderBoardRow;