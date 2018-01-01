$(() => {
  // Global interval variables
  let lobbyTimer;
  let gameTimer;

  let gameNames = {
    1: "Goofspiel",
    2: "Hearts"
  };

  // Timer to check game state
  const setGameTimer = function() {
    gameTimer = setInterval(checkGames, 1000);
  };

  const clearGameTimer = function() {
    clearInterval(gameTimer);
  };

  // Escape user input to prevent XSS
  const escape = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Make the gameId the active tab and table
  const makeGameActive = function(gameId) {
    $(".game-table").children().hide();
    $(".game-tab").each(function() {
      if($(this).data("game-id") === gameId) {
        $(".active-tab").removeClass("active-tab");
        $(this).addClass("active-tab");
      }
    });
    $(".game-table").children().each(function() {
      if($(this).data("gameId") === gameId) {
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
          <a></a>
          <p class="opponent-score"></p>
        </header>

        <div class="board-middle">
          <aside class="opponent">
            <a></a>
            <p class="opponent-score"></p>
          </aside>
          <section class="deck">
            <object class="deck-display">
              <img src="/images/cards/cardback.png">
            </object>
            <div class="play-area">
            </div>
          </section>
          <aside class="opponent">
            <a></a>
            <p class="opponent-score"></p>
          </aside>
        </div>

        <footer>
          <p>Your Hand, Score: <span class="user-score"></span></p>
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
  const updateScore = function(scores, username) {
    $(".active-table .user-score").text(scores[username]);

    for(let opponent in scores) {
      $(`.active-table .${opponent} .opponent-score`).text(`Score: ${scores[opponent]}`);
    }
  };

  const addOpponents = function(scores, username) {
    let users = Object.keys(scores);
    let numPlayers = users.length;
    let userFirst = users.splice(users.indexOf(username)).concat(users);
    let clockwiseOrder = userFirst.splice(2, 1).concat(userFirst.slice(1));
    console.log("Scores;", scores);
    console.log("clockwiseOrder;", clockwiseOrder);

    $(".active-table .opponent").each(function() {

      if(clockwiseOrder[0]) {
        $(this).addClass(clockwiseOrder[0]);
        $(this).addClass("active-opp").addClass(clockwiseOrder[0]);
        $(this).find("a").text(clockwiseOrder[0]);
        $(this).find("a").attr("href", `/cards/users/${clockwiseOrder[0]}`);
        clockwiseOrder.shift();
      }
    });
  };

  // Display a users hand
  const renderCards = function(cards) {
    let $hand = $(".active-table .user-hand");
    $hand.empty();

    cards.forEach((card, i) => {
      let $cardImage = $(
        `<img class="${card}" style="order:${i + 1};" src="/images/cards/${card}.png">`
        );
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
    let gameId = $(this).data("game-id");

    makeGameActive(gameId);
  };

  // Update game tabs for turn
  const updateTabs = function(games, username) {
    // If there are no tabs then make them
    if(!$(".game-tab")[0]) {
      $(".game-room").remove();
      games.forEach((game) => {
        // Add button and table for each game
        let $button = makeButton(game.game_name_id, game.game_id);
        $button.text(`${gameNames[game.game_name_id]} (${game.game_id})`);
        $(".games").append($button);

        let $newTable = createNewGame(game.game_id).hide();
        $(".game-table").append($newTable);
      });
      makeGameActive(games[0].game_id);

      // Reset tab event listener
      $(".game-tab").off("click", clickGameTab);
      $(".game-tab").click(clickGameTab);
    }

    let $buttons = $(".game-tab");
    $buttons.each(function() {
      let gameId = $(this).data("game-id");
      let game = games.find((game) => { return game.game_id === gameId; });

      if(game && (!game.state || game.state.turn.indexOf(username) === -1)) {
        $(this).removeClass("user-turn");
      } else {
        $(this).addClass("user-turn");   // Add a class to each tab where it is the users turn
      }
    });
  };

  const updatePlayedCards = function(playedCards, username) {
    let $userPlay = $(".active-table .play-area");
    let userPlayed = playedCards.find((player) => { return player.username === username; });

    if(!userPlayed) {
      $userPlay.find(".played-card").remove();
    }

    let $opp = $(`.active-table .active-opp`);
    $opp.find("img").remove();

    playedCards.forEach((player) => {
      let $card = $(
        `<img class="${player.card}" src="/images/cards/${player.card}.png">`
        ).addClass("played-card");
      if(player.username === username) {
        $userPlay.find("img").remove();
        $userPlay.append($card);
      } else {
        $(`.active-table .${player.username}`).append($card);
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
    let { activeGames, lobbyGames, finishedGames, username } = games;

    console.log("Games from get request:", games);

    if(!activeGames[0] && !lobbyGames[0] && !$(".active-tab")[0]) {
      return;
    }
    let allGames = activeGames.concat(lobbyGames);

    // Update tabs to show if it is the users turn
    updateTabs(allGames, username);

    // If the current tabs game is over then show message
    let gameId = $(".active-table").data("game-id");
    let gameOver = finishedGames.find((game) => { return game.game_id === gameId; });
    if(gameOver) {
      endGame(gameOver.state, username, gameId);
    }

    let game = activeGames.find((game) => { return game.game_id === gameId; });
    if(game) {
      console.log("Turn:", game.state.turn);
      console.log("Played:", game.state.played);
      console.log("Scores:", game.state.scores, "Round scores:", game.state.roundScores);

      if($(".active-table")[0] && !$(".active-table .active-opp")[0]) {
        addOpponents(game.state.scores, username);
      }
      updatePlayedCards(game.state.played, username);

      // Turn event handlers on or off depending on whose turn it is
      $(".user-hand").off("click", clickCard);
      if(game.state.turn.indexOf(username) > -1) {
        $(".user-hand").click(clickCard);
      }

      // If the game is in a new round then update scores
      if(game.state.played.length !== $(".active-tab").data("played"))  {
        $(".active-tab").data("played", game.state.played.length);
        updateScore(game.state.scores, username);
        if(game.game_name_id === 1) {
          updateDeck(game.state.hands.deck[0]);
        }
      }

      // Calculates how many cards should be present to update hand accordingly
      let usersCards = $(".active-table .user-hand img").length
                       + $(".active-table .play-area img").length;
      if($(".active-table .play-area .played-card")[0]) {
        usersCards -= 1;
      }
      if(usersCards !== game.state.hands[username].length) {
        renderCards(game.state.hands[username]);    // Clears hand and renders new hand
      }
    }
  };

  // End of game display
  const endGame = function(state, username, gameId) {
    makeGameActive(gameId);
    let gameNameId = $(".active-tab").data("game-name-id");
    let oppScores = [];
    for(let opp in state.scores.opp) {
      oppScores.push(state.scores.opp[opp]);
    }

    let won = state.winner.indexOf(username);

    if(won === -1) {
      $(".board").append($(
        `<div class="end-message">
          <h3>${escape(state.winner)} Won!</h3>
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
    let otherGames = $(".active-table").siblings();
    if(otherGames.length > 1) {
    }
    $(".active-tab").remove();
    $(".active-table").remove();
    $(".landing-screen").show();
    setTimeout(() => { $(".end-message").first().remove(); }, 3000);
  };

  // Check to see what games the user has
  const checkGames = function() {
    $.ajax({
      method: "GET",
      url: "/cards/user/games",
      dataType: "JSON",
      statusCode: {
        401: function(xhr) {
          clearGameTimer();
        }
      }
    }).then((games) => {

      if(!games) {
        return;
      }
      updateDisplay(games);
    });
  };

  // Confirm the card to play
  const confirmCard = function(event) {
    let gameId = $(".active-tab").data("game-id");
    let $image = $(".active-table .play-area img").first();
    let card = $image[0].className;
    $image.addClass("played-card");

    // Turn off event listeners and remove the confirm button
    $(".active-table .confirm").off("click", confirmCard);
    $(".active-table .user-hand").off("click", clickCard);
    $(".active-table .confirm").remove();

    $.ajax({
      method: "PUT",
      url: `/cards/games/${gameId}`,
      data: $.param({ card }),
      statusCode: {
        400: function(xhr) {
          $(".active-table footer").append($(
            `<p class="error">${xhr.responseText}</p>`));
          setTimeout(function() { $(".error").remove(); }, 2000);
        }
      }
    });
  };

  // Return any cards from staging area and play the clicked card
  const clickCard = function(event) {
    if(event.target.className === "user-hand") {
      return;
    }
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
      url: `/cards/games/join/${gameNameId}`,
      data: $.param({ gameNameId }),
      statusCode: {
        401: function(xhr) {
            $(".board").prepend($(
              `<p class="error">${xhr.responseText}</p>`));
            setTimeout(function() { $(".error").remove(); }, 2000);
        }
      }
    }).then((res) => {

      let gameId = res[0];
      let $newTab = makeButton(gameNameId, gameId);
      $newTab.text(gameNames[gameNameId] + " (" + gameId + ")");
      $(".games").append($newTab);          // Append new tab and table

      let $newGame = createNewGame(gameId);
      $(".game-table").append($newGame);    // New game with gameId

      makeGameActive(gameId);

      $(".game-tab").off("click", clickGameTab);  // Reset tab event listeners
      $(".game-tab").click(clickGameTab);
    });
  });

setGameTimer();

});
