const cardsKey = require("./cards_export");

let gamePlayerNumbers = {
  1: 2,
  2: 4
};

/* --------- Card Functions --------- */
const findCardValue = function(cardId) {
  let card = cardsKey.find((card) => { return cardId === card.id; });
  return card.faceValue;
};

const convertCardToString = function(num) {
  let card = cardsKey.find((card) => { return card.id == num; });
  if(!card) {
    return [];
  } else {
    return card.src;
  }
};

const stringToCard = function(cardName) {
  let card = cardsKey.find((card) => { return card.src === cardName; });
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

// Object with functionality specific to Goofspiel
const goofspielLogic = {
  createStartingHands: function(users) {
    users = users.concat([{ username: "deck" }]);
    let suits = ["clubs", "diamonds", "hearts", "spades"];
    let hands = {};

    users.forEach((user) => {
      let index = Math.floor(Math.random() * suits.length);

      hands[user.username] = cardsKey.reduce((acc, card) => {
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
       scores[user.username] = 0;
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
  // Censor the state before sending it to client
  censorHands: function(hands, username) {
    let newHands = hands;
    for(let user in newHands) {
      if(user === "deck") {
        newHands[user] = [newHands[user][0]];
      } else if(user !== username) {
        delete newHands[user];
      }
    }
    return newHands;
  },
  censorPlayedCards: function(playedCards, username) {
    let played = playedCards.map((player) => {
      let card = player.card.src;
      if(player.username !== username) {
        card = "cardback";
      }
      return { username: player.username, card };
    });

    return played;
  },
  // Any card played from the users hand is valid
  approveCard: function(card, state) {
    return true;
  },
  updateScore: function(playedCards, state) {
    let highest = 0;
    let scores = state.scores;

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
      scores[player.username] += deckCardValue;  // Replace with deck card value
    });
    state.scores = scores;
    return state;
  },
  newRound: function(state) {
    state.round += 1;
    state.turn = Object.keys(state.scores);
    return state;
  },
  nextTurn: function(playedCards, scores) {
    let users = Object.keys(scores);
    users.splice(users.indexOf(playedCards[0].username), 1);
    return users;
  },
  checkEnd: function(state) {
    if(state.round > 13) {
      let winner = [];
      let highest = 0;
      for(let user in state.scores) {
        if(state.scores[user] > highest) {
          highest = state.scores[user];
          winner = [user];
        } else if(state.scores[user] === highest) {
          winner.push(user);
        }
      }
      return winner;
    } else {
      return false;
    }
  }
};

// Object with functionality specific to Hearts
const heartsLogic = {
  createStartingHands: function(users) {
    let savedCards = cardsKey.map((card) => { return card; });
    let shuffledDeck = shuffleCards(savedCards);
    let hands = {};

    let cardIds = shuffledDeck.map((card) => { return card.id; });

    users.forEach((user) => {
      hands[user.username] = cardIds.splice(0, 13);
      hands[user.username].sort((a, b) => {
        return a - b;
      });
    });

    return hands;
  },
  createStartingScores: function(users) {
    let scores = {};
    users.forEach((user) => {
       scores[user.username] = 0;
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
  censorHands: function(hands, username) {
    let newHands = hands;
    for(let user in newHands) {
      if(user != username) {
        delete newHands[user];
      }
    }
    return newHands;
  },
  censorPlayedCards: function(playedCards) {
    let played = playedCards.map((player) => {
      return { username: player.username, card: player.card.src };
    });

    return played;
  },
  approveCard: function(card, state, username) {
    let leadSuit = state.played[0].card.suit;
    console.log("Lead suit:", leadSuit);
    let cardSuits = state.hands[username].map((num) => {
      return cardsKey.find((card) => { return num === card.id; });
    }).filter((card) => { return card.suit === leadSuit; });
    console.log("Num of cards in that suit", cardSuits);

    if(state.hands[username].indexOf(2) > -1 && card.id !== 2) {
      return false;
    } else if(card.suit !== leadSuit && cardSuits.length > 0) {
      return false;
    } else {
      return true;
    }
  },
  // Find the player with highest card of the lead suit
  trickKeeper: function(playedCards) {
    let leadSuit = playedCards[0].card.suit;
    let leadValue = playedCards[0].card.faceValue;
    if(leadValue === 1) {
      leadValue = 14;
    }

    let winner = playedCards.reduce((acc, play) => {
      let value = play.card.faceValue;
      if(value === 1) {
         value = 14;
      }
      if(play.card.suit === leadSuit && value > leadValue) {
        leadValue = value;
        return play;
      } else {
        return acc;
      }
    });
    return winner;
  },
  updateScore: function(playedCards, state) {
    let winner = this.trickKeeper(playedCards);
    let points = 0;
    let hearts = playedCards.filter((play) => { return play.card.suit === "hearts"; });
    if(playedCards.find((play) => { return play.card.id === 51; })){
      points += 13;
    }

    points += hearts.length;
    state.scores[winner.username] += points;
    state.turn = [winner.username];

    return state;
  },
  newRound: function(state, playedCards) {
    let firstUser = Object.keys(state.hands)[0];
    if(state.hands[firstUser].length === 0) {
      state.round += 1;

      let winner = this.trickKeeper(playedCards);

      let users = [];
      for(let user in state.scores) {
        users.push({ username: user });
      }
      state.hands = this.createStartingHands(users);
      state.turn = gameType(2).firstTurn(state.hands);
    }
    return state;
  },
  nextTurn: function(playedCards, scores) {
    let lastPlay = playedCards[playedCards.length - 1];
    let rotation = Object.keys(scores);
    let index = rotation.indexOf(lastPlay.username);
    let turn = [];
    if(index === 3) {
      turn = [rotation[0]];
    } else {
      turn = [rotation[index + 1]];
    }
    return turn;
  },
  checkEnd: function(state) {
    for(let user in state.scores) {
      if(state.scores[user] > 100 && state.hands[user].length === 0) {
        let winner = [];
        lowest = state.scores[user];
        for(let player in state.scores) {
          if(state.scores[player] < lowest) {
            lowest = state.scores[player];
            winner = [player];
          } else if(state.scores[player] === lowest) {
            winner.push(player);
          }
        }
        return winner;
      }
    }
    return false;
  }
};

// Determine whether to use Goofspiel or Hearts logic
const gameType = function(gameNameId) {
  if(gameNameId == 1) {
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

const censorState = function(games, username) {
  let censoredGames = games.map((game) => {
    let scores = Object.assign({}, game.state.scores);
    delete scores.deck;

    // Delete other users hands before sending hands to client
    let hands = gameType(game.game_name_id).censorHands(game.state.hands, username);

    // Convert cards in the hand to strings for image display
    for(let hand in hands) {
      hands[hand] = convertAllCards(hands[hand]);
    }

    let newState = {
      hands,
      scores,
      round: game.state.round,
      turn: game.state.turn,
      played: gameType(game.game_name_id).censorPlayedCards(game.state.played, username)
    };
    game.state = newState;

    return game;
  });

  return censoredGames;
};

const advanceGame = function(gameNameId, state, username) {
  let game = gameType(gameNameId);
  let playedCards = state.played;
  let userCard = playedCards.filter((user) => { return user.username === username; });
  let usersTurn = state.turn.indexOf(username) > -1;

  // Update the users hands based on played cards
  let lastPlayed = playedCards[playedCards.length - 1];
  let index = state.hands[lastPlayed.username].indexOf(lastPlayed.card.id);
  state.hands[lastPlayed.username].splice(index, 1);

  if(userCard.length > 1 || !usersTurn || !game.approveCard(userCard[0].card, state, username )) {
    // If the card isn't approved then don't add the card to played cards
    return false;
  } else if(state.played.length < gamePlayerNumbers[gameNameId]) {
    state.turn = game.nextTurn(playedCards, state.scores);
    return state;
  } else {
    let newState = game.updateScore(playedCards, state);
    let winner = game.checkEnd(newState);

    newState = game.newRound(newState, playedCards);
    state.played = [];
    if(state.hands.deck) {
      state.hands.deck.shift();
    }

    if(winner) {
      newState.winner = winner;
    }

    return newState;
  }
};

module.exports = {
  convertCardToString,
  stringToCard,
  convertAllCards,
  advanceGame,
  makeState,
  censorState,
  gameType
};
