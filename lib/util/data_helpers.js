"use strict";


module.exports = function makeDataHelpers(knex) {
  return {

    getUser: function(login, password) {
      return knex
        .select()
        .from("users")
        .where("username", login)    // Replace with userId
        .orWhere("email", login);
    },
    getGameState: function(gameId) {
      return knex
        .select("state")
        .from("games")
        .where("id", 1)       // Replace with userId
        .then((results) => {
          if(results[0]) {
            return results[0].state;
          } else {
            return null;
          }
      });
    },
    addUserToLobby: function(userId, gameNameId) {
      console.log("gameNameId:", gameNameId, "userId:", userId);
      return knex('lobby')
        .insert({"user_id": userId, "game_name_id": gameNameId})
        .then(() => {
          return knex
            .select()
            .from("lobby")
            .where("game_name_id", gameNameId) // Replace with userId
            .whereNull('game_id');
        }).then((results) => {
          return results;
        });
    },
    getLobby: function(gameNameId, userId) {
      return knex
        .select()
        .from("lobby")
        .where("game_name_id", gameNameId) // Replace with userId
        .andWhere("user_id", userId)
      .then((results) => {
        return results;
      });
    },
    makeLobbyActive: function(gameNameId, state) {
      return knex('games')
        .returning("id")
        .insert({
        "game_name_id": gameNameId,
        "start_date": new Date(),
        "end_date": null,
        "state": state
      }).then((gameId) => {
        return knex('lobby')
          .returning('game_id')                // Change to return lobby
          .where("game_name_id", gameNameId)   // Replace with userId
          .whereNull('game_id')
          .update({
            game_id: gameId[0],
            thisKeyIsSkipped: undefined
          });
      }).then((gameId) => {
        console.log("GameId after making game:", gameId);
        return knex('user_games')
          .insert([{"user_id": 2, "game_id": gameId[0]}, {"user_id": 1, "game_id": gameId[0]}]);
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
