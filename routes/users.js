"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (DataHelpers) => {

  const convertCardToString = function(num) {
    let deckSuit = num / 13;
    let cardString = `${(num % 13).toString()}_of_`;

    if(deckSuit <= 1) {
      cardString += "clubs";
    } else if(deckSuit <= 2) {
      cardString += "diamonds";
    } else if(deckSuit <= 3) {
      cardString += "hearts";
    } else {
      cardString += "spades";
    }
    return cardString;
  };

  const convertAllCards = function (cards) {
    let cardStrings = cards.map(convertCardToString);
    return cardStrings;
  };

  router.get("/users/:id", (req, res) => {
    res.render("users");
  });

  router.get("/games/:id", (req, res) => {
    DataHelpers.getGameState(1).then((gameState) => {
      gameState.hands.deck = convertAllCards(gameState.hands.deck);
      gameState.hands["3"] = convertAllCards(gameState.hands["3"]);
      gameState.hands["4"] = convertAllCards(gameState.hands["4"]);
      let templateVars = { state: gameState };
      res.json(gameState);
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
