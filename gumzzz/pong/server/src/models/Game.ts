import GameTablePlayer from "./GameTablePlayer";
import Ball from "./Ball";

export default interface Game {
  _id: string;
  name: string;
  players: GameTablePlayer[];
  ball: Ball;
}
