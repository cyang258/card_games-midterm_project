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

  const stringToCard = function(cardName) {
    let num = parseInt(cardName.charAt(0));
    if(num === 0) {
      num = 13;
    }

    if(cardName.indexOf('diamonds') > -1) {
      num += 13;
    } else if(cardName.indexOf('hearts') > -1) {
      num += 26;
    } else if(cardName.indexOf('hearts') > -1) {
      num += 39;
    }
    return num;
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
      gameState.hands["3"] = convertAllCards(gameState.hands["3"]);   // Replace with userId
      gameState.hands["4"] = convertAllCards(gameState.hands["4"]);   // Replace with userId
      let templateVars = { state: gameState };
      res.json(gameState);
    });
  });

  router.post("/games/:id", (req, res) => {
    let card = stringToCard(req.body.card);
    let gameId = req.params.id;
    DataHelpers.getGameState(gameId).then((result) => {
      result.ready.push("4");       // Replace with userId
      DataHelpers.updateGameState(gameId, result).then((state)=> {
        console.log("Return state:", state);
        res.json({ res: "State updated" });
      });
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
