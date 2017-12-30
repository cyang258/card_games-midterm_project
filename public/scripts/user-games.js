$(() => {
  // Global interval variables
  let lobbyTimer;
  let gameTimer;
  // $(".deck").data("game-id", 1);

  // Timer to check game state
  const setGameTimer = function() {
    gameTimer = setInterval(checkGames, 1000);
  };

  const clearGameTimer = function() {
    clearInterval(gameTimer);
  };

  const findElementByData = function(array, data, value) {
    array.forEach((element) => {
      if(element.data(data, value)) {
        return element;
      }
    });
  };

  const makeGameActive = function(gameId) {
    $(".game-table").children().hide();
    $(".game-tab").each(function() {
      if($(this).text() == gameId) {
        $(".active-tab").removeClass("active-tab");
        $(this).addClass("active-tab");
      }
    });
    $(".game-table").children().each(function() {
      if($(this).data("gameId") == gameId) {
        $(".active-table").removeClass("active-table");
        $(this).addClass("active-table");
        $(this).show();
      }
    });
  };

  // Makes a new table and assigns the appropriate gameId
  const createNewGame = function(gameId) {
    let $table = $(
      `<figure class="game-room">
        <header class="opponent">
          <h6></h6><span class="opponent-score"></span>
        </header>

        <div class="board-middle">
          <header class="opponent">
            <h6></h6><span class="opponent-score"></span>
          </header>
          <section class="deck">
            <h6>Deck</h6>
            <object class="deck-display">
              <img src="/images/cards/cardback.png">
            </object>
            <div class="play-area">
            </div>
          </section>
          <header class="opponent">
            <h6></h6><span class="opponent-score"></span>
          </header>
        </div>

        <footer>
          <h6>Your Hand, Score: <span class="user-score"></span></h6>
          <object class="user-hand">
          </object>
        </footer>
      </figure>`
      );
    $table.data("game-id", gameId);

    return $table;
  };

  const makeButton = function(gameNameId, gameId) {
    let $button = $(
          `<button class="game-tab">New Game
            <span class="close-tab"><strong>&times;</strong></span>
          </button>`)
      .data("game-name-id", gameNameId)
      .data("game-id", gameId);

    return $button;
  };

  // Change score elements to reflect score
  const updateScore = function(scores, userId) {
    $(".active-table .user-score").text(scores.user);

    for(let opponent in scores.opp) {
      $(`.active-table .${opponent} .opponent-score`).text(`Score: ${scores.opp[opponent]}`);
    }
  };

  const addOpponents = function(scores) {
    let opps = Object.keys(scores.opp);
    $(".active-table .opponent").each(function() {

      if(opps[0]) {
        $(this).addClass(opps[0]);
        $(this).addClass("active-opp").addClass(opps[0]);
        $(this).find("h6").text(`Username: ${opps[0]}`);
        opps.shift();
      }
    });
  };

  // Display a users hand
  const renderCards = function(cards) {
    let $hand = $(".active-table .user-hand");
    $hand.empty();

    cards.forEach((card, i) => {
      let $cardImage = $(`<img class="${card}" style="order:${i + 1};" src="/images/cards/${card}.png">`);
      $hand.append($cardImage);
    });
  };

  const findTabById = function(gameId) {
    $(".game-tab").each(function() {
      if($(this).data("game_id") === gameId) {
        return $(this);
      }
    });
    return null;
  };

  // Updates to the appropriate game after clicking tab
  const clickGameTab = function(event) {
    let gameId = $(this).data("game-id"); // Get gameId from button

    makeGameActive(gameId);
  };

  // Update game tabs for turn
  const updateTabs = function(games, userId) {
    // If there are no tabs then make them
    if(!$(".game-tab")[0]) {
      $(".game-room").remove();
      games.forEach((game) => {
        let $button = makeButton(game.game_name_id, game.game_id).text(game.game_id);
        $(".games").append($button);

        let $newTable = createNewGame(game.game_id).hide();
        $(".game-table").append($newTable);       // Add button and table for each game
      });
      makeGameActive(games[0].game_id);
      $(".game-tab").off("click", clickGameTab);
      $(".game-tab").click(clickGameTab);        // Reset tab event listener
    }

    let $buttons = $(".game-tab");
    $buttons.each(function() {
      let gameId = $(this).data("game-id");
      let game = games.find((game) => { return game.game_id === gameId; });

      if(game && (!game.state || game.state.turn.indexOf(userId) === -1)) {
        $(this).removeClass("user-turn");
      } else {
        $(this).addClass("user-turn");   // Add a class to each tab where it is the users turn
      }
    });
  };

  const updatePlayedCards = function(game, userId) {
    let $userPlay = $(".active-table .play-area");
    let userPlayed = game.state.played.find((player) => { return player.userId == userId; });

    if(!userPlayed) {
      $userPlay.find(".played-card").remove();
    }

    let $opp = $(`.active-table .active-opp`);
    $opp.find("img").remove();

    game.state.played.forEach((player) => {
      let $card = $(`<img class="${player.card}" src="/images/cards/${player.card}.png">`).addClass("played-card");
      if(player.userId == userId) {
        $userPlay.find("img").remove();
        $userPlay.append($card);
      } else {
        $(`.active-table .${player.userId}`).append($card);
      }
    });
  };

  const updateDeck = function(card) {
    $(".active-table .deck-flipped").remove();
    $(".active-table .deck-display").append(
      `<img class="deck-flipped" src="/images/cards/${card}.png">`
      );
  };
  // Update to the beginning of the next round
  const updateDisplay = function(games) {
    let { activeGames, lobbyGames, finishedGames, userId } = games;

    if(!activeGames[0] && !lobbyGames[0] && !$(".active-tab")[0]) {
      return;
    }
    let allGames = activeGames.concat(lobbyGames);
    updateTabs(allGames, userId);

    let gameId = $(".active-table").data("game-id");
    console.log("Game id:", gameId);
    let gameOver = finishedGames.find((game) => { return game.game_id == gameId; });
    if(gameOver) {
      endGame(gameOver.state, userId, gameId);
    }

    if(activeGames[0]) {
      let game = activeGames.find((game) => { return game.game_id == gameId; });

      if(!$(".active-table .active-opp")[0]) {
        addOpponents(game.state.scores);
      }
      updatePlayedCards(game, userId);

      console.log("Game turn:", game.state.turn);
      console.log("Users turn?:", game.state.turn.indexOf(userId));
      console.log("Users id:", userId);
      $(".user-hand").off("click", clickCard);
      if(game.state.turn.indexOf(userId > -1)) {
        $(".user-hand").click(clickCard);
      }

      if(game.state.round !== $(".active-tab").data("round"))  {
        $(".active-tab").data("round", game.state.round);
        updateScore(game.state.scores);
        updateDeck(game.state.hands.deck[0]);
      }

      let usersCards = $(".active-table .user-hand img").length + $(".active-table .play-area img").length;
      if($(".active-table .play-area .played-card")[0]) {
        usersCards -= 1;
      }
      if(usersCards !== game.state.hands[userId].length) {
        renderCards(game.state.hands[userId]);    // Clears hand and renders new hand
      }
    }
  };

  // End of game display
  const endGame = function(state, userId, gameId) {
    // clearGameTimer();
    makeGameActive(gameId);
    console.log("In end game!")
    let gameNameId = $(".active-tab").data("game-name-id");
    let oppScores = [];
    for(let opp in state.scores.opp) {
      oppScores.push(state.scores.opp[opp]);
    }

    let won = state.winner.indexOf(userId);

    if(won === -1) {
      $(".board").append($(
        `<div class="end-message">
          <h3>${state.winner} Won!</h3>
          <h6>Better Luck Next Time!</h6>
        </div>`
        ));
    } else {
      $(".board").append($(
        `<div class="end-message">
          <h3>You Won!</h3>
          <h6>Congrats!</h6>
        </div>`
      ));
    }
    $(".active-tab").remove();
    $(".active-table").remove();
    $(".landing-screen").show();
    setTimeout(() => { $(".end-message").first().remove(); }, 3000);
  };

  // Check lobby to see if waiting, game has started, or not in any lobbies
  const checkGames = function() {
    $.ajax({
      method: "GET",
      url: "/cards/user/games",   // Replace with gameId
      dataType: "JSON"
    }).then((games) => {

      updateDisplay(games);
    });
  };

  // Confirm the card to play
  const confirmCard = function(event) {
    let gameId = $(".active-tab").data("game-id");
    let $image = $(".active-table .play-area img").first();
    let card = $image[0].className;
    $image.addClass("played-card");
    $(".active-table .confirm").off("click", confirmCard);
    $(".active-table .user-hand").off("click", clickCard);
    $(".active-table .confirm").remove();

    $.ajax({
      method: "POST",
      url: `/cards/games/${gameId}`,      // Replace with gameId
      data: $.param({ card }),
      statusCode: {
        404: function(result) {
        }
      }
    });
  };

  // Return any cards from staging area and play the clicked card
  const clickCard = function(event) {
    if($(".active-table .confirm")[0]) {
      let $image = $(".active-table .confirm").parent().find("img");
      $(".active-table .user-hand").append($image);
      $(".active-table .confirm").remove();
    }

    let $card = $(`.active-table .${event.target.className}`);
    $(".active-table .play-area").append($card);
    $(".active-table .play-area").append($(`<button class="confirm">Confirm</button>`));
    $(".active-table .confirm").click(confirmCard);
  };

  // Event handler for creating a game
  $(".join-lobby").click(function(event) {
    if($(".game-tab").length > 4) {
      return;
    }

    let gameNameId = $(this).data("game-name-id");

    $.ajax({
      method: "POST",
      url: `/cards/games/join/${gameNameId}`,   // Replace with gameNameId
      data: $.param({ gameNameId })   // Replace with gameNameId and userId
    }).then((res) => {

      let gameId = res[0];
      let $newTab = makeButton(gameNameId, gameId).text(gameId);
      $(".games").append($newTab);               // Append new tab and table

      let $newGame = createNewGame(gameId);
      $(".game-table").append($newGame);    // New game with gameId

      makeGameActive(gameId);

      $(".game-tab").off("click", clickGameTab);  // Reset tab event listeners
      $(".game-tab").click(clickGameTab);
    });
  });

setGameTimer();

});
