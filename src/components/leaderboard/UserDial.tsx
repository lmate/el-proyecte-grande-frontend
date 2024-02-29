import defaultProfilePicture from  '../../assets/default-profile-picture.webp';
import LeaderboardUser from '../../types/leaderboardUserDial';

function UserDial({user}:{user: LeaderboardUser}){

    return(
        <div className="user-dial">
            <img className="user-img-leaderboard" src={user.image == "default" ? defaultProfilePicture : user.image}/>
            <p className="user-name">{user.username}</p>
        </div>
    )
}

export default UserDial;