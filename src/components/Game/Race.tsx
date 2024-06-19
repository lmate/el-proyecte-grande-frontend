import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import sendSocketMessage from "../../SocketComm";
import Game from "./Game";

import correctPuzzle from '../../assets/puzzle-complete-correct.svg';
import wrongPuzzle from '../../assets/puzzle-complete-wrong.svg';
import emptySvg from '../../assets/empty.svg';
import Timer from "./Timer";

import User from "../../types/user";

const socketSubscriberFunctions: { [key: string]: (body: {[key: string]: string}) => void } = {
  key: function (): void {
    throw new Error("Function not implemented.");
  }
}

 function subscribeToSocketListener(endpoint: string, func: (socketBody: {[key: string]: string | number}) => void) {
  socketSubscriberFunctions[endpoint] = func;
}

// eslint-disable-next-line react-refresh/only-export-components
export function raceSocketListener(endpoint: string, body: {[key: string]: string}) {
  socketSubscriberFunctions[endpoint] && socketSubscriberFunctions[endpoint](body)
}

function Race({ user } : {user: User | null}) {
  const { raceId } = useParams()
  const { isAlreadyJoined } = useParams()
  const navigate = useNavigate()

  const [isPending, setIsPending] = useState(true)
  const [playerList, setPlayerList] = useState<string[][] | null>([])
  const [loadingCounter, setLoadingCounter] = useState(3)
  const [isJoined, setIsJoined] = useState(false)
  const [raceLength, setRaceLength] = useState<string | null>(null)
  const [isCountdown, setIsCountdown] = useState(false)
  const [racePuzzleFirst, setRacePuzzleFirst] = useState<string | null>(null)
  const [racePuzzleStep, setRacePuzzleStep] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>()
  const [updatePlayersWithCompleteRacePuzzleUpdater, setUpdatePlayersWithCompleteRacePuzzleUpdater] = useState<[string, boolean] | null>()
  const [isTimerOver, setIsTimerOver] = useState(false)
  
  const [players, setPlayers] = useState<{[key: string]: [string, boolean[]]}>()
  useEffect(() =>{
     setUserId(user ? user.userId.toString() : "Anonymous" + Date.now().toString());
  },[user])
  useEffect(() => {
    
    setInterval(() => { setLoadingCounter(((Date.now() / 1000) % 3) + 1) }, 1000) }, [])

  useEffect(() => {
    subscribeToSocketListener('error', () => {
      alert("Something went wrong :(")
      navigate('/')
    })

    subscribeToSocketListener('joinRace', (socketBody) => {
      //setPlayerList(playerList => [...playerList, [socketBody.username, socketBody.userId]])

      setPlayerList(playerList => Object.assign([], playerList, [[socketBody.username, socketBody.userId]]));

    })

    subscribeToSocketListener('startCountdown', () => {
      setIsCountdown(true)
    })

    subscribeToSocketListener('completeRacePuzzle', (socketBody : { [key:string ] : string | boolean | number } ) => {
      setUpdatePlayersWithCompleteRacePuzzleUpdater([socketBody.userId as string, socketBody.success == 'true' ? true : false])
    })

    subscribeToSocketListener('startRace', (socketBody) => {
      setRaceLength(socketBody.raceLength as string)
      setRacePuzzleFirst(socketBody.first as string)
      setRacePuzzleStep(socketBody.step as number)
      setIsPending(false)

      async function getAllPlayers() {
        const result = await sendSocketMessage('getPlayersInRace', { raceId: raceId }, true) as  {[key: string]: string[]} | undefined
        const newPlayers: {[key: string]: [string, boolean[]]} = {}
        if (result) {
          for (let i = 0; i < result.players.length; i++) {
            newPlayers[result.players[i][1]] = [result.players[i][0], []];
          }
        }
        setPlayers(newPlayers)
      }
      getAllPlayers()

      window.history.replaceState(null, "PuzzleShowdown", `/race/${raceId}`)
    })


    subscribeToSocketListener("notifyGameOver", () =>{
      setTimeout(() => {
        navigate("/");
      }, 3000)
    })

    async function getPlayersInRace() {
      const result = await sendSocketMessage('getPlayersInRace', { raceId: raceId }, true) as {[key: string]: string[]} | undefined 
      playerList && result && setPlayerList(playerList.concat(result.players))
    }
    setTimeout(getPlayersInRace, 2000)
  }, [])

  function joinRace() {
    sendSocketMessage('joinRace', { raceId: raceId, username: user ? user.username : 'Anonymous', userId: userId }, false)
    setIsJoined(true)
  }

  function handlePuzzleDone(success: boolean) {
    sendSocketMessage('completeRacePuzzle', { raceId: raceId, userId: userId, success: success.toString() }, false)
  }

  useEffect(() => {
    if (updatePlayersWithCompleteRacePuzzleUpdater) {
      setPlayers(CalculateNewPlayers(updatePlayersWithCompleteRacePuzzleUpdater[0], updatePlayersWithCompleteRacePuzzleUpdater[1]))
    }

    function CalculateNewPlayers(userId: string, success: boolean) {
      const newPlayers: {[key: string]: [string, boolean[]]} | undefined = structuredClone(players)
      newPlayers && newPlayers[userId][1].push(success)
      return newPlayers
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePlayersWithCompleteRacePuzzleUpdater])

  useEffect(() => {
    if (isTimerOver) {
      sortPlayersAfterRace();
    }
  }, [isTimerOver])

  async function sortPlayersAfterRace(){
    const solved : number[] = [];
    const names : string[] = []
    for (const player in players){
      const counter : number = players[player][1].filter( (bool: boolean) => bool === true).length;
      if (player[0][0] !== "A") {
        solved.push(counter);
        names.push(player);
      }
    }
    for (let i = 0; i < solved.length - 1; i++){
      for (let j = 0; j < solved.length - 1; j++){
        if (solved[j] < solved[j + 1]) {
          const temp = solved[j];
          solved[j] = solved[j + 1]
          solved[j + 1 ] = temp;
          const tempName = names[j];
          names[j] = names[j + 1]
          names[j + 1] = tempName;
        }
      }
    }
    sendSocketMessage('handleRaceEnd', { raceId: raceId, names : names.join("&") }, false);
    }
  

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
          <Timer setIsTimerOver={setIsTimerOver} START_TIMER={parseInt(raceLength!) * 60} isRaceTimer={true} />
          <Game 
          user={user}
          startGamemode={"Race"}
           race={{
            racePuzzleFirst,
            racePuzzleStep,
            handlePuzzleDone: (success: boolean) => handlePuzzleDone(success)
          }} />
          <div key={"playerResults"} className="player-results">
            {players && Object.keys(players).map(key => (
              <>
                <p key={`${key}${players[key][0]}`} className="user-name">{players[key][0]}</p>
                {players[key][1].map((result: boolean, index: number) => (
                  <img className="race-score"key={`img${key}${index}`} src={result ? correctPuzzle : wrongPuzzle} />
                ))}
                {players[key][1].length == 0 && (
                  <img className="race-score"key={`imgempty`} src={emptySvg} />
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