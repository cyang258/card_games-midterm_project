const cardsKey = require("./cards_export");

// Card functions
const findCardValue = function(cardId) {
  let card = cardsKey.cards.find((card) => { return cardId === card.id; });
  return card.faceValue;
};

const convertCardToString = function(num) {
  let card = cardsKey.cards.find((card) => { return card.id === num; });
  if(!card) {
    return [];
  } else {
    return card.src;
  }
};

const stringToCard = function(cardName) {
  let card = cardsKey.cards.find((card) => { return card.src === cardName; });
  return card;
};

const convertAllCards = function(cards) {
  let cardStrings = cards.map(convertCardToString);
  return cardStrings;
};

// Game functions
const shuffleCards = function(cards) {
  let shuffledDeck = [];

  while(cards.length > 0) {
    let cardIndex = Math.floor(Math.random() * cards.length);
    shuffledDeck.push(cards[cardIndex]);
    cards.splice(cardIndex, 1);
  }

  return shuffledDeck;
};

const censorState = function(games, userId) {
  let censoredGames = games.map((game) => {
    let scores = Object.keys(game.state.scores);
    scores.splice(scores.indexOf(userId.toString()), 1);
    let oppScores = Object.assign({}, game.state.scores);
    delete oppScores.deck;
    delete oppScores[userId];

    let newState = {
      hands: {
        deck: convertCardToString(game.state.hands.deck[0]),
        user: convertAllCards(game.state.hands[userId])
      },
      scores: {
        user: game.state.scores[userId.toString()],
        opp: oppScores             // Change to usernames
      },
      turn: game.state.turn,
      played: game.state.played
    };
    game.state = newState;
    return game;
  });

  return censoredGames;
};


const makeState = function(users) {
  users.push({ user_id: "deck" });
  let suits = ["clubs", "diamonds", "hearts", "spades"];
  let hands = {};
  let scores = {};

  users.forEach((user) => {
    let index = Math.floor(Math.random() * suits.length);

    hands[user.user_id] = cardsKey.cards.reduce((acc, card) => {
      if(card.suit == suits[index]) {
        acc.push(card.id);
        return acc;
      } else {
        return acc;
      }
    }, []);

    suits.splice(index, 1);

    scores[user.user_id] = 0;
  });

  let shuffledDeck = shuffleCards(hands.deck);
  hands.deck = shuffledDeck;

  let state = {
    hands,
    scores,
    turn: 1,
    played: []
  };

 return state;
};

const checkEnd = function(turn) {
  if(turn > 13) {
    return true;
  } else {
    return false;
  }
};

const advanceGame = function(gameName, state) {
  let playedCards = state.played;
  let highest = 0;

  // Determine the users with winning hands
  let winners = playedCards.reduce((acc, player) => {
    if(player.card.faceValue > highest) {
      highest = player.card.faceValue;
      return [player];
    } else if(player.card.faceValue == highest) {
      acc.push(player);
      return acc;
    } else {
      return acc;
    }
  }, []);

  // Split points among winners
  let deckCardValue = findCardValue(state.hands.deck[0]) / winners.length;
  winners.forEach((player) => {
    state.scores[player.userId] += deckCardValue;  // Replace with deck card value
  });

  // Update the users hands based on played cards
  playedCards.forEach((player) => {
    let index = state.hands[player.userId].indexOf(player.card.id);
    state.hands[player.userId].splice(index, 1);
  });

  let newTurn = state.turn + 1;
  if(checkEnd(newTurn)) {
    state.end_date = new Date();
  }
  state.turn = newTurn;
  state.played = [];
  state.hands.deck.shift();

  return state;
};

module.exports = {
  convertCardToString,
  stringToCard,
  convertAllCards,
  advanceGame,
  makeState,
  censorState
};
