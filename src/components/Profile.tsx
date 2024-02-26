import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultProfilePicture from "../assets/default-profile-picture.webp";

type ProfileData = {
  image: string;
  firstName: string;
  lastName: string;
  userName: string;
  rating: number;
};

function Profile({ user }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const { userName } = useParams();

  useEffect(() => {
    let lock = false;

    async function getProfileData() {
      const response = await fetch(`/api/user/profile/${userName}`);
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
  }, [user, userName]);

  return (
    <div className="Profile">
      {profileData && user && profileData.userName === user.userName ? (
        <div className="basedata">
          <img
            className="image"
            src={
              profileData.image == "default"
                ? defaultProfilePicture
                : profileData.image
            }
          />
          {profileData.firstName && profileData.lastName && (
            <p className="name">{`${profileData.firstName} ${profileData.lastName}`}</p>
          )}
          <p className="userName">{profileData.userName}</p>
          <p className="rating">{profileData.rating}</p>
        </div>
      ) : (
        <p>Different user</p>
      )}
    </div>
  );
}

export default Profile;
