import React, { Component } from "react";
import "./assets/scss/App.scss";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/Routes";

export default class App extends Component {
  render() {
    return (
      <div className="app-container">
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </div>
    );
  }
}
