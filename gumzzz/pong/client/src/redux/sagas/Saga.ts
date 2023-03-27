import { takeEvery } from "@redux-saga/core/effects";
import {
  CONNECT_PLAYER_BEGIN,
  CREATE_GAME_BEGIN,
  GameActionType,
  JOIN_GAME_BEGIN,
  START_GAME,
  REGISTER_MOVE,
} from "../actions/types";

export function* generalSaga(params: any): IterableIterator<any> {
  yield takeEvery(CONNECT_PLAYER_BEGIN, () => {
    params.socket.send(
      JSON.stringify({
        method: "connect",
      })
    );
  });

  yield takeEvery(CREATE_GAME_BEGIN, (action: GameActionType) => {
    params.socket.send(
      JSON.stringify({
        method: "create",
        data: action.payload,
      })
    );
  });

  yield takeEvery(JOIN_GAME_BEGIN, (action: GameActionType) => {
    params.socket.send(
      JSON.stringify({
        method: "join",
        data: action.payload,
      })
    );
  });

  yield takeEvery(START_GAME, (action: GameActionType) => {
    params.socket.send(
      JSON.stringify({
        method: "start",
        data: action.payload,
      })
    );
  });

  yield takeEvery(REGISTER_MOVE, (action: GameActionType) => {
    params.socket.send(
      JSON.stringify({
        method: "movement",
        data: action.payload,
      })
    );
  });
}
