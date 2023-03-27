import React, { Component } from "react";
import "../assets/scss/GameLobby.scss";
import { connect } from "react-redux";
import AppState from "../redux/store/store";
import { Game } from "../models/Game";
import { Link, Redirect } from "react-router-dom";
import { startGame } from "../redux/actions/actions";

interface IProps {
  loading: boolean;
  currentGame: Game | undefined;
  redirect: boolean;
  startGame: Function;
  //   leaveLobby: Function;
}

class GameLobby extends Component<IProps, {}> {
  handleStartButton() {
    this.props.startGame(this.props.currentGame?._id);
  }

  handleLeaveButton() {
    // this.props.leaveLobby();
  }

  render() {
    if (!this.props.currentGame) {
      return (
        <div>
          <div className="not-found-title">404 Game Not Found</div>
          <Link to="/">Return to home page.</Link>
        </div>
      );
    } else if (this.props.redirect) {
      return <Redirect to={`/game/${this.props.currentGame._id}/start`} />;
    } else {
      return (
        <div className="game-lobby-container">
          <div className="game-lobby-title">
            {this.props.currentGame.name}:{"   "}
            {this.props.currentGame.players.length} out of 2 players
          </div>
          <div className="game-lobby-players">
            <div className="player">
              {this.props.currentGame.players[0]
                ? this.props.currentGame.players[0]._id
                : ""}
            </div>
            <div className="player">
              {this.props.currentGame.players[1]
                ? this.props.currentGame.players[1]._id
                : ""}
            </div>
          </div>
          <div className="game-lobby-actions">
            <Link
              className={
                this.props.currentGame.players.length < 2
                  ? "start-game-disabled"
                  : "start-game-enabled"
              }
              to={`/game/${this.props.currentGame._id}/start`}
              onClick={this.handleStartButton.bind(this)}
            >
              Start game
            </Link>
            <button onClick={this.handleLeaveButton.bind(this)}>
              Leave lobby
            </button>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    loading: state.loading,
    currentGame: state.currentGame,
    redirect: state.redirectGameTable,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    startGame: (gameId: string) => dispatch(startGame(gameId)),
    // leaveLobby: () => dispatch(leaveLobby()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameLobby);
