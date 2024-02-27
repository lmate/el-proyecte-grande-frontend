import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import sendSocketMessage from "../../../SocketComm";

const socketSubscriberFunctions = {}
function subscribeToSocketListener(endpoint, func) {
  socketSubscriberFunctions[endpoint] = func;
}

export function raceSocketListener(endpoint, body) {
  socketSubscriberFunctions[endpoint] && socketSubscriberFunctions[endpoint](body)
}

function Race({ user }) {
  const { raceId } = useParams()
  const navigate = useNavigate()

  const [isPending, setIsPending] = useState(true)
  const [playerList, setPlayerList] = useState([])
  const [loadingCounter, setLoadingCounter] = useState(3)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => { setInterval(() => { setLoadingCounter((parseInt(Date.now() / 1000) % 3) + 1) }, 1000) }, [])

  useEffect(() => {
    subscribeToSocketListener('error', () => {
      alert("Something went wrong :(")
      navigate('/')
    })

    subscribeToSocketListener('joinRace', (socketBody) => {
      setPlayerList(playerList => [...playerList, socketBody.username])
    })

    async function getPlayersInRace() {
      const result = await sendSocketMessage('getPlayersInRace', { raceId: raceId }, true)
      setPlayerList(playerList.concat(result.players))
    }
    getPlayersInRace()
  }, [])

  function joinRace() {
    sendSocketMessage('joinRace', { raceId: raceId, username: user ? user.userName : 'Anonymus' }, false)
    setIsJoined(true)
  }

  return (
    <div className="Race">
      {isPending ? (
        <>
          <p className="waiting-label">{`Waiting for the creator to start the race${'.'.repeat(loadingCounter)}`}</p>
          <div className="playerList">
            {playerList && playerList.map((playerName, index) => (
              <div key={playerName + index} className="playerListElement">
                <p className="playerName">{playerName}</p>
              </div>
            ))}
          </div>
          {!isJoined && (
            <>
              <br/>
              <input className="join-btn" type="button" value="Join!" onClick={joinRace} />
            </>
          )}
        </>
      ) : (
        <p>Here comes the Race</p>
      )}
    </div>
  )
}

export default Race