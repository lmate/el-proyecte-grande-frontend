import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultProfilePicture from "../assets/default-profile-picture.webp";

type ProfileData = {
  id: number;
  username: string;
  jwt: string;
  image: string;
  rating: number;
};

type UserStat = {
  solvedPuzzles: number;
}

function Profile({ user }:{user: ProfileData} ) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userStatistics, setUserStatistics] = useState<UserStat | null>(null);

  const { username } = useParams();

  useEffect(() => {
    let lock = false;

    async function getProfileData() {
      const response = await fetch(`/api/user/profile/${username}`);
      const responseStat = await fetch(`/api/user/statistics/${username}`);
      const result = await response.json();
      const statistics = await responseStat.json();
      if (!lock) {
        setProfileData(result);
        setUserStatistics(statistics);
      }
    }

    if (user) {
      getProfileData();
    }

    return () => {
      lock = true;
    }
  }, [user, username]);

  return (
    <div className="Profile">
      {profileData && user && profileData.username === user.username ? (
        <div className="basedata">
          <img
            className="image"
            src={
              profileData.image == "default"
                ? defaultProfilePicture
                : profileData.image
            }
           alt={"Profile picture"}/>
          <p className="userName">{profileData.username}</p>
          <p className="rating">{profileData.rating}</p>
          <div className="profileStatistic">
            {userStatistics ?
            (
              <p>Solved puzzles: {userStatistics.solvedPuzzles}</p>
            ) : (<p>Error</p>)
            }

          </div>
        </div>
      ) : (
          <p>Different user</p>
      )}
    </div>
  );
}

export default Profile;
