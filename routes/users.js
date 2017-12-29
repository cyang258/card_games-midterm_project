"use strict";

const express     = require('express');
const router      = express.Router();
const gameHelpers = require("../lib/util/game_helpers");

let gamePlayerNumbers = {
  1: 2,
  2: 4
};


module.exports = (DataHelpers) => {

  const getOpponents = function(user, scores) {
    let opponents = [];
    for(let player in scores) {
      if(player != user) {
        opponents.push(`${player}: ${scores[player]}`);  // Cross site scripting vulnerability!
      }
    }
    return opponents;
  };

  const checkUserId = function(userId) {
    let templateVars = { username: null };

    return new Promise((resolve, reject) => {
      if(!userId) {
        resolve(templateVars);
      } else {
        DataHelpers.getUserById(userId)
        .then((user) => {
          templateVars.username = user[0].username;

          resolve(templateVars);
        });
      }
    });
  };

  // Cards homepage
  router.get("/", (req, res) => {
    let userId = req.session.userId;

    checkUserId(userId).then((templateVars) => {
      res.render("index", templateVars);
    });
  });

  // Users pages
  router.get("/users", (req, res) => {
    let userId = req.session.userId;

    checkUserId(userId).then((templateVars) => {
      res.render("users", templateVars);
    });
  });

  // Users history
  router.get("/:id/history", (req, res) => {
    let username = req.params.id;

    DataHelpers.getUserGames(3).then((games) => {
      if(games[0]) {
        let history = games.map((game) => {
          let newGame = {
            name: game.name,
            id: game.game_id,
            start_date: game.start_date.toString().slice(0, 10),
            end_date: game.end_date.toString().slice(0, 10),
            score: game.score,
            opponents: getOpponents(username, game.state.scores)
          };
          return newGame;
        });
        res.json(history);
      } else {
        res.status(404).send("Could not find games for that user");
      }
    });
  });

  // Games pages
  router.get("/games", (req, res) => {
    let userId = req.session.userId;

    checkUserId(userId).then((templateVars) => {
      res.render("games", templateVars);
    });
  });

  // Users rankings
  router.get("/rankings", (req, res) => {
    let userId = req.session.userId;

    checkUserId(userId).then((templateVars) => {
      res.render("rankings", templateVars);
    });
  });

  // Users rankings
  router.get("/rankings/:id", (req, res) => {
    DataHelpers.getRankings()
      .then((rankings) => {
        res.json(rankings);
    });
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
  router.get("/games/:id", (req, res) => {
    let gameNameId = req.params.id;
    let userId = req.session.userId;

    if(userId) {
      DataHelpers.getUserGames(userId)
      .then((games) => {
        let activeGames = games.filter((game) => { return !game.end_date && game.start_date; });
        let lobbyGames = games.filter((game) => { return !game.start_date; });
        let finishedGames = games.filter((game) => { return game.end_date; });

        let censoredGames = gameHelpers.censorState(activeGames, userId);

        res.json({ censoredGames, lobbyGames, finishedGames, userId });
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
      DataHelpers.getOpenGames(gameNameId, userId)
      .then((games) => {
        if(!games[0]) {
          return DataHelpers.createGame(gameNameId);
        } else {
          return DataHelpers.getUsersInGame(games[0].id)
            .then((users) => {
              users.push({ user_id: userId.toString() });
              if(users.length === gamePlayerNumbers[gameNameId]) {
                let state = gameHelpers.makeState(gameNameId, users);
                return DataHelpers.startGame(games[0].id, state);
              } else {
                return [games[0].id];
              }
          });
        }
      }).then((gameId) => {
        return DataHelpers.addUserGame(gameId[0], userId);
      }).then((gameId) => {
        res.json(gameId);
      });
    } else {
      res.status(404).send("Cannot join a lobby while not logged in");
    }
  });


  // Card played
  router.post("/games/:id", (req, res) => {
    let card = gameHelpers.stringToCard(req.body.card);
    let gameId = req.params.id;
    let userId = req.session.userId;

    DataHelpers.getGameState(gameId, userId)
    .then((game) => {
      let state = game[0].state;
      if(state.played.find((elm) => { return elm.userId === userId; })) {
        res.json(null);
      } else {
        state.played.push({ userId, card });
        let newState = state;

        if(state.played.length > 1) {      // Replace with number of players
          newState = gameHelpers.advanceGame(1, state);
        }
        return DataHelpers.updateGameState(gameId, newState);
      }
    }).then((state) => {
      if(state[0].turn > 13) {
        return DataHelpers.endGame(gameId)
        .then((state) => {
          let wrapAllScores = function(scores, gameId) {
            let array = [];
            for(let user in scores) {
              if(user !== "deck") {
                array.push(DataHelpers.addGameScores(scores[user], gameId, user));
              }
            }
            return array;
          };

          return Promise.all(
            wrapAllScores(state[0].scores, gameId)
          );
        });
      }
    }).then((state) => {
      res.status(201).send();
    });
  });

  return router;
};
