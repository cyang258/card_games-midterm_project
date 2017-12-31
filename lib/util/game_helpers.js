const cardsKey = require("./cards_export");

console.log("Cards:", cardsKey);

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
  console.log("cardsKey:", cardsKey);
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
    console.log("In checkEnd:", state.round);
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
    let cardSuits = state.hands[username].map((num) => {
      return cardsKey.find((card) => { return num === card.id; });
    }).filter((card) => { return card.suit === leadSuit; });

    if(state.hands[username].indexOf(2) > -1 && card.id !== 2) {
      return false;
    } else if(card.suit !== leadSuit && cardSuits.length > 1) {
      return false;
    } else {
      return true;
    }
  },
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
    console.log("Hearts in round:", hearts);
    if(playedCards.find((play) => { return play.card.id === 51; })){
      points += 13;
    }

    points += hearts.length;
    state.roundScores[winner.username] += points;

    if(state.hands[winner.username].length === 1) {
      for(let user of state.scores) {
        state.scores[user] += state.roundScores[user];
      }
    }

    return state;
  },
  newRound: function(state) {
    let firstUser = Object.keys(state.hands)[0];
    if(state.hands[firstUser].length === 0) {
      state.round += 1;

      let winner = this.trickKeeper(playedCards);
      state.turn = [ winner.username ];

      let users = [];
      for(let user in state.scores) {
        users.push({ username: user });
      }
      state.hands = this.createStartingHands(users);
      state.roundScores = this.createStartingScores(users);
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
      if(state.scores[user] > 100) {
        let winner = [];
        lowest = state.scores[user];
        for(let player in state.scores) {
          if(state.scores[player] < lowest) {
            winner = [player];
          } else if(state.score[player] === lowest) {
            winner.push(player);
          }
        }
        return winner;
      }
    }
    return false;
  }
};

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
  let roundScores = scores;                         // Only necessary for hearts
  let turn = game.firstTurn(hands);

  let state = {
    hands,
    scores,
    roundScores,
    round: 1,
    turn,
    played: []
  };

 return state;
};

const censorState = function(games, username) {
  let censoredGames = games.map((game) => {
    console.log("Game before censoring:", game.state.hands["Andrew"]);
    let oppScores = Object.assign({}, game.state.scores);
    delete oppScores.deck;
    delete oppScores[username];

    let hands = gameType(game.game_name_id).censorHands(game.state.hands, username);

    console.log("Hands:", hands)
    for(let hand in hands) {
      console.log("Hand in hands:", hand)
      hands[hand] = convertAllCards(hands[hand]);
      console.log("Hands after convert:", hands[hand]);
    }

    let newState = {
      hands,
      scores: {
        user: game.state.scores[username],
        opp: oppScores             // Change to usernames
      },
      round: game.state.round,
      turn: game.state.turn,
      played: gameType(game.game_name_id).censorPlayedCards(game.state.played, username)
    };
    game.state = newState;
    console.log("Censored game:", game.state.hands["Andrew"]);
    return game;
  });

  return censoredGames;
};

const advanceGame = function(gameNameId, state, username) {
  let game = gameType(gameNameId);
  let playedCards = state.played;
  let userCard = playedCards.filter((user) => { return user.username === username; });
  let usersTurn = state.turn.indexOf(username) > -1;

  let lastPlayed = playedCards[playedCards.length - 1];
  let index = state.hands[lastPlayed.username].indexOf(lastPlayed.card.id);
  state.hands[lastPlayed.username].splice(index, 1);
  console.log("User card length:", userCard.length, "User turn?:", usersTurn, "Approved?:");

  if(userCard.length > 1 || !usersTurn || !game.approveCard(userCard[0].card, state, username )) {
    console.log("Invalid play");
    return false;
  } else if(state.played.length < gamePlayerNumbers[gameNameId]) {
    console.log("Played 3:", state.played);
    state.turn = game.nextTurn(playedCards, state.scores);
    console.log("Not advancing yet, new state:", state);
    return state;
  } else {
    console.log("Updating score:");
    let newState = game.updateScore(playedCards, state);

    // Update the users hands based on played cards
    console.log("Updated scores:", newState);
    newState = game.newRound(newState);
    console.log("New round:", newState);
    state.played = [];
    if(state.hands.deck) {
      state.hands.deck.shift();
    }
    console.log("New hands:", newState);

    let winner = game.checkEnd(newState);
    if(winner) {
      newState.winner = winner;
    }

    console.log("New state after advance:", newState);
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
