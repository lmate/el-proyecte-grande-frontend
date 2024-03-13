import LeaderboardUser from "../../types/leaderboardUserDial";
import User from "../../types/user";
import UserDial from "./UserDial";

function LeaderBoardRow({user, currentUser, rank}: {user: LeaderboardUser, currentUser: User | null, rank: number}){

    return(
        <tr className={`leader-board-row ${user.username === currentUser?.username && 'place-in-leaderboard'}`} >
            <td>{rank}#</td>
            <td>
                <UserDial user={user}/>
            </td>
            <td>{user.rating}</td>
        </tr>
    )
}

export default LeaderBoardRow;