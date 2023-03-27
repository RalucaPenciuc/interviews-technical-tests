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
  REGISTER_MOVE,
  UPDATE_GAME,
} from "./types";
import {
  ConnectResponse,
  CreateGameResponse,
  JoinGameResponse,
  UpdateGameResponse,
  ErrorResponse,
} from "../../models/Responses";
import { CreateGameRequest, JoinGameRequest, RegisterMoveRequest } from "../../models/Requests";

export function connectPlayerBegin(): GameActionType {
  return {
    type: CONNECT_PLAYER_BEGIN,
    payload: undefined,
  };
}

export function connectPlayerSuccess(data: ConnectResponse): GameActionType {
  return {
    type: CONNECT_PLAYER_SUCCESS,
    payload: data,
  };
}

export function connectPlayerError(error: ErrorResponse): GameActionType {
  return {
    type: CONNECT_PLAYER_ERROR,
    payload: error,
  };
}

export function createGameBegin(game: CreateGameRequest): GameActionType {
  return {
    type: CREATE_GAME_BEGIN,
    payload: game,
  };
}

export function createGameSuccess(data: CreateGameResponse): GameActionType {
  return {
    type: CREATE_GAME_SUCCESS,
    payload: data,
  };
}

export function createGameError(error: ErrorResponse): GameActionType {
  return {
    type: CREATE_GAME_ERROR,
    payload: error,
  };
}

export function joinGameBegin(data: JoinGameRequest): GameActionType {
  return {
    type: JOIN_GAME_BEGIN,
    payload: data,
  };
}

export function joinGameSuccess(data: JoinGameResponse): GameActionType {
  return {
    type: JOIN_GAME_SUCCESS,
    payload: data,
  };
}

export function joinGameError(error: ErrorResponse): GameActionType {
  return {
    type: JOIN_GAME_ERROR,
    payload: error,
  };
}

export function startGame(gameId: string): GameActionType {
  return {
    type: START_GAME,
    payload: gameId,
  };
}

export function registerMove(direction: RegisterMoveRequest): GameActionType {
  return {
    type: REGISTER_MOVE,
    payload: direction
  }
}

export function updateGame(data: UpdateGameResponse): GameActionType {
  return {
    type: UPDATE_GAME,
    payload: data,
  };
}
