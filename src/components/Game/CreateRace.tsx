import { useState, useEffect } from "react";
import sendSocketMessage from "../../SocketComm";
import { useNavigate } from "react-router-dom";
import copyIcon from '../../assets/copy-icon.svg';

const socketSubscriberFunctions = {}
function subscribeToSocketListener(endpoint, func) {
  socketSubscriberFunctions[endpoint] = func;
}

export function createRaceSocketListener(endpoint, body) {
  socketSubscriberFunctions[endpoint] && socketSubscriberFunctions[endpoint](body)
}

function CreateRace({ user }) {
  const navigate = useNavigate()

  const [isRaceCreated, setIsRaceCreated] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('3')
  const [raceId, setRaceId] = useState(null)
  const [spectateId, setSpectateId] = useState(null)
  const [playerList, setPlayerList] = useState([])

  async function handleCreateRace() {
    const result = await sendSocketMessage('createRace', { timeframe: selectedTimeframe, username: user ? user.userName : "Anonymus" }, true)
    setRaceId(result.raceId)
    setSpectateId(result.spectateId)
    setPlayerList([user ? user.userName : 'Anonymus'])
    setIsRaceCreated(true)
  }

  useEffect(() => {
    subscribeToSocketListener('joinRace', (socketBody) => {
      setPlayerList(playerList => [...playerList, socketBody.username])
    })

  }, [])

  function startRace() {
    sendSocketMessage('startRace', { raceId: raceId }, false)
    navigate(`/race/${raceId}/joined`)
  }

  return (
    <div className="CreateRace">
      {isRaceCreated ? (
        <>
          <p className="link-description">Players join:</p>
          <img className="copy-btn" src={copyIcon} onClick={() => navigator.clipboard.writeText(`puzzleshowdown.xyz/race/${raceId}`)} />
          <span className="link">{`puzzleshowdown.xyz/race/${raceId}`}</span>
          <p className="link-description">Spectators join:</p>
          <img className="copy-btn" src={copyIcon} onClick={() => navigator.clipboard.writeText(`puzzleshowdown.xyz/spectate/${spectateId}`)} />
          <span className="link">{`puzzleshowdown.xyz/spectate/${spectateId}`}</span>
          <div className="playerList">
            {playerList && playerList.map((playerName, index) => (
              <div key={playerName + index} className="playerListElement">
                <p className="playerName">{playerName}</p>
              </div>
            ))}
          </div>
          <input className="start-btn" type="button" value="Start!" onClick={startRace} />
        </>
      ) : (
        <>
          <p className="timeframe-label">Select race length:</p>
          <select className="timeframe-select" onChange={e => setSelectedTimeframe(e.target.value)}>
            <option value="3">3 min</option>
            <option value="5">5 min</option>
            <option value="10">10 min</option>
          </select>
          <br />
          <input className="create-btn" type="button" value="Create Race!" onClick={handleCreateRace} />
        </>
      )}
    </div>
  )
}

export default CreateRace;