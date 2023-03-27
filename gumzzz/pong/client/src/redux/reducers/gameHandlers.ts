import AppState from "../store/store";
import {
  ConnectResponse,
  ErrorResponse,
  CreateGameResponse,
  JoinGameResponse,
  UpdateGameResponse,
} from "../../models/Responses";
import { Game } from "../../models/Game";

export function connectPlayerBeginHandler(oldState: AppState): AppState {
  const newState = { ...oldState };
  newState.loading = true;
  newState.error = "";
  return newState;
}

export function connectPlayerSuccessHandler(oldState: AppState, data: ConnectResponse): AppState {
  const newState = { ...oldState };
  newState.loading = false;
  newState.error = "";
  newState.clientId = data.clientId;
  newState.games = data.games;
  return newState;
}

export function connectPlayerErrorHandler(oldState: AppState, error: ErrorResponse): AppState {
  const newState = { ...oldState };
  newState.loading = false;
  newState.error = error.message;
  return newState;
}

export function createGameBeginHandler(oldState: AppState): AppState {
  const newState = { ...oldState };
  newState.loading = true;
  newState.error = "";
  return newState;
}

export function createGameSuccessHandler(oldState: AppState, data: CreateGameResponse): AppState {
  const newState = { ...oldState };
  newState.loading = false;
  let newGames = newState.games.slice();
  newGames.splice(0, 0, data.game);
  newState.games = newGames;
  newState.error = "";
  return newState;
}

export function createGameErrorHandler(oldState: AppState, error: ErrorResponse): AppState {
  const newState = { ...oldState };
  newState.loading = false;
  newState.error = error.message;
  return newState;
}

export function joinGameBeginHandler(oldState: AppState): AppState {
  const newState = { ...oldState };
  newState.loading = true;
  newState.error = "";
  return newState;
}

export function joinGameSuccessHandler(oldState: AppState, data: JoinGameResponse): AppState {
  const newState = { ...oldState };
  newState.loading = false;
  newState.error = "";
  newState.currentGame = data.game;
  if (data.game.players.length === 2) {
    newState.games = oldState.games.filter(game => game._id !== data.game._id);
  } else {
    let newGames = newState.games.map((g: Game) => {
        if (g._id === data.game._id) {
          let updates: Game = {
            _id: g._id,
            name: g.name,
            players: data.game.players,
            ball: data.game.ball
          };
          g = { ...updates };
        }
        return g;
      });
      newState.games = newGames;
  }

  return newState;
}

export function joinGameErrorHandler(oldState: AppState, error: ErrorResponse): AppState {
  const newState = { ...oldState };
  newState.loading = false;
  newState.error = error.message;
  return newState;
}

export function startGameHandler(oldState: AppState): AppState {
  const newState = { ...oldState };
  newState.redirectGameTable = true;
  return newState;
}

export function updateGameHandler(oldState: AppState, newGame: UpdateGameResponse): AppState {
  const newState = { ...oldState };
  newState.currentGame = newGame.game;
  return newState;
}