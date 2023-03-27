import createSagaMiddleware, { SagaMiddleware } from "@redux-saga/core";
import AppState from "./store";
import { Store, createStore, applyMiddleware } from "redux";
import gamesReducer from "../reducers/gameReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import configureSocket from "../../sockets/configure-socket";
import { generalSaga } from "../sagas/Saga";

const sagaMiddleware: SagaMiddleware<AppState> = createSagaMiddleware();

export default function configureStore() {
  const store: Store<AppState> = createStore(
    gamesReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );

  const socket = configureSocket(store.dispatch);

  sagaMiddleware.run(generalSaga, { socket });

  return store;
}
