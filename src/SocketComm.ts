import {raceSocketListener} from './components/Game/Race'
import {createRaceSocketListener} from '../src/components/Game/CreateRace'

const socket = new WebSocket("ws://185.237.14.207:8080/ws");

const responses: { [key: string]: (val: {[key: string]: string[]}) => void } = {};

function sendSocketMessage(
  endpoint: string,
  body: Record<string, unknown>,
  isExpectResponse: boolean
) {
  if (isExpectResponse) {
    const identifier = `${Date.now()}-${Object.keys(responses).length}`;

    socket.send(
      JSON.stringify({
        endpoint: endpoint,
        identifier: identifier,
        body: JSON.stringify(body),
      })
    );

    const requestPromise = new Promise<{[key: string]: string[] | string }>((myResolve) => {
      responses[identifier] = myResolve;
    }); 

    return requestPromise;
  }

  socket.send(
    JSON.stringify({
      endpoint: endpoint,
      identifier: 0,
      body: JSON.stringify(body),
    })
  );
}

socket.onmessage = ({ data }) => {
  const result = JSON.parse(data);
  const body = JSON.parse(result.body);

  if (result.identifier !== "0") {
    responses[result.identifier](body);
  } else {
    raceSocketListener(result.endpoint, body)
    createRaceSocketListener(result.endpoint, body)
  }
};

export default sendSocketMessage;
