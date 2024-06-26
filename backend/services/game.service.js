"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Durée d'un tour en secondes
const TURN_DURATION = 30;
const DECK_INIT = {
  dices: [
    { id: 1, value: "", locked: true },
    { id: 2, value: "", locked: true },
    { id: 3, value: "", locked: true },
    { id: 4, value: "", locked: true },
    { id: 5, value: "", locked: true },
  ],
  rollsCounter: 1,
  rollsMaximum: 3,
};
const CHOICES_INIT = {
  isDefi: false,
  isSec: false,
  idSelectedChoice: null,
  availableChoices: [],
};
const GRID_INIT = [
  [
    { viewContent: "1", id: "brelan1", owner: null, canBeChecked: false },
    { viewContent: "3", id: "brelan3", owner: null, canBeChecked: false },
    { viewContent: "Défi", id: "defi", owner: null, canBeChecked: false },
    { viewContent: "4", id: "brelan4", owner: null, canBeChecked: false },
    { viewContent: "6", id: "brelan6", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "2", id: "brelan2", owner: null, canBeChecked: false },
    { viewContent: "Carré", id: "carre", owner: null, canBeChecked: false },
    { viewContent: "Sec", id: "sec", owner: null, canBeChecked: false },
    { viewContent: "Full", id: "full", owner: null, canBeChecked: false },
    { viewContent: "5", id: "brelan5", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "≤8", id: "moinshuit", owner: null, canBeChecked: false },
    { viewContent: "Full", id: "full", owner: null, canBeChecked: false },
    { viewContent: "Yam", id: "yam", owner: null, canBeChecked: false },
    { viewContent: "Défi", id: "defi", owner: null, canBeChecked: false },
    { viewContent: "Suite", id: "suite", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "6", id: "brelan6", owner: null, canBeChecked: false },
    { viewContent: "Sec", id: "sec", owner: null, canBeChecked: false },
    { viewContent: "Suite", id: "suite", owner: null, canBeChecked: false },
    { viewContent: "≤8", id: "moinshuit", owner: null, canBeChecked: false },
    { viewContent: "1", id: "brelan1", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "3", id: "brelan3", owner: null, canBeChecked: false },
    { viewContent: "2", id: "brelan2", owner: null, canBeChecked: false },
    { viewContent: "Carré", id: "carre", owner: null, canBeChecked: false },
    { viewContent: "5", id: "brelan5", owner: null, canBeChecked: false },
    { viewContent: "4", id: "brelan4", owner: null, canBeChecked: false },
  ],
];
const ALL_COMBINATIONS = [
  { value: "Brelan1", id: "brelan1" },
  { value: "Brelan2", id: "brelan2" },
  { value: "Brelan3", id: "brelan3" },
  { value: "Brelan4", id: "brelan4" },
  { value: "Brelan5", id: "brelan5" },
  { value: "Brelan6", id: "brelan6" },
  { value: "Full", id: "full" },
  { value: "Carré", id: "carre" },
  { value: "Yam", id: "yam" },
  { value: "Suite", id: "suite" },
  { value: "≤8", id: "moinshuit" },
  { value: "Sec", id: "sec" },
  { value: "Défi", id: "defi" },
];
const GAME_INIT = {
  gameState: {
    currentTurn: "player:1",
    timer: null,
    player1Score: 0,
    player1Tiles: 12,
    player2Score: 0,
    player2Tiles: 12,
  },
};
const GameService = {
  init: {
    gameState: () => {
      const game = Object.assign({}, GAME_INIT);
      game["gameState"]["timer"] = TURN_DURATION;
      game["gameState"]["deck"] = Object.assign({}, DECK_INIT);
      game["gameState"]["choices"] = Object.assign({}, CHOICES_INIT);
      game["gameState"]["grid"] = [...GRID_INIT];
      return game;
    },
    deck: () => {
      return Object.assign({}, DECK_INIT);
    },
    choices: () => {
      return Object.assign({}, CHOICES_INIT);
    },
    grid: () => {
      return [...GRID_INIT];
    },
  },
  send: {
    forPlayer: {
      viewGameState: (playerKey, game) => {
        return {
          inQueue: false,
          inGame: true,
          idPlayer:
            playerKey === "player:1"
              ? game.player1Socket.id
              : game.player2Socket.id,
          idOpponent:
            playerKey === "player:1"
              ? game.player2Socket.id
              : game.player1Socket.id,
        };
      },
      viewQueueState: () => {
        return {
          inQueue: true,
          inGame: false,
        };
      },
      gameTimer: (playerKey, gameState) => {
        const playerTimer =
          gameState.currentTurn === playerKey ? gameState.timer : 0;
        const opponentTimer =
          gameState.currentTurn === playerKey ? 0 : gameState.timer;
        return { playerTimer: playerTimer, opponentTimer: opponentTimer };
      },
      gameScore: (playerKey, gameState) => {
        const playerScore =
          gameState[playerKey === "player:1" ? "player1Score" : "player2Score"];
        const opponentScore =
          gameState[playerKey === "player:1" ? "player2Score" : "player1Score"];
        return {
          playerScore: playerScore !== undefined ? playerScore : 0,
          opponentScore: opponentScore !== undefined ? opponentScore : 0,
        };
      },
      deckViewState: (playerKey, gameState) => {
        const deckViewState = {
          displayPlayerDeck: gameState.currentTurn === playerKey,
          displayOpponentDeck: gameState.currentTurn !== playerKey,
          displayRollButton:
            gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
          rollsCounter: gameState.deck.rollsCounter,
          rollsMaximum: gameState.deck.rollsMaximum,
          dices: gameState.deck.dices,
        };
        return deckViewState;
      },
      choicesViewState: (playerKey, gameState) => {
        const choicesViewState = {
          displayChoices: true,
          canMakeChoice: playerKey === gameState.currentTurn,
          idSelectedChoice: gameState.choices.idSelectedChoice,
          availableChoices: gameState.choices.availableChoices,
        };
        return choicesViewState;
      },
      gridViewState: (playerKey, gameState) => {
        return {
          displayGrid: true,
          canSelectCells:
            playerKey === gameState.currentTurn &&
            gameState.choices.availableChoices.length > 0,
          grid: gameState.grid,
        };
      },
      finalState: (playerKey, winner) => {
        return playerKey === winner;
      },
    },
  },
  timer: {
    getTurnDuration: () => {
      return TURN_DURATION;
    },
  },
  score: {
    getCurrentScore: (playerKey, gameState) => {
      const grid = gameState.grid;
      let totalScore = 0;
      for (let y = 0; y < grid.length; y++) {
        const line = grid[y];
        let playerCaseCount = 0;
        for (let x = 0; x < line.length; x++) {
          line[x].owner === playerKey
            ? playerCaseCount++
            : (playerCaseCount = 0);
          if (playerCaseCount >= 3) {
            totalScore += 1;
          }
        }
      }
      return totalScore;
    },
  },
  dices: {
    roll: (dicesToRoll) => {
      const rolledDices = dicesToRoll.map((dice) => {
        if (dice.value === "") {
          // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
          const newValue = String(Math.floor(Math.random() * 6) + 1); // Convertir la valeur en chaîne de caractères
          return {
            id: dice.id,
            value: newValue,
            locked: false,
          };
        } else if (!dice.locked) {
          // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
          const newValue = String(Math.floor(Math.random() * 6) + 1);
          return Object.assign(Object.assign({}, dice), { value: newValue });
        } else {
          // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
          return dice;
        }
      });
      return rolledDices;
    },
    lockEveryDice: (dicesToLock) => {
      const lockedDices = dicesToLock.map((dice) =>
        Object.assign(Object.assign({}, dice), { locked: true })
      );
      return lockedDices;
    },
  },
  choices: {
    findCombinations: (dices, isDefi, isSec) => {
      const availableCombinations = [];
      const allCombinations = ALL_COMBINATIONS;
      const counts = Array(7).fill(0); // Tableau pour compter le nombre de dés de chaque valeur (de 1 à 6)
      let hasPair = false; // Pour vérifier si une paire est présente
      let threeOfAKindValue = null; // Stocker la valeur du brelan
      let hasThreeOfAKind = false; // Pour vérifier si un brelan est présent
      let hasFourOfAKind = false; // Pour vérifier si un carré est présent
      let hasFiveOfAKind = false; // Pour vérifier si un Yam est présent
      let hasStraight = false; // Pour vérifier si une suite est présente
      let sum = 0; // Somme des valeurs des dés
      // Compter le nombre de dés de chaque valeur et calculer la somme
      for (let i = 0; i < dices.length; i++) {
        const diceValue = parseInt(dices[i].value);
        counts[diceValue]++;
        sum += diceValue;
      }
      // Vérifier les combinaisons possibles
      for (let i = 1; i <= 6; i++) {
        if (counts[i] === 2) {
          hasPair = true;
        } else if (counts[i] === 3) {
          threeOfAKindValue = i;
          hasThreeOfAKind = true;
        } else if (counts[i] === 4) {
          threeOfAKindValue = i;
          hasThreeOfAKind = true;
          hasFourOfAKind = true;
        } else if (counts[i] === 5) {
          threeOfAKindValue = i;
          hasThreeOfAKind = true;
          hasFourOfAKind = true;
          hasFiveOfAKind = true;
        }
      }
      const sortedValues = dices
        .map((dice) => parseInt(dice.value))
        .sort((a, b) => a - b); // Trie les valeurs de dé
      // Vérifie si les valeurs triées forment une suite
      hasStraight = sortedValues.every(
        (value, index) => index === 0 || value === sortedValues[index - 1] + 1
      );
      // Vérifier si la somme ne dépasse pas 8
      const isLessThanEqual8 = sum <= 8;
      // Retourner les combinaisons possibles via leur ID
      allCombinations.forEach((combination) => {
        if (
          (combination.id.includes("brelan") &&
            hasThreeOfAKind &&
            parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
          (combination.id === "full" && hasPair && hasThreeOfAKind) ||
          (combination.id === "carre" && hasFourOfAKind) ||
          (combination.id === "yam" && hasFiveOfAKind) ||
          (combination.id === "suite" && hasStraight) ||
          (combination.id === "moinshuit" && isLessThanEqual8) ||
          (combination.id === "defi" && isDefi)
        ) {
          availableCombinations.push(combination);
        }
      });
      const notOnlyBrelan = availableCombinations.some(
        (combination) => !combination.id.includes("brelan")
      );
      if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
        availableCombinations.push(
          allCombinations.find((combination) => combination.id === "sec")
        );
      }
      return availableCombinations;
    },
  },
  grid: {
    resetcanBeCheckedCells: (grid) => {
      const updatedGrid = grid.map((row) =>
        row.map((cell) => {
          return Object.assign(Object.assign({}, cell), {
            canBeChecked: false,
          });
        })
      );
      return updatedGrid;
    },
    updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {
      const updatedGrid = grid.map((row) =>
        row.map((cell) => {
          if (cell.id === idSelectedChoice && cell.owner === null) {
            return Object.assign(Object.assign({}, cell), {
              canBeChecked: true,
            });
          } else {
            return cell;
          }
        })
      );
      return updatedGrid;
    },
    selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
      const updatedGrid = grid.map((row, rowIndexParsing) =>
        row.map((cell, cellIndexParsing) => {
          if (
            cell.id === idCell &&
            rowIndexParsing === rowIndex &&
            cellIndexParsing === cellIndex
          ) {
            return Object.assign(Object.assign({}, cell), {
              owner: currentTurn,
            });
          } else {
            return cell;
          }
        })
      );
      return updatedGrid;
    },
  },
  utils: {
    // Return game index in global games array by id
    findGameIndexById: (games, idGame) => {
      for (let i = 0; i < games.length; i++) {
        if (games[i].idGame === idGame) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
    },
    findGameIndexBySocketId: (games, socketId) => {
      for (let i = 0; i < games.length; i++) {
        if (
          games[i].player1Socket.id === socketId ||
          games[i].player2Socket.id === socketId
        ) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
    },
    findDiceIndexByDiceId: (dices, idDice) => {
      for (let i = 0; i < dices.length; i++) {
        if (dices[i].id === idDice) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
    },
    decrementTiles: (gameState) => {
      let tiles =
        gameState.currentTurn === "player:1"
          ? gameState.player1Tiles
          : gameState.player2Tiles;
      tiles -= 1;
      console.log("tiles : ", tiles);
      return gameState;
    },
    calculateScoreAndWinner: (grid) => {
      // Fonction pour vérifier si les pions sont alignés
      function checkPointsAlignment(points) {
        if (points.length < 3) return 0; // Pas assez de pions pour former une combinaison
        const owner = points[0].owner;
        if (owner === null) return 0; // La combinaison n'appartient à aucun joueur

        for (let i = 0; i < points.length; i++) {
          if (points[i].owner !== owner) {
            return 0; // La combinaison n'appartient pas entièrement à un joueur
          }
        }

        if (points.length === 5) return owner; // Une combinaison de 5 pions signifie la victoire
        return points.length === 4 ? 2 : 1; // 2 points pour une combinaison de 4 pions, 1 point pour une combinaison de 3 pions
      }

      let playerScores = {}; // Un objet pour stocker les scores de chaque joueur
      let winner = null; // Variable pour stocker l'ID du vainqueur

      // Vérification des lignes
      console.log("LIGNES");
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          for (let k = j; k < Math.min(j + 5, grid[i].length); k++) {
            const points = [];
            for (let l = j; l <= k; l++) {
              points.push(grid[i][l]);
            }
            console.log("points : ", points);
            const alignmentResult = checkPointsAlignment(points);
            console.log("alignmentResult : ", alignmentResult);
            if (alignmentResult > 0) {
              // Ajouter des points au score du joueur et vérifier s'il y a un vainqueur
              playerScores[alignmentResult] =
                (playerScores[alignmentResult] || 0) + alignmentResult;
              if (alignmentResult === 5) {
                winner = alignmentResult; // Affecter le vainqueur si une combinaison de 5 pions est trouvée
              }
            }
          }
        }
      }

      // Vérification des colonnes
      console.log("COLONNES");
      for (let j = 0; j < grid[0].length; j++) {
        for (let i = 0; i < grid.length; i++) {
          for (let k = i; k < Math.min(i + 5, grid.length); k++) {
            const points = [];
            for (let l = i; l <= k; l++) {
              points.push(grid[l][j]);
            }
            const alignmentResult = checkPointsAlignment(points);
            console.log("alignmentResult : ", alignmentResult);
            if (alignmentResult > 0) {
              playerScores[alignmentResult] =
                (playerScores[alignmentResult] || 0) + alignmentResult;
              if (alignmentResult === 5) {
                winner = alignmentResult;
              }
            }
          }
        }
      }

      // Vérification des diagonales (de haut en bas)
      console.log("DIAGONALES");
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          for (
            let k = 0;
            k < Math.min(grid.length - i, grid[i].length - j, 5);
            k++
          ) {
            const points = [];
            for (let l = 0; l <= k; l++) {
              points.push(grid[i + l][j + l]);
            }
            const alignmentResult = checkPointsAlignment(points);
            if (alignmentResult > 0) {
              playerScores[alignmentResult] =
                (playerScores[alignmentResult] || 0) + alignmentResult;
              if (alignmentResult === 5) {
                winner = alignmentResult;
              }
            }
          }
        }
      }

      // Vérification des diagonales (de bas en haut)
      for (let i = grid.length - 1; i >= 0; i--) {
        for (let j = 0; j < grid[i].length; j++) {
          for (let k = 0; k < Math.min(i + 1, grid[i].length - j, 5); k++) {
            const points = [];
            for (let l = 0; l <= k; l++) {
              points.push(grid[i - l][j + l]);
            }
            const alignmentResult = checkPointsAlignment(points);
            if (alignmentResult > 0) {
              playerScores[alignmentResult] =
                (playerScores[alignmentResult] || 0) + alignmentResult;
              if (alignmentResult === 5) {
                winner = alignmentResult;
              }
            }
          }
        }
      }

      return { playerScores, winner };
    },
    checkWinnerWithOutOfTiles: (gameState) => {
      const tiles =
        gameState.currentTurn === "player:1"
          ? gameState.player1Tiles
          : gameState.player2Tiles;

      const possibleWinner =
        gameState.currentTurn === "player:1" ? "player:2" : "player:1";

      if (tiles <= 0) {
        return possibleWinner;
      }

      return null;
    },
  },
  bot: {
    performAction: (
      game,
      updateClientsViewDecks,
      updateClientsViewChoices,
      updateClientsViewGrid,
      updateClientsViewTimers
    ) => {
      if (game.gameState.currentTurn === "player:2") {
        setTimeout(() => {
          if (
            game.gameState.deck.rollsCounter < game.gameState.deck.rollsMaximum
          ) {
            // Simule un lancer de dés pour le bot
            console.log("Bot rolling dice");
            game.gameState.deck.dices = GameService.dices.roll(
              game.gameState.deck.dices
            );
            game.gameState.deck.rollsCounter++;
            updateClientsViewDecks(game);
            if (
              game.gameState.deck.rollsCounter ===
              game.gameState.deck.rollsMaximum
            ) {
              GameService.bot.performChoice(
                game,
                updateClientsViewDecks,
                updateClientsViewChoices,
                updateClientsViewGrid,
                updateClientsViewTimers
              );
            } else {
              GameService.bot.performAction(
                game,
                updateClientsViewDecks,
                updateClientsViewChoices,
                updateClientsViewGrid,
                updateClientsViewTimers
              );
            }
          } else {
            GameService.bot.performChoice(
              game,
              updateClientsViewDecks,
              updateClientsViewChoices,
              updateClientsViewGrid,
              updateClientsViewTimers
            );
          }
        }, 2000);
      }
    },

    performChoice: (
      game,
      updateClientsViewDecks,
      updateClientsViewChoices,
      updateClientsViewGrid,
      updateClientsViewTimers
    ) => {
      setTimeout(() => {
        const availableChoices = GameService.choices.findCombinations(
          game.gameState.deck.dices,
          false,
          game.gameState.deck.rollsCounter === 2
        );
        if (availableChoices.length > 0) {
          const selectedChoice =
            availableChoices[
              Math.floor(Math.random() * availableChoices.length)
            ];
          game.gameState.choices.idSelectedChoice = selectedChoice.id;
          game.gameState.grid = GameService.grid.updateGridAfterSelectingChoice(
            selectedChoice.id,
            game.gameState.grid
          );
          updateClientsViewChoices(game);
          GameService.bot.performGridSelection(
            game,
            updateClientsViewDecks,
            updateClientsViewChoices,
            updateClientsViewGrid,
            updateClientsViewTimers
          );
        }
      }, 2000);
    },

    performGridSelection: (
      game,
      updateClientsViewDecks,
      updateClientsViewChoices,
      updateClientsViewGrid,
      updateClientsViewTimers
    ) => {
      setTimeout(() => {
        const cellToSelect = game.gameState.grid
          .flat()
          .find((cell) => cell.canBeChecked);
        if (cellToSelect) {
          game.gameState.grid = GameService.grid.selectCell(
            cellToSelect.id,
            cellToSelect.rowIndex,
            cellToSelect.cellIndex,
            "player:2",
            game.gameState.grid
          );
          game.gameState = GameService.utils.decrementTiles(game.gameState);
          const { playerScores, winner } =
            GameService.utils.calculateScoreAndWinner(game.gameState.grid);
          game.gameState.player1Score = playerScores["1"];
          game.gameState.player2Score = playerScores["2"];
          updateClientsViewGrid(game);
          game.player1Socket.emit(
            "game.score",
            GameService.send.forPlayer.gameScore("player:1", game.gameState)
          );
          if (winner) {
            game.player1Socket.emit("game.end", winner === "player:1");
          }
        }

        // Passe le tour au joueur humain
        game.gameState.currentTurn = "player:1";
        game.gameState.timer = GameService.timer.getTurnDuration();
        updateClientsViewTimers(game);
        updateClientsViewDecks(game);
        updateClientsViewChoices(game);
        updateClientsViewGrid(game);
      }, 2000);
    },
  },
};
exports.default = GameService;
