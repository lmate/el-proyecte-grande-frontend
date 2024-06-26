import { useState, useEffect } from "react";
import sendSocketMessage from "../../SocketComm";
import { useNavigate } from "react-router-dom";
import copyIcon from '../../assets/copy-icon.svg';
import User from "../../types/user";

const socketSubscriberFunctions: { [key: string]: (body: {[key: string]: string}) => void } = {
  key: function (): void {
    throw new Error("Function not implemented.");
  }
}

 function subscribeToSocketListener(endpoint: string, func: (socketBody: {[key: string]: string}) => void) {
  socketSubscriberFunctions[endpoint] = func;
}

 export function createRaceSocketListener(endpoint: string, body: {[key: string]: string}) {
  socketSubscriberFunctions[endpoint] && socketSubscriberFunctions[endpoint](body)
}


function CreateRace({ user }: {
  user : User | null
}) {
  const navigate = useNavigate()

  const [isRaceCreated, setIsRaceCreated] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('3')
  const [raceId, setRaceId] = useState< string|null >(null)
  const [spectateId, setSpectateId] = useState< string | null>(null)
  const [playerList, setPlayerList] = useState< string[] | []>([])

  async function handleCreateRace() {
    const result = await sendSocketMessage(
      'createRace', { timeframe: selectedTimeframe,
         username: user ? user.username : "Anonymous",
          userId: user ? user.userId.toString() : Date.now().toString() },
           true) as {[key: string]: string} | undefined
    if (result) {
      setRaceId(result.raceId)
      setSpectateId(result.spectateId)
      setPlayerList([user ? user.username : 'Anonymous'])
      setIsRaceCreated(true)
    }
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

  function copyToClipboard(stringToCopy : string){
    navigator.permissions.query({ name: "write-on-clipboard" as PermissionName}).then((result) => {
      if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.writeText(stringToCopy)
        alert("Copied to clipboard!");
      }
    });
  }

  return (
    <div className="CreateRace">
      {isRaceCreated ? (
        <>
          <p className="link-description">Players join:</p>
          <img className="copy-btn" src={copyIcon} onClick={() => copyToClipboard(`puzzleshowdown.xyz/race/${raceId}`)} />
          <span className="link">{`puzzleshowdown.xyz/race/${raceId}`}</span>
          <p className="link-description">Spectators join:</p>
          <img className="copy-btn" src={copyIcon} onClick={() => copyToClipboard(`puzzleshowdown.xyz/spectate/${spectateId}`)} />
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
          {user ? 
          <input className="create-btn" type="button" value="Create Race!" onClick={handleCreateRace} />
           : <p className="anonymous-warning">Log in to create a Race!</p>}
        </>
      )}
    </div>
  )
}

export default CreateRace;