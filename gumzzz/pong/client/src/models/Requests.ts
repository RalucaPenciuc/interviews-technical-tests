export interface CreateGameRequest {
  clientId: string;
  gameName: string;
}

export interface JoinGameRequest {
  clientId: string;
  gameId?: string;
}

export interface RegisterMoveRequest {
  clientId: string;
  gameId?: string;
  direction: string;
}

export interface AbstractRequest {
  method: string;
  data: CreateGameRequest | JoinGameRequest | RegisterMoveRequest;
}
