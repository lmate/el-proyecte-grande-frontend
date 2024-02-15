import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultProfilePicture from "../assets/default-profile-picture.webp"

function Profile({ user }) {

  const [profileData, setProfileData] = useState()

  const { userName } = useParams();


  useEffect(() => {
    async function getProfileData() {
      const response = await fetch(`/api/user/profile/${userName}`)
      const result = await response.json()
      setProfileData(result)
    }

    if (user) {
      getProfileData()
    }
  }, [user])

  return (
    <div className="Profile">
      {profileData && user && profileData.userName === user.userName ? (
        <div className="basedata">
          <img className="image" src={profileData.image == 'default' ? defaultProfilePicture : profileData.image} />
          {profileData.firstName && profileData.lastName && (<p className="name">{`${profileData.firstName} ${profileData.lastName}`}</p>)}
          <p className="userName">{profileData.userName}</p>
          <p className="rating">{profileData.rating}</p>
        </div>
      ) : (
        <p>Different user</p>
      )}
    </div>
  )
}

export default Profile
