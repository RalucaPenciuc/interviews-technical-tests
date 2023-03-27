import React, { Component } from "react";
import "../assets/scss/GameTable.scss";
import { Game } from "../models/Game";
import { connect } from "react-redux";
import AppState from "../redux/store/store";
import { Link } from "react-router-dom";
import { registerMove } from "../redux/actions/actions";
import { RegisterMoveRequest } from "../models/Requests";

interface IProps {
  clientId: string;
  currentGame: Game | undefined;
  registerMove: Function;
}

interface IState {}

class GameTable extends Component<IProps, IState> {
  private canvas: React.RefObject<HTMLCanvasElement>;
  private gameContext: CanvasRenderingContext2D | null;

  constructor(props: any) {
    super(props);

    this.canvas = React.createRef();
    this.gameContext = null;
  }

  componentDidMount() {
    if (this.canvas.current) {
      this.gameContext = this.canvas.current.getContext("2d");
      this.drawGameTable();  
    } else console.log("componentDidMount: Canvas is null.");
  }

  componentDidUpdate() {
    this.drawGameTable();
  }

  handleKeyDownEvent(e: React.KeyboardEvent) {
    if (this.canvas.current) {
      let dataRequest: RegisterMoveRequest = {
        clientId: this.props.clientId,
        gameId: this.props.currentGame?._id,
        direction: e.key,
      };
      this.props.registerMove(dataRequest);
    } else console.log("handleKeyDownEvent: Canvas is null.");
  }

  render() {
    if (!this.props.currentGame) {
      return (
        <>
          <div className="not-found-title">404 Game Not Found</div>
          <Link to="/">Return to home page.</Link>
        </>
      );
    } else {
      return (
        <div className="game-table-container">
          <canvas
            ref={this.canvas}
            width={1400}
            height={700}
            className="canvas"
            onKeyDown={this.handleKeyDownEvent.bind(this)}
            tabIndex={0}
          />
        </div>
      );
    }
  }

  drawGameTable(): void {
    if (this.canvas.current) {
      const player =
        this.props.currentGame?.players[0]._id === this.props.clientId
          ? this.props.currentGame.players[0]
          : this.props.currentGame?.players[1];
      const opponent =
        this.props.currentGame?.players[0]._id !== this.props.clientId
          ? this.props.currentGame?.players[0]
          : this.props.currentGame.players[1];
      const ball = this.props.currentGame?.ball;

      if (player && opponent && ball) {
        // clear the canvas
        this.drawRectangle(0, 0, this.canvas.current.width, this.canvas.current.height, "black");

        // draw the score
        this.drawText(this.canvas.current.width / 5, this.canvas.current.height / 8, player.score.toString(), "white");
        this.drawText((4 * this.canvas.current.width) / 5, this.canvas.current.height / 8, opponent.score.toString(), "white");

        // draw the divider
        this.drawRectangle(this.canvas.current.width / 2 - 2 / 2, 0, 2, this.canvas.current.height, "white");

        // draw the players
        this.drawRectangle(player.x, player.y, 15, 150, "white");
        this.drawRectangle(opponent.x, opponent.y, 15, 150, "white");

        // draw the ball
        this.drawCircle(ball.x, ball.y, ball.radius, "white");
      } else console.log("drawGameTable: state elements are null.");
    } else console.log("drawGameTable: Canvas is null.");
  }

  drawText(x: number, y: number, text: string, color: string): void {
    if (this.gameContext) {
      this.gameContext.fillStyle = color;
      this.gameContext.font = "50px cursive";
      this.gameContext.fillText(text, x, y);
    } else console.log("drawText: Context is null.");
  }

  drawRectangle(x: number, y: number, width: number, height: number, color: string): void {
    if (this.gameContext) {
      this.gameContext.fillStyle = color;
      this.gameContext.fillRect(x, y, width, height);
    } else console.log("drawRectangle: Context is null.");
  }

  drawCircle(x: number, y: number, radius: number, color: string): void {
    if (this.gameContext) {
      this.gameContext.fillStyle = color;
      this.gameContext.beginPath();
      this.gameContext.arc(x, y, radius, 0, Math.PI * 2, false);
      this.gameContext.closePath();
      this.gameContext.fill();
    } else console.log("drawCircle: Context is null.");
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    clientId: state.clientId,
    currentGame: state.currentGame,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    registerMove: (data: RegisterMoveRequest) => dispatch(registerMove(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameTable);
