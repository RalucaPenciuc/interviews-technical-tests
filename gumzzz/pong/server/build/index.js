"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http = __importStar(require("http"));
var WebSocket = __importStar(require("ws"));
var generateID_1 = __importDefault(require("./src/utils/generateID"));
var port = process.env.PORT || 3001;
var clients = new Map();
var games = new Map();
var framePerSecond = 50;
var canvas = {
    width: 1400,
    height: 700,
};
var paddle = {
    width: 15,
    height: 150,
};
var app = express_1.default();
var server = http.createServer(app);
var wss = new WebSocket.Server({ server: server });
wss.on("connection", function (ws) {
    console.log("New client. Clients: " + wss.clients.size);
    ws.on("close", function () {
        console.log("Client left. Clients: " + wss.clients.size);
    });
    ws.on("message", function (message) {
        try {
            var result = JSON.parse(message);
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
        }
        catch (err) {
            console.log(err.message);
        }
    });
});
server.listen(port, function () { return console.log("Server started on port " + port + " :)"); });
function handleConnectMessage(client) {
    console.log("Connecting a new client...");
    var newConnection = true;
    var clientIdResponse = "";
    clients.forEach(function (clientWS, clientId) {
        if (clientWS === client) {
            newConnection = false;
            clientIdResponse = clientId;
        }
    });
    if (newConnection) {
        clientIdResponse = generateID_1.default();
        clients.set(clientIdResponse, client);
    }
    client.send(JSON.stringify({
        method: "connect",
        data: {
            clientId: clientIdResponse,
            games: getGamesArray(),
        },
    }));
}
function handleCreateMessage(client, requestData) {
    console.log("Creating a new game...");
    var gameIdResponse = generateID_1.default();
    var gameAdded = {
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
function handleJoinMessage(client, requestData) {
    console.log("Joining the game...");
    var gameToJoin = games.get(requestData.gameId);
    if (gameToJoin) {
        if (gameToJoin.players.length === 0) {
            var player = {
                _id: requestData.clientId,
                x: 0 + 5,
                y: canvas.height / 2 - 150 / 2,
                score: 0,
            };
            gameToJoin.players.push(player);
        }
        else {
            var player = {
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
function handleStartMessage(client, requestData) {
    console.log("Starting the game...");
    var gameToStart = games.get(requestData);
    if (gameToStart) {
        gameToStart.players.forEach(function (player) {
            var playerWS = clients.get(player._id);
            if (playerWS) {
                playerWS.send(JSON.stringify({
                    method: "start",
                    data: {},
                }));
                setInterval(function () {
                    var gameToSend = updateGameTable(gameToStart, player);
                    playerWS.send(JSON.stringify({
                        method: "update",
                        data: {
                            game: gameToSend,
                        },
                    }));
                }, 1000 / framePerSecond);
            }
        });
    }
}
function handleMovementMessage(client, requestData) {
    var game = games.get(requestData.gameId);
    if (game) {
        if (upButtonPressed(requestData.direction)) {
            game.players.map(function (player) {
                if (player._id === requestData.clientId) {
                    if (player.y - 30 > 0) {
                        player.y -= 30;
                    }
                }
                return player;
            });
        }
        else if (downButtonPressed(requestData.direction)) {
            game.players.map(function (player) {
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
function updateGameTable(activeGame, activePlayer) {
    var activeIndex = 1;
    var opponentIndex = 0;
    if (activeGame.players[0]._id === activePlayer._id) {
        activeIndex = 0;
        opponentIndex = 1;
    }
    if (activePlayer.x === 5) { // active player is on the left
        if (activeGame.ball.x - activeGame.ball.radius < 0) { // ball goes to left
            activeGame.players[activeIndex].score++;
            activeGame = resetBall(activeGame);
        }
        else if (activeGame.ball.x + activeGame.ball.radius > canvas.width) { // ball goes to right
            activeGame.players[opponentIndex].score++;
            activeGame = resetBall(activeGame);
        }
    }
    else if (activePlayer.x === canvas.width - 15 - 5) { // active player is on the right
        if (activeGame.ball.x - activeGame.ball.radius < 0) {
            activeGame.players[opponentIndex].score++;
            activeGame = resetBall(activeGame);
        }
        else if (activeGame.ball.x + activeGame.ball.radius > canvas.width) {
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
    var activePaddle = activeGame.ball.x + activeGame.ball.radius < canvas.width / 2 ? activePlayer : activeGame.players[opponentIndex];
    // if the ball hits a paddle
    if (collision(activeGame.ball, activePaddle)) {
        var collidePoint = activeGame.ball.y - (activePaddle.y + paddle.height / 2);
        collidePoint = collidePoint / (paddle.height / 2);
        var angleRad = (Math.PI / 4) * collidePoint;
        var direction = activeGame.ball.x + activeGame.ball.radius < canvas.width / 2 ? 1 : -1;
        activeGame.ball.velocityX = direction * activeGame.ball.speed * Math.cos(angleRad);
        activeGame.ball.velocityY = activeGame.ball.speed * Math.sin(angleRad);
        activeGame.ball.speed += 0.1;
    }
    return activeGame;
}
function resetBall(activeGame) {
    activeGame.ball.x = canvas.width / 2;
    activeGame.ball.y = canvas.height / 2;
    activeGame.ball.velocityX = -activeGame.ball.velocityX;
    activeGame.ball.speed = 7;
    return activeGame;
}
function collision(ball, player) {
    var playerTop = player.y;
    var playerBottom = player.y + paddle.height;
    var playerLeft = player.x;
    var playerRight = player.x + paddle.width;
    var ballTop = ball.y - ball.radius;
    var ballBottom = ball.y + ball.radius;
    var ballLeft = ball.x - ball.radius;
    var ballRight = ball.x + ball.radius;
    return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
}
function getGamesArray() {
    return Array.from(games.values());
}
function upButtonPressed(key) {
    return (key === "w" || key === "W" || key === "ArrowUp");
}
function downButtonPressed(key) {
    return (key === "s" || key === "S" || key === "ArrowDown");
}
function broadcast(data) {
    clients.forEach(function (clientWS, clientId) {
        if (clientWS.readyState === WebSocket.OPEN) {
            clientWS.send(JSON.stringify(data));
        }
    });
}
