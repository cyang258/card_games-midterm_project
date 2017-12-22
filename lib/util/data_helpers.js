"use strict";


module.exports = function makeDataHelpers(knex) {
  return {

    getGameState: function(gameId) {
      return knex
        .select("state")
        .from("games")
        .where("id", 1)       // Replace with userId
        .then((results) => {
          return results[0].state;
      });
    },
    addUserToLobby: function(userId, gameNameId) {
      return knex('lobby')
        .insert({"user_id": userId, "game_name_id": gameNameId})
        .then(() => {
          return knex
            .select()
            .from("lobby")
            .where("game_name_id", gameNameId);     // Replace with userId
        }).then((results) => {
          return results[0];
        });
    },
    updateGameState: function(gameId, state) {
      return knex('games')
        .where("id", gameId)   // Replace with userId
        .returning("state")
        .update({
          state: state,
          thisKeyIsSkipped: undefined
        });
    },
    getAllGames: function(name) {
      return knex
        .select("*")
        .from("games")
        .then((results) => {
          return results;
      });
    },
    getUserHistory: function(userId) {
      return knex
        .select("*")
        .from("user_games")
        .innerJoin("games", 'user_games.game_id', 'games.id')
        .where('user_id', userId)
        .then((results) => {
          return results;
      });
    },
    userReady: function(userId) {
      return knex
        .select("*")
        .from("user_games")
        .innerJoin("games", 'user_games.game_id', 'games.id')
        .where('user_id', userId)
        .then((results) => {
          return results;
      });
    }
  };
};
