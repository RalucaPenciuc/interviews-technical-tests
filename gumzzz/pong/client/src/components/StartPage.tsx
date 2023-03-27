import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../assets/scss/StartPage.scss";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import { connect } from "react-redux";
import { connectPlayerBegin } from "../redux/actions/actions";

interface IProps {
  connectPlayer: Function;
}

class StartPage extends Component<IProps, {}> {
  render() {
    return (
      <div className="start-page-container">
        <p className="game-title">PONG</p>
        <div className="play-button-view">
          <ArrowForwardIosRoundedIcon />
          <Link
            className="play-button"
            to="/games"
            onClick={() => {
              this.props.connectPlayer();
            }}
          >
            Play
          </Link>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    connectPlayer: () => dispatch(connectPlayerBegin()),
  };
};

export default connect(null, mapDispatchToProps)(StartPage);
