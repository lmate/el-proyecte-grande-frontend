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
  const { isAlreadyJoined } = useParams()
  const navigate = useNavigate()

  const [isPending, setIsPending] = useState(true)
  const [playerList, setPlayerList] = useState([])
  const [loadingCounter, setLoadingCounter] = useState(3)
  const [isJoined, setIsJoined] = useState(false)
  const [raceStartAt, setRaceStartAt] = useState(null)
  const [raceLength, setRaceLength] = useState(null)
  const [isCountdown, setIsCountdown] = useState(false)

  useEffect(() => { setInterval(() => { setLoadingCounter((parseInt(Date.now() / 1000) % 3) + 1) }, 1000) }, [])

  useEffect(() => {
    subscribeToSocketListener('error', () => {
      alert("Something went wrong :(")
      navigate('/')
    })

    subscribeToSocketListener('joinRace', (socketBody) => {
      setPlayerList(playerList => [...playerList, socketBody.username])
    })

    subscribeToSocketListener('startCountdown', () => {
      setIsCountdown(true)
    })

    subscribeToSocketListener('startRace', (socketBody) => {
      setRaceStartAt(socketBody.startAt)
      setRaceLength(socketBody.raceLength)
      setIsPending(false)
      window.history.replaceState(null, "PuzzleShowdown", `/race/${raceId}`)
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
          <p className={`waiting-label ${isCountdown && 'extramargin'}`}>{isCountdown ? `Starting${'.'.repeat(loadingCounter)}` : `Waiting for the creator to start the race${'.'.repeat(loadingCounter)}`}</p>
          <div className="playerList">
            {playerList && playerList.map((playerName, index) => (
              <div key={playerName + index} className="playerListElement">
                <p className="playerName">{playerName}</p>
              </div>
            ))}
          </div>
          {!isJoined && !isAlreadyJoined && (
            <>
              <br/>
              <input className="join-btn" type="button" value="Join!" onClick={joinRace} />
            </>
          )}
        </>
      ) : (
        <p>{`${raceStartAt} ${raceLength}`}</p>
      )}
    </div>
  )
}

export default Race