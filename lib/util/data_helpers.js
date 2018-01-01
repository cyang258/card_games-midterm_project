"use strict";

// All database helper functions
module.exports = function makeDataHelpers(knex) {
  return {
    addGameScores: function(score, gameId, user) {
      return knex("user_games")
        .where("game_id", gameId)
        .andWhere("user_id", user)
        .update({
          "score": score,
        });
    },
    getRankings: function(gameNameId) {
      let subquery;
      if(gameNameId == 1) {
        subquery = function() {
          this.max("score")
            .from("user_games as y")
            .whereRaw("y.game_id = x.game_id");
        };
      } else {
        subquery = function() {
          this.min("score")
            .from("user_games as y")
            .whereRaw("y.game_id = x.game_id");
        };
      }
      return knex
        .select("username")
        .count("score as wins")
        .from("user_games as x")
        .join("users", "x.user_id", "users.id")
        .join("games", "x.game_id", "games.id")
        .where("score", subquery)
        .andWhere("games.game_name_id", gameNameId)
        .groupBy("username")
        .orderBy("wins", "desc");
    },
    getUserGames: function(userId) {
      return knex
        .select()
        .from("user_games")
        .leftOuterJoin("games", "user_games.game_id", "games.id")
        .leftOuterJoin("game_names", "games.game_name_id", "game_names.id")
        .where("user_id", userId);
    },
    getUserId: function(username) {
      return knex
        .select("id")
        .from("users")
        .where("username", username);
    },
    getOpenGames: function(gameNameId, userId) {
      let usersGames = knex
        .select("game_id")
        .from("user_games")
        .where("user_id", userId);
      return knex
        .select()
        .from("games")
        .where("start_date", null)
        .andWhere("id", "not in", usersGames);
    },
    startGame: function(gameId, state) {
      return knex("games")
        .where("id", gameId)
        .returning("id")
        .update({
          "start_date": new Date(),
          "state": state
        });
    },
    addUserGame: function(gameId, userId) {
      return knex("user_games")
        .returning("game_id")
        .insert({
          "game_id": gameId,
          "user_id": userId
        });
    },
    createGame: function(gameNameId, state) {
      return knex("games")
        .returning("id")
        .insert({
        "game_name_id": gameNameId,
        "start_date": null,
        "end_date": null,
        "state": null
      });
    },
    endGame: function(gameId) {
      return knex("games")
        .returning("state")
        .where("id", gameId)
        .update({
        "end_date": new Date()
      });
    },
    getUserById: function(userId) {
      return knex
        .select()
        .from("users")
        .where("id", userId);
    },
    getUserByLogin: function(username, password) {
      return knex
        .select()
        .from("users")
        .where("username", username)
        .orWhere("email", username);
    },
    getGameState: function(gameId) {
      return knex
        .select("state", "game_name_id")
        .from("games")
        .where("id", gameId);
    },
    updateGameState: function(gameId, state) {
      return knex("games")
        .returning("state")
        .where("id", gameId)   // Replace with userId
        .update({ state: state });
    },
    getUsersInGame: function(gameId) {
      return knex
        .select("username")
        .from("user_games")
        .join("users", "users.id", "user_games.user_id")
        .where("game_id", gameId);
    },
  };
};
