const cardsKey = require("./cards_export");

/* --------- Card Functions --------- */
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

/* --------- Individual Game Functions --------- */
const shuffleCards = function(cards) {
  let shuffledDeck = [];

  while(cards.length > 0) {
    let cardIndex = Math.floor(Math.random() * cards.length);
    shuffledDeck.push(cards[cardIndex]);
    cards.splice(cardIndex, 1);
  }

  return shuffledDeck;
};

const goofspielLogic = {
  createStartingHands: function(users) {
    users = users.concat([{ user_id: "deck" }]);
    let suits = ["clubs", "diamonds", "hearts", "spades"];
    let hands = {};

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
    });

    let shuffledDeck = shuffleCards(hands.deck);
    hands.deck = shuffledDeck;

    return hands;
  },
  createStartingScores: function(users) {
    let scores = {};
    users.forEach((user) => {
      if(user)
       scores[user.user_id] = 0;
    });

    return scores;
  },
  firstTurn: function(hands) {
    let turn = [];
    for(let user in hands) {
      if(user !== "deck") {
        turn.push(user);
      }
    }

    return turn;
  },
  censorHands: function(hands, userId) {
    let newHands = hands;
    for(let user in newHands) {
      if(user === "deck") {
        newHands[user] = [newHands[user][0]];
      } else if(user != userId) {
        delete newHands[user];
      }
    }
    return newHands;
  }
};

const heartsLogic = {
  createStartingHands: function(users) {
    let shuffledDeck = shuffleCards(cardsKey.cards);
    let hands = {};

    let cardIds = shuffledDeck.map((card) => { return card.id; });

    users.forEach((user) => {
      hands[user.user_id] = cardIds.splice(0, 13);
    });

    return hands;
  },
  createStartingScores: function(users) {
    let scores = {};
    users.forEach((user) => {
       scores[user.user_id] = 0;
    });

    return scores;
  },
  firstTurn: function(hands) {
    for(let user in hands) {
      if(hands[user].indexOf(2) > -1) {
        return [user];
      }
    }
  },
  censorHands: function(hands, userId) {
    let newHands = hands;
    for(let user in newHands) {
      if(user != userId) {
        delete newHands[user];
      }
    }
    return newHands;
  }
};

const gameType = function(gameNameId) {
  if(gameNameId === 1) {
    return goofspielLogic;
  } else {
    return heartsLogic;
  }
};

/* --------- Game State Control --------- */
const makeState = function(gameNameId, users) {
  let game = gameType(gameNameId);
  let hands = game.createStartingHands(users);
  let scores = game.createStartingScores(users);
  let turn = game.firstTurn(hands);

  let state = {
    hands,
    scores,
    round: 1,
    turn,
    played: []
  };

 return state;
};

const censorState = function(games, userId) {
  console.log("Uncensored intput:", games);
  let censoredGames = games.map((game) => {
    let oppScores = Object.assign({}, game.state.scores);
    delete oppScores.deck;
    delete oppScores[userId];

    let hands = gameType(game.game_name_id).censorHands(game.state.hands, userId);

    for(let deck in hands) {
      hands[deck] = convertAllCards(hands[deck]);
    }

    let newState = {
      hands,
      scores: {
        user: game.state.scores[userId.toString()],
        opp: oppScores             // Change to usernames
      },
      turn: game.state.turn,
      played: game.state.played
    };
    game.state = newState;
    console.log("Censored output:", game.state);
    return game;
  });

  return censoredGames;
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
  state.turn = newTurn;
  state.played = [];
  state.hands.deck.shift();

  return state;
};

console.log(makeState(1, [{user_id: 5}, {user_id: 6}]));

module.exports = {
  convertCardToString,
  stringToCard,
  convertAllCards,
  advanceGame,
  makeState,
  censorState
};
