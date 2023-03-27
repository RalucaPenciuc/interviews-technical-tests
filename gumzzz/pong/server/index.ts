import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import guid from "./src/utils/generateID";
import Game from "./src/models/Game";
import GameTablePlayer from "./src/models/GameTablePlayer";
import Ball from "./src/models/Ball";

const port = process.env.PORT || 3001;
const clients: Map<string, WebSocket> = new Map();
const games: Map<string, Game> = new Map();
const framePerSecond: number = 50;
const canvas = {
  width: 1400,
  height: 700,
};
const paddle = {
  width: 15,
  height: 150,
};

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("New client. Clients: " + wss.clients.size);

  ws.on("close", () => {
    console.log("Client left. Clients: " + wss.clients.size);
  });

  ws.on("message", (message: string) => {
    try {
      const result = JSON.parse(message);
      switch (result.method) {
        case "connect": {
          handleConnectMessage(ws);
          break;
        }
        case "create": {
          handleCreateMessage(ws, result.data);
          break;
        }
        case "join": {
          handleJoinMessage(ws, result.data);
          break;
        }
        case "start": {
          handleStartMessage(ws, result.data);
          break;
        }
        case "movement": {
          handleMovementMessage(ws, result.data);
          break;
        }
        default:
          console.log("Invalid method");
      }
    } catch (err) {
      console.log(err.message);
    }
  });
});

server.listen(port, () => console.log(`Server started on port ${port} :)`));

function handleConnectMessage(client: WebSocket): void {
  console.log("Connecting a new client...");

  let newConnection: boolean = true;
  let clientIdResponse: string = "";
  clients.forEach((clientWS: WebSocket, clientId: string) => {
    if (clientWS === client) {
      newConnection = false;
      clientIdResponse = clientId;
    }
  });

  if (newConnection) {
    clientIdResponse = guid();
    clients.set(clientIdResponse, client);
  }

  client.send(
    JSON.stringify({
      method: "connect",
      data: {
        clientId: clientIdResponse,
        games: getGamesArray(),
      },
    })
  );
}

function handleCreateMessage(client: WebSocket, requestData: any): void {
  console.log("Creating a new game...");

  const gameIdResponse: string = guid();
  const gameAdded: Game = {
    _id: gameIdResponse,
    name: requestData.gameName,
    players: [],
    ball: {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 20,
      speed: 7,
      velocityX: 5,
      velocityY: 5,
    },
  };
  games.set(gameIdResponse, gameAdded);

  broadcast({
    method: "create",
    data: {
      game: gameAdded,
    },
  });
}

function handleJoinMessage(client: WebSocket, requestData: any): void {
  console.log("Joining the game...");

  const gameToJoin: Game | undefined = games.get(requestData.gameId);
  if (gameToJoin) {
    if (gameToJoin.players.length === 0) {
      const player: GameTablePlayer = {
        _id: requestData.clientId,
        x: 0 + 5,
        y: canvas.height / 2 - 150 / 2,
        score: 0,
      };
      gameToJoin.players.push(player);
    } else {
      const player: GameTablePlayer = {
        _id: requestData.clientId,
        x: canvas.width - 15 - 5,
        y: canvas.height / 2 - 150 / 2,
        score: 0,
      };
      gameToJoin.players.push(player);
    }
    games.set(requestData.gameId, gameToJoin);
    broadcast({
      method: "join",
      data: {
        game: gameToJoin,
      },
    });
  }
}

function handleStartMessage(client: WebSocket, requestData: any): void {
  console.log("Starting the game...");

  const gameToStart: Game | undefined = games.get(requestData);
  if (gameToStart) {
    gameToStart.players.forEach((player: GameTablePlayer) => {
      const playerWS: WebSocket | undefined = clients.get(player._id);
      if (playerWS) {
        playerWS.send(
          JSON.stringify({
            method: "start",
            data: {},
          })
        );
        setInterval(function () {
          const gameToSend = updateGameTable(gameToStart, player);
          playerWS.send(
            JSON.stringify({
              method: "update",
              data: {
                game: gameToSend,
              },
            })
          );
        }, 1000 / framePerSecond);
      }
    });
  }
}

function handleMovementMessage(client: WebSocket, requestData: any) {
  const game: Game | undefined = games.get(requestData.gameId);
  if (game) {
    if (upButtonPressed(requestData.direction)) {
      game.players.map((player: GameTablePlayer) => {
        if (player._id === requestData.clientId) {
          if (player.y - 30 > 0) {
            player.y -= 30;
          }
        }
        return player;
      });
    } else if (downButtonPressed(requestData.direction)) {
      game.players.map((player: GameTablePlayer) => {
        if (player._id === requestData.clientId) {
          if (player.y + paddle.height + 30 < canvas.height) {
            player.y += 30;
          }
        }
        return player;
      });
    }
  }
}

function updateGameTable(activeGame: Game, activePlayer: GameTablePlayer): Game {
  let activeIndex = 1;
  let opponentIndex = 0;
  if (activeGame.players[0]._id === activePlayer._id) {
    activeIndex = 0;
    opponentIndex = 1;
  }

  if (activePlayer.x === 5) { // active player is on the left
    if (activeGame.ball.x - activeGame.ball.radius < 0) { // ball goes to left
      activeGame.players[activeIndex].score++;
      activeGame = resetBall(activeGame); 
    } else if (activeGame.ball.x + activeGame.ball.radius > canvas.width) { // ball goes to right
      activeGame.players[opponentIndex].score++;
      activeGame = resetBall(activeGame); 
    }
  } else if (activePlayer.x === canvas.width - 15 - 5) { // active player is on the right
    if (activeGame.ball.x - activeGame.ball.radius < 0) {
      activeGame.players[opponentIndex].score++;
      activeGame = resetBall(activeGame); 
    } else if (activeGame.ball.x + activeGame.ball.radius > canvas.width) {
      activeGame.players[activeIndex].score++;
      activeGame = resetBall(activeGame); 
    }
  }

  // the ball has a velocity
  activeGame.ball.x += activeGame.ball.velocityX;
  activeGame.ball.y += activeGame.ball.velocityY;

  // when the ball collides with bottom and top walls we inverse the y velocity.
  if (activeGame.ball.y - activeGame.ball.radius < 0 || activeGame.ball.y + activeGame.ball.radius > canvas.height) {
    activeGame.ball.velocityY = -activeGame.ball.velocityY;
  }

  // we check if the paddle hit the player or the opponent paddle
  let activePaddle: GameTablePlayer = activeGame.ball.x + activeGame.ball.radius < canvas.width / 2 ? activePlayer : activeGame.players[opponentIndex];

  // if the ball hits a paddle
  if (collision(activeGame.ball, activePaddle)) {
    let collidePoint = activeGame.ball.y - (activePaddle.y + paddle.height / 2);
    collidePoint = collidePoint / (paddle.height / 2);

    let angleRad = (Math.PI / 4) * collidePoint;
    let direction = activeGame.ball.x + activeGame.ball.radius < canvas.width / 2 ? 1 : -1;
    activeGame.ball.velocityX = direction * activeGame.ball.speed * Math.cos(angleRad);
    activeGame.ball.velocityY = activeGame.ball.speed * Math.sin(angleRad);
    activeGame.ball.speed += 0.1;
  }

  return activeGame;
}

function resetBall(activeGame: Game): Game {
  activeGame.ball.x = canvas.width / 2;
  activeGame.ball.y = canvas.height / 2;
  activeGame.ball.velocityX = -activeGame.ball.velocityX;
  activeGame.ball.speed = 7;
  return activeGame;
}

function collision(ball: Ball, player: GameTablePlayer): boolean {
  const playerTop = player.y;
  const playerBottom = player.y + paddle.height;
  const playerLeft = player.x;
  const playerRight = player.x + paddle.width;

  const ballTop = ball.y - ball.radius;
  const ballBottom = ball.y + ball.radius;
  const ballLeft = ball.x - ball.radius;
  const ballRight = ball.x + ball.radius;
  return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
}

function getGamesArray(): Game[] {
  return Array.from(games.values());
}

function upButtonPressed(key: string): boolean {
  return (key === "w" || key === "W" || key === "ArrowUp");
}

function downButtonPressed(key: string): boolean {
  return (key === "s" || key === "S" || key === "ArrowDown");
}

function broadcast(data: any) {
  clients.forEach((clientWS: WebSocket, clientId: string) => {
    if (clientWS.readyState === WebSocket.OPEN) {
      clientWS.send(JSON.stringify(data));
    }
  });
}
