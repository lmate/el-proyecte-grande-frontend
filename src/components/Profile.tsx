import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
          <img className="image" src={profileData.image} />
          {profileData.firstName && profileData.lastName && (<p className="name">{`${profileData.firstName} ${profileData.lastName}`}</p>)}
          <p className="userName">{profileData.userName + 'asdf'}</p>
          <p className="rating">{'1200' + profileData.rating}</p>
        </div>
      ) : (
        <p>Different user</p>
      )}
    </div>
  )
}

export default Profile
