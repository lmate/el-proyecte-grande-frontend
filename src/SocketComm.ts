const socket = new WebSocket('ws://localhost:5173/ws')

const responses = {}

function sendSocketMessage(endpoint, body, isExpectResponse) {
  if (isExpectResponse) {
    const identifier = `${Date.now()}-${Object.keys(responses).length}`

    socket.send(JSON.stringify({
      'endpoint': endpoint,
      'identifier': identifier,
      'body': JSON.stringify(body) })
    )
    
    const requesPromise = new Promise((myResolve) => {
      responses[identifier] = myResolve
    })
    return requesPromise

  } else {
    socket.send(JSON.stringify({
      'endpoint': endpoint,
      'identifier': 0,
      'body': JSON.stringify(body) })
    )
  }
  return
}

socket.onmessage = ({ data }) => {
  const result = JSON.parse(data)

  if (result.identifier !== '0') {
    const body = JSON.parse(result.body)

    responses[result.identifier](body);
  }
}

export default sendSocketMessage
