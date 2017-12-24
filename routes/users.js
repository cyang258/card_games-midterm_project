"use strict";

const express     = require('express');
const router      = express.Router();
const gameHelpers = require("../lib/util/game_helpers");

module.exports = (DataHelpers) => {

  router.get("/", (req, res) => {
    let userId = req.session.userId;
    let templateVars = { userId };

    res.render("index", templateVars);
  });

  // Users pages
  router.get("/users", (req, res) => {
    let userId = req.session.userId;
    let templateVars = { userId };

    res.render("users", templateVars);
  });

  // User Login
  router.post("/login", (req, res) => {
    let { username, password } = req.body;

    DataHelpers.getUser(username, password).then((result) => {
      if(!result) {
        res.status(404).send("Could not find user");
      } else {
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
    let gameNameId = req.params.id;
    let userId = req.session.userId;

    if(userId) {
      DataHelpers.getLobby(gameNameId, userId)
      .then((results) => {
        console.log("Find lobby without gameid:", results);
        if (results.find((lobby) => { return lobby['game_id']; })) {
          res.json(results[0]);
        } else if (results[0]) {
          res.json({ null: true });
        } else {
          res.json(null);
        }
      });
    } else {
      res.json(null);
    }
  });

  // Join lobby for a game
  router.post("/games/join/:id", (req, res) => {
    let gameNameId = req.params.id;
    let userId = req.session.userId;

    if(userId) {
      DataHelpers.getLobby(gameNameId, userId)
      .then((results) => {
        console.log("Results from getLobby:", results);
        if(results[0]) {
          res.json(null);
        } else {
          DataHelpers.addUserToLobby(userId, gameNameId).then((lobby) => {
            if(lobby.length > 1) {
              DataHelpers.makeLobbyActive(gameNameId, gameHelpers.startGame(1, 2));      // Make lobby dynamic for players
            }
            res.json(lobby);
          });
        }
      });
    } else {
      res.status(404).send("Cannot join a lobby while not logged in");
    }
  });

  // Game route for updating cards
  router.get("/games/:id", (req, res) => {
    let userId = req.session.userId;

    if(userId) {
      DataHelpers.getGameState(1).then((gameState) => {     // Hardcoded
        if(!gameState){
          res.json(null);
        } else {
          userId = userId.toString();
          let users = Object.keys(gameState.scores);
          users.splice(users.indexOf(userId), 1);
          let opp = users[0];

          let state = {
            user: gameHelpers.convertAllCards(gameState.hands[userId]),
            turn: gameState.turn,
            score: { user: gameState.scores[userId], opp: gameState.scores[opp] }
          };
          if(gameState.hands.deck.length === 0) {
            state.deck = '';
          } else {
            state.deck = gameHelpers.convertCardToString(gameState.hands.deck[0]);
          }

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

    DataHelpers.getGameState(gameId, userId)
    .then((state) => {
      if(state.played.find((elm) => { return elm.userId === userId; })) {
        return new Promise( (resolve, reject) => {
          reject(state);
        });
      } else {
        state.played.push({ userId, card });
        // let index = state.turn.indexOf(userId);
        // state.turn.splice(index, 1);
        return DataHelpers.updateGameState(gameId, state);
      }
    }).then((state)=> {
      let newState = state;
      console.log("Game state before trying to call advance game:", state);
      console.log("Length of played cards", state[0].played.length > 1);
      if(state[0].played.length > 1) {      // Replace with number of players
        console.log("Calling advanceGame function to keep playing");
        newState = gameHelpers.advanceGame(1, state[0]);
      }
      return DataHelpers.updateGameState(gameId, newState);
    }).catch((state) => {
      return state;
    }).then((state) => {
      res.json(state);
    });
  });

  return router;
};
