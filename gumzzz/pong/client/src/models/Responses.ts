import { Game } from "./Game";

export interface ConnectResponse {
  clientId: string;
  games: Game[];
}

export interface CreateGameResponse {
  game: Game;
}

export interface JoinGameResponse {
  game: Game;
}

export interface UpdateGameResponse {
  game: Game;
}

export interface ErrorResponse {
  message: string;
}

export interface AbstractResponse {
  method: string;
  data:
    | ConnectResponse
    | CreateGameResponse
    | JoinGameResponse
    | UpdateGameResponse
    | ErrorResponse;
}
