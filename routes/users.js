"use strict";

const express     = require('express');
const router      = express.Router();
const gameHelpers = require("../lib/util/game_helpers");


module.exports = (DataHelpers) => {

  // Cards homepage
  router.get("/", (req, res) => {
    let userId = req.session.userId;
    let templateVars = { username: null };

    if(!userId) {
      res.render("index", templateVars);
    } else {
      DataHelpers.getUserById(userId)
      .then((user) => {
        let username = user[0].username;
        templateVars.username = username;

        res.render("index", templateVars);
      });
    }
  });

  // Users pages
  router.get("/users", (req, res) => {
    let userId = req.session.userId;
    let templateVars = { username: null };

    if(!userId) {
      res.render("users", templateVars);
    } else {
      DataHelpers.getUserById(userId)
      .then((user) => {
        let username = user[0].username;
        templateVars.username = username;

        res.render("users", templateVars);
      });
    }
  });

  // User Login
  router.post("/login", (req, res) => {
    let { username, password } = req.body;

    DataHelpers.getUserByLogin(username, password).then((result) => {
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
      DataHelpers.getUserGames(userId)
      .then((games) => {
        let activeGames = games.filter((game) => { return !game.end_date && game.start_date; });
        let lobbyGames = games.filter((game) => { return !game.start_date; });
        res.json({ activeGames, lobbyGames });
      });
    } else {
      res.json(null);
    }
  });

  // Join lobby for a game
  router.post("/games/join/:id", (req, res) => {
    let gameNameId = req.params.id;
    let userId = req.session.userId;
    console.log("User id on post:", userId, "Game name id:", gameNameId);

    if(userId) {
      DataHelpers.getOpenGames(gameNameId, userId)
      .then((games) => {
        console.log("Games returned from get open games:", games);
        if(!games[0]) {
          console.log("Creating...");
          return DataHelpers.createGame(gameNameId);
        } else {
          console.log("Joining...");
          return DataHelpers.addUserToGame(games[0].game_id, userId);
        }
      }).then((gameId) => {
        console.log("Game id returned from either create or join:", gameId);
        return DataHelpers.addUserGame(gameId[0], userId);
      }).then((gameId) => {
        res.json(gameId);
      });
    } else {
      res.status(404).send("Cannot join a lobby while not logged in");
    }
  });

  // Game route for updating cards
  router.get("/games/:id", (req, res) => {
    let userId = req.session.userId;
    let gameNameId = req.params.id;

    if(userId) {
      DataHelpers.getGameState(gameNameId).then((gameState) => {     // Hardcoded
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
      if(state[0].played.length > 1) {      // Replace with number of players
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
