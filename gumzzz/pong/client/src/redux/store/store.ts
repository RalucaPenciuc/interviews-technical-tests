import { Game } from "../../models/Game";

export default interface AppState {
  clientId: string;
  games: Game[];
  currentGame: Game | undefined;
  redirectGameTable: boolean;
  loading: boolean;
  error: string;
}
