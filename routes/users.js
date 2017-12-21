"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (DataHelpers) => {

  router.get("/games/:id", (req, res) => {
    DataHelpers.getGameState(1).then((gameState) => {
      let templateVars = { state: gameState };
      console.log(gameState);
      res.render("users", templateVars);
    });
  });

// To visit user page
  router.get("/users/:id", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}
