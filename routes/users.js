"use strict";

const express     = require('express');
const router      = express.Router();
const gameHelpers = require("../lib/util/game_helpers");

module.exports = (DataHelpers) => {

  router.get("/users/:id", (req, res) => {
    res.render("users");
  });

  router.get("/games/:id", (req, res) => {
    DataHelpers.getGameState(1).then((gameState) => {
      gameState.hands.deck = gameHelpers.convertAllCards(gameState.hands.deck);
      gameState.hands["3"] = gameHelpers.convertAllCards(gameState.hands["3"]);   // Replace with userId
      gameState.hands["4"] = gameHelpers.convertAllCards(gameState.hands["4"]);   // Replace with userId
      let templateVars = { state: gameState };
      res.json(gameState);
    });
  });

  router.post("/games/:id", (req, res) => {
    let card = gameHelpers.stringToCard(req.body.card);
    let gameId = req.params.id;

    DataHelpers.getGameState(gameId)
    .then((state) => {
      state.played.push({ userId: "4", card: card });
      let index = state.turn.indexOf("4");
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
}
