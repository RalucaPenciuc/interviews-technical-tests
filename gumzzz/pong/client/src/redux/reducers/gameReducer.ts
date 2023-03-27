import AppState from "../store/store";
import {
  GameActionType,
  CONNECT_PLAYER_SUCCESS,
  CONNECT_PLAYER_BEGIN,
  CONNECT_PLAYER_ERROR,
  CREATE_GAME_BEGIN,
  CREATE_GAME_SUCCESS,
  CREATE_GAME_ERROR,
  JOIN_GAME_BEGIN,
  JOIN_GAME_SUCCESS,
  JOIN_GAME_ERROR,
  START_GAME,
  UPDATE_GAME,
} from "../actions/types";
import {
  connectPlayerBeginHandler,
  connectPlayerSuccessHandler,
  connectPlayerErrorHandler,
  createGameBeginHandler,
  createGameSuccessHandler,
  createGameErrorHandler,
  joinGameBeginHandler,
  joinGameSuccessHandler,
  joinGameErrorHandler,
  startGameHandler,
  updateGameHandler,
} from "./gameHandlers";

export const initialState: AppState = {
  clientId: "",
  games: [],
  currentGame: undefined,
  redirectGameTable: false,
  loading: false,
  error: "",
};

const gameReducer = (state = initialState, action: GameActionType): AppState => {
  switch (action.type) {
    case CONNECT_PLAYER_BEGIN:
      return connectPlayerBeginHandler(state);
    case CONNECT_PLAYER_SUCCESS:
      return connectPlayerSuccessHandler(state, action.payload);
    case CONNECT_PLAYER_ERROR:
      return connectPlayerErrorHandler(state, action.payload);

    case CREATE_GAME_BEGIN:
      return createGameBeginHandler(state);
    case CREATE_GAME_SUCCESS:
      return createGameSuccessHandler(state, action.payload);
    case CREATE_GAME_ERROR:
      return createGameErrorHandler(state, action.payload);

    case JOIN_GAME_BEGIN:
      return joinGameBeginHandler(state);
    case JOIN_GAME_SUCCESS:
      return joinGameSuccessHandler(state, action.payload);
    case JOIN_GAME_ERROR:
      return joinGameErrorHandler(state, action.payload);

    case START_GAME:
      return startGameHandler(state);
    
    case UPDATE_GAME:
      return updateGameHandler(state, action.payload);

    default:
      return state;
  }
};

export default gameReducer;
