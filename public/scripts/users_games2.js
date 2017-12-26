$(() => {
  // Global interval variables
  let lobbyTimer;
  let gameTimer;
  $(".deck").data("gameId", 1);

  // Timer to check game state
  const setGameTimer = function() {
    gameTimer = setInterval(checkGames, 1000);
  };

  const clearGameTimer = function() {
    clearInterval(gameTimer);
  };

  // Change score elements to reflect score
  const updateScore = function(scores, userId) {
    $(".user-score").text(scores.user);
    $(".opponent-score").text(scores.opp);
  };

  // Display a users hand
  const renderCards = function(cards) {
    cards.forEach( (card) => {
      let $cardImage = $(`<img class="${card}" src="/images/cards/${card}.png">`);
      $(".user-hand").append($cardImage);
    });
  };

  // Update game tabs for turn
  const updateTabs = function(games, userId) {
    let $buttons = $(".games").find("button");
    console.log("The buttons:", $buttons[0]);

    if(!$buttons[0]) {
      games.forEach((game) => {
        let $button = $(
          `<button class="game-tab">New Game
            <span class="close-tab">x</span>
          </button>`).data("game-name-id", game.game_name_id);
        $button.data("game-id", game.id);
        $(".games").append($button);
      });
      $(".games").find("button").first().addClass("active-tab");
    }

    $(".game-tab").click(clickGameTab);

    games.forEach((game) => {
      let $button = $buttons.find(`[data-game-id="${game.id}"]`);
      if(!game.state.played.find((user) => { return user === userId; })) {
        $button.addClass("user-turn");
      }
    });
  };

  // Update to the beginning of the next round
  const updateGame = function(state) {
    console.log("Game state to update to:", state);
    // Scores
    updateScore(state.scores);
    if(state.turn === 13) {
      $(".deck-display").children().first().remove();
    }

    // User hand
    let $hand = $(".user-hand");
    $(".active-tab").data("turn", state.turn);
    $hand.empty();
    $(".play-area").empty();

    renderCards(state.hands.user);    // Replace with userId
    $(".user-hand").click(clickCard);

    // Deck and play-area
    $(".deck-flipped").remove();
    $(".deck-display").append(`<img class="deck-flipped" src="/images/cards/${state.hands.deck}.png">`);
    $(".play-area").append(`<img class="deck-flipped" src="/images/cards/${state.hands.deck}.png">`);
  };

  // End of game display
  const endGame = function(state) {
    console.log("Ending game...");
    // clearGameTimer();

    $(".play-area").empty();
    if(state.score.user >= state.score.opp) {
      $(".play-area").append($(`<p>You Win!</p>`));
    } else {
      $(".play-area").append($(`<p>Better Luck Next Time!</p>`));
    }
  };

  // Check lobby to see if waiting, game has started, or not in any lobbies
  const checkGames = function() {
    $.ajax({
      method: "GET",
      url: "/cards/games/1/lobby",   // Replace with gameId
      dataType: "JSON"
    }).then((games) => {
      console.log("Returned games from Game check:", games);
      // clearGameTimer();
      if(!games.censoredGames[0] && !games.lobbyGames[0]) {
        return;
      } else {
        updateTabs(games, games.userId);
        if(games.censoredGames[0]) {

          let savedTurn = $(".active-tab").data("turn");
          let gameId = $(".active-tab").data("game-id");
          let game = games.censoredGames.find((game) => { return game.id === gameId; });
          if(savedTurn === game.state.turn && gameId === game.id) {
            console.log("Game state and turn are same");
            return;
          } else if(game.state.turn === 0 && gameId === game.id) {
            console.log("Game state is same and turn changed");
            endGame(game.state);
          } else {
            console.log("Update game");
            updateGame(game.state, games.userId);
          }
        }
        // setGameTimer();
      }
    });
  };

  // Confirm the card to play
  const confirmCard = function(event) {
    let gameId = $(".active-tab").data("gameId");
    let $image = $(".play-area").find("img");
    $(".confirm").off("click", confirmCard);
    $(".user-hand").off("click", clickCard);
    $(".confirm").remove();

    $.ajax({
      method: "POST",
      url: `/cards/games/${gameId}`,      // Replace with gameId
      data: $.param({ card: $image[0].className })
    }).then((result) => {
      if(!result) {
        return;
      } else {
      console.log("The result from confirm:", result);
      }
    });
  };

  // Return any cards from staging area and play the clicked card
  const clickCard = function(event) {
    if($(".confirm")[0]) {
      let $image = $(".confirm").parent().find("img");
      $(".user-hand").append($image);
      $(".confirm").remove();
    }

    let $card = $(`.${event.target.className}`);
    $(".play-area").append($(`<button class="confirm">Confirm</button>`));
    $(".confirm").click(confirmCard);
    $(".play-area").append($card);
  };

  // Event handler for creating a game
  $(".join-lobby").click(function(event) {
    if($(".game-tab").length > 4) {
      return;
    } else {
      let gameNameId = $(this).data("game-name-id");
      let $gameTab = $(
        `<button class="game-tab">New Game
        <span class="close-tab">x</span>
        </button>`).data("game-name-id", gameNameId);
      $(".active-tab").removeClass("active-tab");
      $gameTab.addClass("active-tab");

      let $newTab = $(".games").append($gameTab);

      $.ajax({
        method: "POST",
        url: `/cards/games/join/${gameNameId}`,   // Replace with gameNameId
        data: $.param({gameNameId: 1})   // Replace with gameNameId and userId
      }).then((res) => {
        console.log("Response from join/create game:", res);
        if(res === 404) {
          return;
        }
        $gameTab.data("game-id", res[0]);
        $(".game-tab").off("click", clickGameTab);
        $(".game-tab").click(clickGameTab);

      $table.data("game-id", res[0]);

        // $(".game-tab").off("click", clickGameTab);
        // clearGameTimer();
        // setGameTimer();
      });
    }
  });

  const clickGameTab = function(event) {
    $(".active-tab").removeClass("active-tab");
    $(this).addClass("active-tab");
  };

  // Event handler for game tabs




setGameTimer();

});
