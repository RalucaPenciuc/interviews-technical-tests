import GameTablePlayer from "./GameTablePlayer";
import Ball from "./Ball";

export interface Game {
  _id?: string;
  name: string;
  players: GameTablePlayer[];
  ball: Ball;
}
