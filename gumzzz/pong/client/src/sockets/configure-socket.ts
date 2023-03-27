import {
  connectPlayerSuccess,
  createGameSuccess,
  joinGameSuccess,
  startGame,
  updateGame,
} from "../redux/actions/actions";
import {
  AbstractResponse,
  ConnectResponse,
  CreateGameResponse,
  JoinGameResponse,
  UpdateGameResponse,
} from "../models/Responses";

export default function configureSocket(dispatch: any) {
  const ws: WebSocket = new WebSocket("wss://aqueous-peak-02889.herokuapp.com");

  ws.onmessage = (message) => {
    let response: AbstractResponse = JSON.parse(message.data);
    const { method, data } = response;

    switch (method) { // must check is actual response or error
      case "connect": {
        console.log("CONNECT RECEIVED: ", response);
        const connectionData: ConnectResponse = data as ConnectResponse;
        dispatch(connectPlayerSuccess(connectionData));
        break;
      }
      case "create": {
        console.log("CREATE RECEIVED: ", response);
        const createData: CreateGameResponse = data as CreateGameResponse;
        dispatch(createGameSuccess(createData));
        break;
      }
      case "join": {
        console.log("JOIN RECEIVED: ", response);
        const joinData: JoinGameResponse = data as JoinGameResponse;
        dispatch(joinGameSuccess(joinData));
        break;
      }
      case "start": {
        console.log("START RECEIVED: ", response);
        const startData: string = data as unknown as string;
        dispatch(startGame(startData));
        break;
      }
      case "update": {
        console.log("UPDATE RECEIVED: ", response);
        const data: UpdateGameResponse = response.data as UpdateGameResponse;
        dispatch(updateGame(data));
        break;
      }
      default:
        console.log("Unknown response.");
        break;
    }
  };

  return ws;
}
