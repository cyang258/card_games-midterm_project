"use strict";

const express     = require('express');
const router      = express.Router();
const gameHelpers = require("../lib/util/game_helpers");

module.exports = (DataHelpers) => {

  // Users stats page, game page if logged in
  router.get("/users/:id", (req, res) => {
    req.session.userId = 2;
    let userId = req.session.userId;
    let templateVars = { userId };

    res.render("users", templateVars);
  });

  router.get("/login", (req, res) => {
    req.session.userId = 2;
    let userId = req.session.userId;
    let templateVars = { userId };

    res.render("users", templateVars);
  });

  // Check if still in lobby
  router.get("/games/:id/lobby", (req, res) => {
    let gameId = req.params.id;
    DataHelpers.getLobby(gameId, 2).then((results) => {
      console.log("Results from check lobby:", results);
      if(results[0]) {
        res.json(results[0]);
      } else {
        res.json(null);
      }
    });
  });

  // Join lobby for a game
  router.post("/games/join/:id", (req, res) => {
    let gameNameId = req.params.id;
    DataHelpers.addUserToLobby(2, gameNameId).then((lobby) => {
      if(lobby.length > 1) {
        DataHelpers.makeLobbyActive(gameNameId, gameHelpers.startGame(1, 2));      // Make lobby dynamic for players
      }
      res.json(lobby);
    });
  });

  // Game route for updating cards
  router.get("/games/:id", (req, res) => {
    let userId = req.session.userId;

    DataHelpers.getGameState(1).then((gameState) => {     // Hardcoded
      if(!gameState){
        res.json({ null: true });
      } else {
        userId = userId.toString();
        console.log("Game State:", gameState);
        let state = {
          deck: gameHelpers.convertCardToString(gameState.hands.deck[0]),
          user: gameHelpers.convertAllCards(gameState.hands[userId]),
          turn: gameState.turn
        };
        res.json(state);
      }
    });
  });

  // Card played
  router.post("/games/:id", (req, res) => {
    let card = gameHelpers.stringToCard(req.body.card);
    let gameId = req.params.id;
    let userId = req.session.userId;

    DataHelpers.getGameState(gameId)
    .then((state) => {
      state.played.push({ userId, card });
      // let index = state.turn.indexOf(userId);
      // state.turn.splice(index, 1);

      return DataHelpers.updateGameState(gameId, state);
    }).then((state)=> {
      let newState = state;
      if(state[0].played.length > 0) {      // Replace with number of players
        newState = gameHelpers.advanceGame(1, state[0]);
      }
      return DataHelpers.updateGameState(gameId, newState);
    }).then((state) => {
      res.json(state);
    });
  });

  return router;
};
