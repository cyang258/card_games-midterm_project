"use strict";

const express     = require('express');
const router      = express.Router();
const gameHelpers = require("../lib/util/game_helpers");

module.exports = (DataHelpers) => {

  // Users stats page, game page if logged in
  router.get("/users/:id", (req, res) => {
    res.render("users");
  });

  // Check if still in lobby
  router.get("/games/:id/lobby", (req, res) => {
    let gameId = req.params.id;
    DataHelpers.getLobby(gameId, 2).then((results) => {
      if(results.game_id) {
        res.json(results);
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
    DataHelpers.getGameState(1).then((gameState) => {
      console.log("Game state on refresh:", gameState);
      gameState.hands.deck = gameHelpers.convertAllCards(gameState.hands.deck);
      gameState.hands["1"] = gameHelpers.convertAllCards(gameState.hands["1"]);   // Replace with userId
      gameState.hands["2"] = gameHelpers.convertAllCards(gameState.hands["2"]);   // Replace with userId
      let templateVars = { state: gameState };
      res.json(gameState);
    });
  });

  // Game route for playing a card
  router.post("/games/:id", (req, res) => {
    let card = gameHelpers.stringToCard(req.body.card);
    let gameId = req.params.id;

    DataHelpers.getGameState(gameId)
    .then((state) => {
      state.played.push({ userId: "2", card: card }); //User name
      let index = state.turn.indexOf("2");            //User name
      state.turn.splice(index, 1);

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

  // To visit user page
  router.get("/users/:id", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
};
