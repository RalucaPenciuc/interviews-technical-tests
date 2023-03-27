import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import StartPage from "../components/StartPage";
import GamesPage from "../components/GamesPage";
import GameTable from "../components/GameTable";
import GameLobby from "../components/GameLobby";

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={StartPage} />
        <Route exact path="/games" component={GamesPage} />
        <Route exact path="/game/:id" component={GameLobby} />
        <Route exact path="/game/:id/start" component={GameTable} />
      </Switch>
    );
  }
}
