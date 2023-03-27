import React, { Component } from "react";
import "../assets/scss/GamesPage.scss";
import AppState from "../redux/store/store";
import { connect } from "react-redux";
import { Game } from "../models/Game";
import GameItem from "./GameItem";
import { CreateGameRequest } from "../models/Requests";
import { createGameBegin } from "../redux/actions/actions";
import { Link } from "react-router-dom";

interface IProps {
  clientId: string;
  games: Game[];
  createGame: Function;
}

class GamesPage extends Component<IProps, {}> {
  handleCreateGameButton() {
    let newGameName = window.prompt("Enter the game's name: ");
    if (newGameName) {
      let dataToSend: CreateGameRequest = {
        clientId: this.props.clientId,
        gameName: newGameName,
      };
      this.props.createGame(dataToSend);
    }
  }

  render() {
    if (!this.props.clientId) {
      return (
        <div>
          <div className="not-found-title">404 Games Not Found</div>
          <Link to="/">Return to home page.</Link>
        </div>
      );
    } else {
      return (
        <div className="games-page-container">
          <p className="page-title">Available Games</p>
          <div className="games-page-content">
            <button
              className="create-game-button"
              onClick={this.handleCreateGameButton.bind(this)}
            >
              Create game
            </button>
            <div className="games-list">
              <div className="games-list-header">
                <p className="games-list-header-item">Name</p>
                <p className="games-list-header-item">Players</p>
                <p className="games-list-header-item"></p>
              </div>
              {this.props.games.map((g: Game) => (
                <GameItem key={g._id} game={g} />
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  clientId: state.clientId,
  games: state.games,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    createGame: (game: CreateGameRequest) => dispatch(createGameBegin(game)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GamesPage);
