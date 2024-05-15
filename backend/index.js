"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uniqid_1 = __importDefault(require("uniqid"));
const game_service_1 = __importDefault(require("./services/game.service"));
const app = (0, express_1.default)();
const http = require("http").Server(app);
const io = require("socket.io")(http);
// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------
let games = [];
let queue = [];
const botSocket = {
  id: "bot",
  emit: (event, data) => {
    console.log(`Bot received event ${event} with data`, data);
  },
  on: (event, callback) => {
    console.log(`Bot is set to listen for event ${event}`);
  },
};

// ------------------------------------
// -------- EMITTER METHODS -----------
// ------------------------------------
const updateClientsViewTimers = (game) => {
  game.player1Socket.emit(
    "game.timer",
    game_service_1.default.send.forPlayer.gameTimer("player:1", game.gameState)
  );
  game.player2Socket.emit(
    "game.timer",
    game_service_1.default.send.forPlayer.gameTimer("player:2", game.gameState)
  );
};
const updateClientsViewDecks = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
      "game.deck.view-state",
      game_service_1.default.send.forPlayer.deckViewState(
        "player:1",
        game.gameState
      )
    );
    game.player2Socket.emit(
      "game.deck.view-state",
      game_service_1.default.send.forPlayer.deckViewState(
        "player:2",
        game.gameState
      )
    );
  }, 200);
};
const updateClientsViewChoices = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
      "game.choices.view-state",
      game_service_1.default.send.forPlayer.choicesViewState(
        "player:1",
        game.gameState
      )
    );
    game.player2Socket.emit(
      "game.choices.view-state",
      game_service_1.default.send.forPlayer.choicesViewState(
        "player:2",
        game.gameState
      )
    );
  }, 200);
};
const updateClientsViewGrid = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
      "game.grid.view-state",
      game_service_1.default.send.forPlayer.gridViewState(
        "player:1",
        game.gameState
      )
    );
    game.player2Socket.emit(
      "game.grid.view-state",
      game_service_1.default.send.forPlayer.gridViewState(
        "player:2",
        game.gameState
      )
    );
  }, 200);
};
// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------
const createGame = (player1Socket, player2Socket) => {
  const newGame = game_service_1.default.init.gameState();
  newGame["idGame"] = (0, uniqid_1.default)();
  newGame["player1Socket"] = player1Socket;
  newGame["player2Socket"] = player2Socket || botSocket;
  newGame["isBotGame"] = !player2Socket;
  games.push(newGame);
  const gameIndex = game_service_1.default.utils.findGameIndexById(
    games,
    newGame.idGame
  );

  games[gameIndex].player1Socket.emit(
    "game.start",
    game_service_1.default.send.forPlayer.viewGameState(
      "player:1",
      games[gameIndex]
    )
  );
  if (player2Socket) {
    games[gameIndex].player2Socket.emit(
      "game.start",
      game_service_1.default.send.forPlayer.viewGameState(
        "player:2",
        games[gameIndex]
      )
    );
  }
  updateClientsViewTimers(games[gameIndex]);
  updateClientsViewDecks(games[gameIndex]);
  updateClientsViewGrid(games[gameIndex]);

  const gameInterval = setInterval(() => {
    games[gameIndex].gameState.timer--;
    updateClientsViewTimers(games[gameIndex]);
    if (games[gameIndex].gameState.timer === 0) {
      games[gameIndex].gameState.currentTurn =
        games[gameIndex].gameState.currentTurn === "player:1"
          ? "player:2"
          : "player:1";
      games[gameIndex].gameState.timer =
        game_service_1.default.timer.getTurnDuration();
      games[gameIndex].gameState.deck = game_service_1.default.init.deck();
      games[gameIndex].gameState.choices =
        game_service_1.default.init.choices();
      games[gameIndex].gameState.grid =
        game_service_1.default.grid.resetcanBeCheckedCells(
          games[gameIndex].gameState.grid
        );
      updateClientsViewTimers(games[gameIndex]);
      updateClientsViewDecks(games[gameIndex]);
      updateClientsViewChoices(games[gameIndex]);
      updateClientsViewGrid(games[gameIndex]);

      if (
        games[gameIndex].isBotGame &&
        games[gameIndex].gameState.currentTurn === "player:2"
      ) {
        performBotAction(games[gameIndex]);
      }
    }
  }, 1000);

  player1Socket.on("disconnect", () => {
    clearInterval(gameInterval);
  });
  if (player2Socket) {
    player2Socket.on("disconnect", () => {
      clearInterval(gameInterval);
    });
  }
};
// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------
io.on("connection", (socket) => {
  console.log(`[${socket.id}] socket connected`);
  socket.on("queue.join", () => {
    console.log(`[${socket.id}] new player in queue `);
    newPlayerInQueue(socket);
  });
  socket.on("game.dices.roll", () => {
    const gameIndex = game_service_1.default.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    // if not last throw
    if (
      games[gameIndex].gameState.deck.rollsCounter <
      games[gameIndex].gameState.deck.rollsMaximum
    ) {
      // dices management
      games[gameIndex].gameState.deck.dices = game_service_1.default.dices.roll(
        games[gameIndex].gameState.deck.dices
      );
      games[gameIndex].gameState.deck.rollsCounter++;
    }
    // if last throw
    else {
      // dices management
      games[gameIndex].gameState.deck.dices = game_service_1.default.dices.roll(
        games[gameIndex].gameState.deck.dices
      );
      games[gameIndex].gameState.deck.rollsCounter++;
      games[gameIndex].gameState.deck.dices =
        game_service_1.default.dices.lockEveryDice(
          games[gameIndex].gameState.deck.dices
        );
      // temporary put timer at 5 sec to test turn switching
      games[gameIndex].gameState.timer = 5;
    }
    // combinations management
    const dices = games[gameIndex].gameState.deck.dices;
    const isDefi = false;
    const isSec = games[gameIndex].gameState.deck.rollsCounter === 2;
    const combinations = game_service_1.default.choices.findCombinations(
      dices,
      isDefi,
      isSec
    );
    games[gameIndex].gameState.choices.availableChoices = combinations;
    // emit to views new state
    updateClientsViewDecks(games[gameIndex]);
    updateClientsViewChoices(games[gameIndex]);
  });
  socket.on("game.dices.lock", (idDice) => {
    const gameIndex = game_service_1.default.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    const indexDice = game_service_1.default.utils.findDiceIndexByDiceId(
      games[gameIndex].gameState.deck.dices,
      idDice
    );
    // reverse flag 'locked'
    games[gameIndex].gameState.deck.dices[indexDice].locked =
      !games[gameIndex].gameState.deck.dices[indexDice].locked;
    updateClientsViewDecks(games[gameIndex]);
  });
  socket.on("game.choices.selected", (data) => {
    // gestion des choix
    const gameIndex = game_service_1.default.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    games[gameIndex].gameState.choices.idSelectedChoice = data.choiceId;
    // gestion de la grid
    games[gameIndex].gameState.grid =
      game_service_1.default.grid.resetcanBeCheckedCells(
        games[gameIndex].gameState.grid
      );
    games[gameIndex].gameState.grid =
      game_service_1.default.grid.updateGridAfterSelectingChoice(
        data.choiceId,
        games[gameIndex].gameState.grid
      );
    updateClientsViewChoices(games[gameIndex]);
    updateClientsViewGrid(games[gameIndex]);
  });
  socket.on("game.grid.selected", (data) => {
    const gameIndex = game_service_1.default.utils.findGameIndexBySocketId(
      games,
      socket.id
    );
    games[gameIndex].gameState.grid =
      game_service_1.default.grid.resetcanBeCheckedCells(
        games[gameIndex].gameState.grid
      );
    games[gameIndex].gameState.grid = game_service_1.default.grid.selectCell(
      data.cellId,
      data.rowIndex,
      data.cellIndex,
      games[gameIndex].gameState.currentTurn,
      games[gameIndex].gameState.grid
    );
    games[gameIndex].gameState = game_service_1.default.utils.decrementTiles(
      games[gameIndex].gameState
    );
    // Here calcul score
    let { playerScores, winner } =
      game_service_1.default.utils.calculateScoreAndWinner(
        games[gameIndex].gameState.grid
      );

    // Si aucun winner n'est encore désigné checker si un des 2 joueurs n'a plus de tiles
    if (winner === null) {
      winner = game_service_1.default.utils.checkWinnerWithOutOfTiles(
        games[gameIndex].gameState
      );
    } else {
      // Si un winner est désigné, on envoi un message pour le notifier
      games[gameIndex].player1Socket.emit("game.end", winner === "player:1");
      games[gameIndex].player2Socket.emit("game.end", winner === "player:2");
    }

    console.log(
      "scores des joueurs : ",
      playerScores,
      playerScores["'1'"],
      playerScores["1"],
      playerScores[`'1'`]
    );
    console.log("gagnant : ", winner);
    ``;
    games[gameIndex].gameState.player1Score = playerScores["1"];
    games[gameIndex].gameState.player2Score = playerScores["2"];
    games[gameIndex].player1Socket.emit(
      "game.score",
      game_service_1.default.send.forPlayer.gameScore(
        "player:1",
        games[gameIndex].gameState
      )
    );
    games[gameIndex].player2Socket.emit(
      "game.score",
      game_service_1.default.send.forPlayer.gameScore(
        "player:2",
        games[gameIndex].gameState
      )
    );
    games[gameIndex].gameState.currentTurn =
      games[gameIndex].gameState.currentTurn === "player:1"
        ? "player:2"
        : "player:1";
    games[gameIndex].gameState.timer =
      game_service_1.default.timer.getTurnDuration();
    games[gameIndex].gameState.deck = game_service_1.default.init.deck();
    games[gameIndex].gameState.choices = game_service_1.default.init.choices();
    games[gameIndex].player1Socket.emit(
      "game.timer",
      game_service_1.default.send.forPlayer.gameTimer(
        "player:1",
        games[gameIndex].gameState
      )
    );
    games[gameIndex].player2Socket.emit(
      "game.timer",
      game_service_1.default.send.forPlayer.gameTimer(
        "player:2",
        games[gameIndex].gameState
      )
    );
    updateClientsViewDecks(games[gameIndex]);
    updateClientsViewChoices(games[gameIndex]);
    updateClientsViewGrid(games[gameIndex]);
  });
  socket.on("disconnect", (reason) => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});

const performBotAction = (game) => {
  // Le bot effectue une action après un délai
  setTimeout(() => {
    // Simule un lancer de dés
    io.emit("game.dices.roll", { id: "bot" });
  }, 2000);
};

// Mise à jour de la file d'attente pour gérer un seul joueur et un bot
const newPlayerInQueue = (socket) => {
  queue.push(socket);
  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket);
  } else {
    socket.emit(
      "queue.added",
      game_service_1.default.send.forPlayer.viewQueueState()
    );
    // Créer un jeu avec un bot après un délai
    setTimeout(() => {
      if (queue.length === 1) {
        const player1Socket = queue.shift();
        createGame(player1Socket, null); // Null pour le bot
      }
    }, 5000); // 5 secondes d'attente avant de créer une partie avec un bot
  }
};
// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------
app.get("/", (req, res) => res.sendFile("index.html"));
http.listen(3000, function () {
  console.log("listening on *:3000");
});
