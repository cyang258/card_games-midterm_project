"use strict";

const express     = require('express');
const router      = express.Router();
const gameHelpers = require("../lib/util/game_helpers");

let gamePlayerNumbers = {
  1: 2,
  2: 4
};

// All routes for the webpage
module.exports = (DataHelpers) => {

  // Helper function
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
  router.get("/users/:name", (req, res) => {
    let username = req.params.name;

    let userId = req.session.userId;
    let templateVars = {};

    checkUserId(userId)
    .then((vars) => {
      templateVars = vars;
      return DataHelpers.getUserId(username);
    }).then((userId) => {
      return DataHelpers.getUserGames(userId[0].id);
    }).then((games) => {
      if(games[0]) {
        // If a user has games then format the results and only inlcude completed games
        let history = games.reduce((acc, game) => {
          if(game.end_date) {
            let newGame = {
              name: game.name,
              id: game.game_id,
              start_date: game.start_date.toString().slice(0, 10),
              end_date: game.end_date.toString().slice(0, 10),
              score: game.score,
              opponents: getOpponents(username, game.state.scores)
            };
            acc.push(newGame);
            return acc;
          } else {
            return acc;
          }
        }, []);
        templateVars.history = history;
        templateVars.playerName = username;
        res.render("users", templateVars);
      } else {
        res.status(400).send("Could not find games for that user");
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

  // Users rankings page
  router.get("/rankings", (req, res) => {
    let userId = req.session.userId;

    checkUserId(userId).then((templateVars) => {
      res.render("rankings", templateVars);
    });
  });

  // Specfic game type rankings
  router.get("/rankings/:id", (req, res) => {
    let gameNameId = req.params.id;

    DataHelpers.getRankings(gameNameId)
      .then((rankings) => {
        res.json(rankings);
    });
  });

  // User Login
  router.post("/login", (req, res) => {
    let { username, password } = req.body;

    DataHelpers.getUserByLogin(username, password).then((result) => {
      if(!result[0]) {
        res.status(400).send("Could not find user");
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

  // Get users games to determine active
  router.get("/:id/games", (req, res) => {
    let userId = req.session.userId;
    let username = "";

    if(userId) {
      DataHelpers.getUserById(userId)
      .then((user) => {
        username = user[0].username;
        return DataHelpers.getUserGames(userId);
      }).then((games) => {
        // Censor the hands so that users can't see other player's cards
        let activeGames = games.filter((game) => { return !game.end_date && game.start_date; });
        let lobbyGames = games.filter((game) => { return !game.start_date; });
        let finishedGames = games.filter((game) => { return game.end_date; });

        activeGames = gameHelpers.censorState(activeGames, username);

        res.json({ activeGames, lobbyGames, finishedGames, username });
      });
    } else {
      res.status(401).send("Must be logged in to retrieve games");
    }
  });

  // Join lobby for a game
  router.post("/games/join/:id", (req, res) => {
    let gameNameId = req.body.gameNameId;
    let userId = req.session.userId;
    let username = "";

    if(userId) {
      DataHelpers.getUserById(userId)
      .then((user) => {
        username = user[0].username;
        return username;
      }).then(() => {
        return DataHelpers.getOpenGames(gameNameId, userId);
      }).then((games) => {
        if(!games[0]) {
          // Create a game if no open lobbies exist
          return DataHelpers.createGame(gameNameId);
        } else {
          // Otherwise join a game and determine if there are enough players to start
          return DataHelpers.getUsersInGame(games[0].id)
            .then((users) => {
              users.push({ username });
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
      res.status(401).send("Cannot join a lobby while not logged in");
    }
  });

  // Card played
  router.put("/games/:id", (req, res) => {
    let card = gameHelpers.stringToCard(req.body.card);
    let gameId = req.params.id;
    let userId = req.session.userId;
    let username = "";

    DataHelpers.getUserById(userId)
    .then((user) => {
      username = user[0].username;
      return DataHelpers.getGameState(gameId, userId);
    }).then((game) => {
      let state = game[0].state;
      let gameNameId = game[0].game_name_id;

      state.played.push({ username, card });
      let newState = gameHelpers.advanceGame(gameNameId, state, username);
      return new Promise((resolve, reject) => {
        if(newState) {
          resolve(DataHelpers.updateGameState(gameId, newState));
        } else {
          reject("Cannot play that card");
        }
      });
    }).then((state) => {
      // If there is a winner then add each users score to the database
      if(state[0].winner) {
        return DataHelpers.endGame(gameId)
        .then((state) => {
          let wrapAllScores = function(scores, gameId) {
            let array = [];
            for(let user in scores) {
              if(user !== "deck") {
                array.push(
                  DataHelpers.getUserId(user)
                  .then((user_id) => {
                    return DataHelpers.addGameScores(scores[user], gameId, user_id[0].id);
                }));
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
    }).catch((message) => {
      res.status(400).send(message);
    });
  });

  return router;
};
