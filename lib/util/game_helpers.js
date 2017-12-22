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

const convertAllCards = function(cards) {
  console.log(cards);
  let cardStrings = cards.map(convertCardToString);
  return cardStrings;
};

// Game functions
const updateUserDeck = function(userId, card, cards) {
  let index = cards.indexOf(card);
  return cards.splice(index, 1);
};

const shuffleCards = function(cards) {
  let shuffledDeck = [];

  while(cards.length > 0) {
    let cardIndex = Math.floor(Math.random() * cards.length);
    shuffledDeck.push(cards[cardIndex]);
    cards.splice(cardIndex, 1);
  }

  return shuffledDeck;
};

const startGame = function(userOne, userTwo) {

  let deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let userOneDeck = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
  let userTwoDeck = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];

  let shuffledDeck = shuffleCards(deck);

  let state = {
    hands: {
      deck: shuffledDeck,
      [userOne]: userOneDeck,
      [userTwo]: userTwoDeck
    },
    scores: {
      [userOne]: 0,
      [userTwo]: 0
    },
    turn: 1,
    played: []
  };

 return state;
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
  advanceGame,
  startGame
};