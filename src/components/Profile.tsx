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

function Profile({ user }:{user: ProfileData} ) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const { username } = useParams();

  useEffect(() => {
    let lock = false;

    async function getProfileData() {
      const response = await fetch(`/api/user/profile/${username}`);
      const result = await response.json();
      if (!lock) {
        setProfileData(result);
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
          />
          <p className="userName">{profileData.username}</p>
          <p className="rating">{profileData.rating}</p>
        </div>
      ) : (
        <p>Different user</p>
      )}
    </div>
  );
}

export default Profile;
