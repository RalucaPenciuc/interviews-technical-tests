import React, { Component } from "react";
import { Game } from "../models/Game";
import "../assets/scss/GameItem.scss";
import { connect } from "react-redux";
import AppState from "../redux/store/store";
import { JoinGameRequest } from "../models/Requests";
import { joinGameBegin } from "../redux/actions/actions";
import { Link } from "react-router-dom";

interface IProps {
  clientId: string;
  joinGame: Function;
  game: Game;
}

interface IState {}

class GameItem extends Component<IProps, IState> {
  handleJoinButton() {
    const data: JoinGameRequest = {
      clientId: this.props.clientId,
      gameId: this.props.game._id,
    };
    this.props.joinGame(data);
  }

  render() {
    return (
      <div className="game-item-container">
        <p className="game-item-component">{this.props.game.name}</p>
        <p className="game-item-component">{this.props.game.players.length}</p>
        <Link
          to={`/game/${this.props.game._id}`}
          onClick={this.handleJoinButton.bind(this)}
        >
          Join
        </Link>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    clientId: state.clientId,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    joinGame: (data: JoinGameRequest) => dispatch(joinGameBegin(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameItem);
