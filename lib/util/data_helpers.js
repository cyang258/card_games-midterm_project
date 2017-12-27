"use strict";


module.exports = function makeDataHelpers(knex) {
  return {
    getRankings: function() {
      return knex
        .select("username")
        .count("score as wins")
        .from("user_games as x")
        .join("users", "x.user_id", "users.id")
        .where("score", function() {
          this.max("score")
            .from("user_games as y")
            .whereRaw("y.game_id = x.game_id");
        })
        .groupBy("username")
        .orderBy("wins", "desc");
        // "select user_id, count(*) as wins from user_games x where score = (select max(score) from user_games y where x.game_id = y.game_id) group by user_id order by wins desc"
    },
    getUserGames: function(userId) {
      return knex
        .select()
        .from("user_games")
        .leftOuterJoin("games", "user_games.game_id", "games.id")
        .where("user_id", userId);
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
        .returning("state")
        .where("id", gameId)   // Replace with userId
        .update({ state: state });
    },
    getUsersInGame: function(gameId) {
      return knex
        .select("user_id")
        .from("user_games")
        .where("game_id", gameId);
    },
  };
};
