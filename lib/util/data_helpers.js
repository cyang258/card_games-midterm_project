"use strict";


module.exports = function makeDataHelpers(knex) {
  return {

    getUserGames: function(userId) {
      return knex
        .select()
        .from("user_games")
        .leftOuterJoin("games", "user_games.game_id", "games.id")
        .where("user_id", userId);
    },
    getOpenGames: function(userId) {
      let usersGames = knex
        .select("game_id")
        .from("user_games")
        .where("user_id", userId);
      return knex
        .select()
        .from("games")
        .leftOuterJoin("user_games", "user_games.game_id", "games.id")
        .where("start_date", null)
        .andWhere("game_id", "not in", usersGames);
    },
    addUserToGame: function(gameId, state) {
      return knex("games")
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
        .select("state")
        .from("games")
        .where("id", gameId)
        .then((results) => {
          if(results[0]) {
            return results[0].state;
          } else {
            return null;
          }
      });
    },
    updateGameState: function(gameId, state) {
      return knex("games")
        .where("id", gameId)   // Replace with userId
        .returning("state")
        .update({
          state: state,
          thisKeyIsSkipped: undefined
        });
    },
    getAllGames: function(name) {

    },
    getUserHistory: function(userId) {

    },
    userReady: function(userId) {

    }
  };
};
