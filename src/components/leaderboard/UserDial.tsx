import defaultProfilePicture from  '../../assets/default-profile-picture.webp';
import LeaderboardUser from '../../types/leaderboardUserDial';

function UserDial({user}:{user: LeaderboardUser}){

    return(
        <div className="user">
            <p className="user-name">{user.username}</p>
            <img className="user-img" src={user.image == "default" ? defaultProfilePicture : user.image}/>
        </div>
    )
}

export default UserDial;