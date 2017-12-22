const cardsKey = require("./cards_export");

// Card functions
const findCardValue = function(cardId) {
  let card = cardsKey.cards.find((card) => { return cardId === card.id; });
  return card.faceValue;
};

const convertCardToString = function(num) {
  let card = cardsKey.cards.find((card) => { return card.id === num; });
  return card.src;
};

const stringToCard = function(cardName) {
  let card = cardsKey.cards.find((card) => { return card.src === cardName; });
  return card;
};

const convertAllCards = function (cards) {
  let cardStrings = cards.map(convertCardToString);
  return cardStrings;
};

// Game functions
const updateUserDeck = function (userId, card, cards) {
  let index = cards.indexOf(card);
  return cards.splice(index, 1);
};

const advanceGame = function(gameName, state) {
  let playedCards = state.played;
  let highest = 0;

  let winners = playedCards.reduce((acc, player) => {
    if(player.card.faceValue > highest) {
      return [player];
    } else if(player.card.faceValue === highest) {
      return acc.push(player);
    }
    return acc;
  }, []);

  winners.forEach((player) => {
    state.scores[player.userId] += findCardValue(state.hands.deck[0]) / winners.length;  // Replace with deck card value
  });

  state.turn = [];
  console.log("Turn:", state.turn);
  playedCards.forEach((player) => {
    let index = state.hands[player.userId].indexOf(player.card.id);
    state.hands[player.userId].splice(index, 1);
    state.turn.push(player.userId);
  });

  state.played = [];
  state.hands.deck.shift();

  return state;
};

module.exports = {
  convertCardToString,
  stringToCard,
  convertAllCards,
  advanceGame
};
