import {
  ConnectResponse,
  CreateGameResponse,
  JoinGameResponse,
  UpdateGameResponse,
  ErrorResponse,
} from "../../models/Responses";
import {
  CreateGameRequest,
  JoinGameRequest,
  RegisterMoveRequest,
} from "../../models/Requests";

export const CONNECT_PLAYER_BEGIN = "CONNECT_PLAYER_BEGIN";
export const CONNECT_PLAYER_SUCCESS = "CONNECT_PLAYER_SUCCESS";
export const CONNECT_PLAYER_ERROR = "CONNECT_PLAYER_ERROR";

export const CREATE_GAME_BEGIN = "CREATE_GAME_BEGIN";
export const CREATE_GAME_SUCCESS = "CREATE_GAME_SUCCESS";
export const CREATE_GAME_ERROR = "CREATE_GAME_ERROR";

export const JOIN_GAME_BEGIN = "JOIN_GAME_BEGIN";
export const JOIN_GAME_SUCCESS = "JOIN_GAME_SUCCESS";
export const JOIN_GAME_ERROR = "JOIN_GAME_ERROR";

export const START_GAME = "START_GAME";

export const REGISTER_MOVE = "REGISTER_MOVE";

export const UPDATE_GAME = "UPDATE_GAME";

interface ConnectPlayerBegin {
  type: typeof CONNECT_PLAYER_BEGIN;
  payload: undefined;
}

interface ConnectPlayerSuccess {
  type: typeof CONNECT_PLAYER_SUCCESS;
  payload: ConnectResponse;
}

interface ConnectPlayerError {
  type: typeof CONNECT_PLAYER_ERROR;
  payload: ErrorResponse;
}

interface CreateGameBegin {
  type: typeof CREATE_GAME_BEGIN;
  payload: CreateGameRequest;
}

interface CreateGameSuccess {
  type: typeof CREATE_GAME_SUCCESS;
  payload: CreateGameResponse;
}

interface CreateGameError {
  type: typeof CREATE_GAME_ERROR;
  payload: ErrorResponse;
}

interface JoinGameBegin {
  type: typeof JOIN_GAME_BEGIN;
  payload: JoinGameRequest;
}

interface JoinGameSuccess {
  type: typeof JOIN_GAME_SUCCESS;
  payload: JoinGameResponse;
}

interface JoinGameError {
  type: typeof JOIN_GAME_ERROR;
  payload: ErrorResponse;
}

interface StartGame {
  type: typeof START_GAME;
  payload: string;
}

interface RegisterMove {
  type: typeof REGISTER_MOVE;
  payload: RegisterMoveRequest;
}

interface UpdateGame {
  type: typeof UPDATE_GAME;
  payload: UpdateGameResponse;
}

export type GameActionType =
  | ConnectPlayerBegin
  | ConnectPlayerSuccess
  | ConnectPlayerError
  | CreateGameBegin
  | CreateGameSuccess
  | CreateGameError
  | JoinGameBegin
  | JoinGameSuccess
  | JoinGameError
  | StartGame
  | RegisterMove
  | UpdateGame;
