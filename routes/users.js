"use strict";

const express     = require('express');
const router      = express.Router();
const gameHelpers = require("../lib/util/game_helpers");

module.exports = (DataHelpers) => {

  // Users pages
  router.get("/users/:id", (req, res) => {
    let userId = req.session.userId;
    let templateVars = { userId };
    console.log('Userid on render:', userId);
    res.render("users", templateVars);
  });

  // User Login
  router.post("/login", (req, res) => {
    let { username, password } = req.body;
    console.log('login', username);
    DataHelpers.getUser(username, password).then((result) => {
      if(!result) {
        res.status(404).send();
      } else {
        console.log("Result of login query:", result);
        req.session.userId = result[0].id;
        let templateVars = { userId: result[0].id };

        res.redirect(req.get('referer'));
      }
    });
  });

  // User Logout
  router.post("/logout", (req, res) => {
    req.session = null;
    let templateVars = { userId: null };

    res.redirect(req.get('referer'));
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
    if(userId) {
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
    } else {
      res.json(null);
    }
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
