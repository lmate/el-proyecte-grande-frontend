import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import sendSocketMessage from "../../SocketComm";
import Game from "./Game";

import correctPuzzle from '../../assets/puzzle-complete-correct.svg';
import wrongPuzzle from '../../assets/puzzle-complete-wrong.svg';
import emptySvg from '../../assets/empty.svg';
import Timer from "./Timer";

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
  const [racePuzzleFirst, setRacePuzzleFirst] = useState(null)
  const [racePuzzleStep, setRacePuzzleStep] = useState(null)
  const [userId, setUserId] = useState(user ? user.userId.toString() : Date.now().toString())
  const [updatePlayersWithCompleteRacePuzzleUpdater, setUpdatePlayersWithCompleteRacePuzzleUpdater] = useState()
  const [isTimerOver, setIsTimerOver] = useState(false)

  const [players, setPlayers] = useState()

  useEffect(() => { setInterval(() => { setLoadingCounter((parseInt(Date.now() / 1000) % 3) + 1) }, 1000) }, [])

  useEffect(() => {
    subscribeToSocketListener('error', () => {
      alert("Something went wrong :(")
      navigate('/')
    })

    subscribeToSocketListener('joinRace', (socketBody) => {
      setPlayerList(playerList => [...playerList, [socketBody.username, socketBody.userId]])
    })

    subscribeToSocketListener('startCountdown', () => {
      setIsCountdown(true)
    })

    subscribeToSocketListener('completeRacePuzzle', (socketBody) => {
      setUpdatePlayersWithCompleteRacePuzzleUpdater([socketBody.userId, socketBody.success == 'true' ? true : false])
    })

    subscribeToSocketListener('startRace', (socketBody) => {
      setRaceStartAt(socketBody.startAt)
      setRaceLength(socketBody.raceLength)
      setRacePuzzleFirst(socketBody.first)
      setRacePuzzleStep(socketBody.step)
      setIsPending(false)

      async function getAllPlayers() {
        const result = await sendSocketMessage('getPlayersInRace', { raceId: raceId }, true)
        const newPlayers = {}
        for (let i = 0; i < result.players.length; i++) {
          newPlayers[result.players[i][1]] = [result.players[i][0], []];
        }
        setPlayers(newPlayers)
      }
      getAllPlayers()

      window.history.replaceState(null, "PuzzleShowdown", `/race/${raceId}`)
    })

    async function getPlayersInRace() {
      const result = await sendSocketMessage('getPlayersInRace', { raceId: raceId }, true)
      setPlayerList(playerList.concat(result.players))
    }
    setTimeout(getPlayersInRace, 2000)
  }, [])

  function joinRace() {
    sendSocketMessage('joinRace', { raceId: raceId, username: user ? user.username : 'Anonymous', userId: userId }, false)
    setIsJoined(true)
  }

  function handlePuzzleDone(success) {
    sendSocketMessage('completeRacePuzzle', { raceId: raceId, userId: userId, success: success.toString() }, false)
  }

  useEffect(() => {
    if (updatePlayersWithCompleteRacePuzzleUpdater) {
      setPlayers(CalculateNewPlayers(updatePlayersWithCompleteRacePuzzleUpdater[0], updatePlayersWithCompleteRacePuzzleUpdater[1]))
    }
    function CalculateNewPlayers(userId, success) {
      let newPlayers = structuredClone(players)
      newPlayers[userId][1].push(success)
      return newPlayers
    }
  }, [updatePlayersWithCompleteRacePuzzleUpdater])

  useEffect(() => {
    if (isTimerOver) {
      console.log('Time is up')
    }
  }, [isTimerOver])

  return (
    <div className="RacePage">
      {isPending ? (
        <>
          <p className={`waiting-label ${isCountdown && 'extramargin'}`}>{isCountdown ? `Starting${'.'.repeat(loadingCounter)}` : `Waiting for the creator to start the race${'.'.repeat(loadingCounter)}`}</p>
          <div className="playerList">
            {playerList && playerList.map((player, index) => (
              <div key={`player${player[0]}${index}`} className="playerListElement">
                <p className="playerName">{player[0]}</p>
              </div>
            ))}
          </div>
          {!isJoined && !isAlreadyJoined && (
            <>
              <br />
              <input className="join-btn" type="button" value="Join!" onClick={joinRace} />
            </>
          )}
        </>
      ) : (
        <>
          {/*<Game startGamemode={"Race"} />*/}
          <Timer setIsTimerOver={setIsTimerOver} START_TIMER={raceLength * 60} isRaceTimer={true} />
          <Game startGamemode={"Race"} race={{
            racePuzzleFirst,
            racePuzzleStep,
            handlePuzzleDone: (success) => handlePuzzleDone(success)
          }} />
          <div key={"playerResults"} className="player-results">
            {players && Object.keys(players).map(key => (
              <>
                <p key={`${key}${players[key][0]}`} className="user-name">{players[key][0]}</p>
                {players[key][1].map((result: boolean, index: number) => (
                  <img key={`img${key}${index}`} src={result ? correctPuzzle : wrongPuzzle} />
                ))}
                {players[key][1].length == 0 && (
                  <img key={`imgempty`} src={emptySvg} />
                )}
              </>
            ))}
          </div>
          {isTimerOver && (
            <div className="raceBlur"></div>
          )}
        </>
      )}
    </div>
  )
}

export default Race