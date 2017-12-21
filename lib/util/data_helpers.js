"use strict";


module.exports = function makeDataHelpers(knex) {
  return {

    getGameState: function(gameId) {
      return knex
        .select("state")
        .from("games")
        .where("id", 1)
        .then((results) => {
          return results[0].state;
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
    }
  };
};
