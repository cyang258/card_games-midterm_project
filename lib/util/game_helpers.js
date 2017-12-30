const cardsKey = require("./cards_export");

let gamePlayerNumbers = {
  1: 2,
  2: 4
};

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
        turn.push(parseInt(user));
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
  },
  censorPlayedCards: function(playedCards, userId) {
    let played = playedCards.map((player) => {
      let card = player.card.src;
      if(player.userId !== userId) {
        card = "cardback";
      }
      return { userId: player.userId, card };
    });

    return played;
  },
  approveCard: function(card, state, userId) {
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
      scores[player.userId] += deckCardValue;  // Replace with deck card value
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
    console.log("played cards:", playedCards);
    let users = Object.keys(scores);
    let parsedUsers = users.map((user) => { return parseInt(user); });
    console.log("Parsed users:", parsedUsers);
    console.log("Index:", parsedUsers.indexOf(playedCards[0].userId));
    parsedUsers.splice(parsedUsers.indexOf(playedCards[0].userId), 1);
    console.log("Parsed users:", parsedUsers);
    return parsedUsers;
  },
  checkEnd: function(state) {
    console.log("In checkEnd:", state.round);
    if(state.round > 13) {
      let winner = [];
      let highest = 0;
      for(let user in state.scores) {
        if(state.scores[user] > highest) {
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
    let shuffledDeck = shuffleCards(cardsKey.cards);
    let hands = {};

    let cardIds = shuffledDeck.map((card) => { return card.id; });

    users.forEach((user) => {
      hands[user.user_id] = cardIds.splice(0, 13);
      hands[user.user_id].sort((a, b) => {
        return b - a;
      });
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
  },
  censorPlayedCards: function(playedCards) {
    let played = playedCards.map((player) => {
      return { userId: player.userId, card: player.card.src };
    });

    return played;
  },
  approveCard: function(card, state, userId) {
    let leadSuit = state.played[0].card.suit;
    let cardSuits = state.hands[userId].map((num) => {
      return cardsKey.cards.find((card) => { return num === card.id; });
    }).filter((card) => { return card.suit === leadSuit; });

    if(state.hands[userId].indexOf(2) > -1 && card.id !== 2) {
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
    state.roundScores[winner.userId] += points;

    if(state.hands[winner.userId].length === 1) {
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
      state.turn = [ winner.userId ];

      let users = [];
      for(let user in state.scores) {
        users.push({ user_id: user });
      }
      state.hands = this.createStartingHands(users);
      state.roundScores = this.createStartingScores(users);
    }
    return state;
  },
  nextTurn: function(playedCards, scores) {
    let lastPlay = playedCards[playedCards.length - 1];
    let rotation = Object.keys(scores);
    let index = rotation.indexOf(lastPlay.userId.toString());
    let turn = [];
    if(index === 3) {
      turn = [parseInt(rotation[0])];
    } else {
      turn = [parseInt(rotation[index + 1])];
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

const censorState = function(games, userId) {
  let censoredGames = games.map((game) => {
    let oppScores = Object.assign({}, game.state.scores);
    delete oppScores.deck;
    delete oppScores[userId];

    let hands = gameType(game.game_name_id).censorHands(game.state.hands, userId);

    for(let hand in hands) {
      hands[hand] = convertAllCards(hands[hand]);
    }

    let newState = {
      hands,
      scores: {
        user: game.state.scores[userId.toString()],
        opp: oppScores             // Change to usernames
      },
      round: game.state.round,
      turn: game.state.turn,
      played: gameType(game.game_name_id).censorPlayedCards(game.state.played, userId)
    };
    game.state = newState;
    return game;
  });

  return censoredGames;
};

const advanceGame = function(gameNameId, state, userId) {
  let game = gameType(gameNameId);
  let playedCards = state.played;
  let userCard = playedCards.filter((user) => { return user.userId === userId; });
  let usersTurn = state.turn.indexOf(userId) > -1;

  let lastPlayed = playedCards[playedCards.length - 1];
  let index = state.hands[lastPlayed.userId].indexOf(lastPlayed.card.id);
  state.hands[lastPlayed.userId].splice(index, 1);
  console.log("User card length:", userCard.length, "User turn?:", usersTurn, "Approved?:");

  if(userCard.length > 1 || !usersTurn || !game.approveCard(userCard[0].card, state, userId )) {
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
