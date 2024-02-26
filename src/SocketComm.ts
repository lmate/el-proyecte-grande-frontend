const socket = new WebSocket("ws://localhost:5173/ws");

const responses: { [key: string]: (val: unknown) => void } = {};

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

    const requestPromise = new Promise((myResolve) => {
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

  if (result.identifier !== "0") {
    const body = JSON.parse(result.body);
    responses[result.identifier](body);
  }
};

export default sendSocketMessage;
