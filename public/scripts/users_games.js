$(() => {
  // Global interval variables
  let lobbyTimer;
  let gameTimer;
  $(".deck").data("game-id", 1);

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


  // Makes a new table and assigns the appropriate gameId
  const createNewGame = function(gameId) {
    let $table = $(
      `<figure>
        <header>
          <h3>Opponent <span class="opponent-score"></span></h3>
        </header>

        <section class="deck">
          <h3>Deck</h3>
          <object class="deck-display">
            <img src="/images/cards/cardback.png">
          </object>
          <div class="play-area">
          </div>
        </section>

        <footer>
          <h3>Your Hand <span class="user-score"></span></h3>
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
            <span class="close-tab">x</span>
          </button>`)
      .data("game-name-id", gameNameId)
      .data("game-id", gameId);

    return $button;
  };

  // Change score elements to reflect score
  const updateScore = function(scores, userId) {
    $(".active-table").find(".user-score").text(scores.user);
    $(".active-table").find(".opponent-score").text(scores.opp);
  };

  // Display a users hand
  const renderCards = function(cards) {
    let $hand = $(".active-table").find(".user-hand");
    $hand.empty();

    cards.forEach( (card) => {
      let $cardImage = $(`<img class="${card}" src="/images/cards/${card}.png">`);
      $hand.append($cardImage);
    });
  };

  // Updates to the appropriate game after clicking tab
  const clickGameTab = function(event) {
    $(".active-tab").removeClass("active-tab");

    $(this).addClass("active-tab");       // Move active-tab class to clicked button
    let gameId = $(this).data("game-id"); // Get gameId from button

    let $newTable;
    $(".game-table").children().each(function(index) {
      if($(this).data("game-id") == gameId) {
        $newTable = $(this);        // Make new table the game with the matching gameId
      }
    });
    console.log("New table after click:", $newTable);

    $(".game-table").children().hide(); // Hide other games and show current game
    $(".active-table").removeClass("active-table");
    $newTable.addClass("active-table");
    $newTable.show();
  };

  // Update game tabs for turn
  const updateTabs = function(games, userId) {
    let $buttons = $(".games").find("button");

    if(!$buttons[0]) {
      $(".game-table").empty();     // If there are no tabs then make them
      games.forEach((game) => {
        let $button = makeButton(game.game_name_id, game.id);
        $(".games").append($button);

        let $newTable = createNewGame(game.id).hide();
        $(".game-table").append($newTable);       // Add button and table for each game
      });
      $(".games").find("button").first().addClass("active-tab").show();
      $(".game-table").children().first().addClass("active-table").show(); // Show the first button and table

      $(".game-tab").click(clickGameTab); // Add tab event listener
    }

    $buttons = $(".games").find("button");

    $buttons.each(function(button) {  // Update buttons to show user turn
      let gameId = $(this).data("game-id");
      let game = games.find((game) => { return game.id === gameId; });

      if(game.state) {
        if(game.state.played.indexOf(userId) === -1) {
          $(this).addClass("user-turn");   // Add a class to each tab where it is the users turn
        }
      }
    });
  };

  // Update to the beginning of the next round
  const updateGame = function(state) {
    // Scores
    updateScore(state.scores);
    if(state.turn === 13) {
      $(".active-table").find(".deck-display").children().first().remove();
    }

    // User hand
    $(".active-tab").data("turn", state.turn);
    $(".active-table").find(".play-area").empty();

    renderCards(state.hands.user);    // Clears hand and renders new hand
    $(".user-hand").click(clickCard);

    // Deck and play-area
    $(".active-table").find(".deck-flipped").remove();
    $(".active-table").find(".deck-display").append(
      `<img class="deck-flipped" src="/images/cards/${state.hands.deck}.png">`
      );
    // $(".active-table").find(".play-area").append(
    //   `<img class="deck-flipped" src="/images/cards/${state.hands.deck}.png">`
    //   );
    // Replace with played card from game state
  };

  // End of game display
  const endGame = function(state) {
    // clearGameTimer();

    $(".active-table").find(".play-area").empty();
    if(state.score.user >= state.score.opp) {
      $(".active-table").find(".play-area").append($(`<p>You Win!</p>`));
    } else {
      $(".active-table").find(".play-area").append($(`<p>Better Luck Next Time!</p>`));
    }
  };

  // Check lobby to see if waiting, game has started, or not in any lobbies
  const checkGames = function() {
    $.ajax({
      method: "GET",
      url: "/cards/games/1/lobby",   // Replace with gameId
      dataType: "JSON"
    }).then((games) => {
      // clearGameTimer();
      if(!games.censoredGames[0] && !games.lobbyGames[0]) {
        return;
      } else {
        let censoredGames = games.censoredGames;
        let allGames = censoredGames.concat(games.lobbyGames);
        if(!$(".games").find("button")[0]) {
          updateTabs(allGames, games.userId);
        }
        if(games.censoredGames[0]) {

          let savedTurn = $(".active-tab").data("turn");
          let gameId = $(".active-tab").data("game-id");
          let game = games.censoredGames.find((game) => { return game.id === gameId; });
          console.log("Games being compared:", game);
          if(savedTurn === game.state.turn && gameId === game.id) {
            return;
          } else if(game.state.turn === 0 && gameId === game.id) {
            endGame(game.state);
          } else {
            updateGame(game.state, games.userId);
          }
        }
        // setGameTimer();
      }
    });
  };

  // Confirm the card to play
  const confirmCard = function(event) {
    let gameId = $(".active-tab").data("game-id");
    let $image = $(".active-table").find(".play-area").find("img");
    $(".active-table").find(".confirm").off("click", confirmCard);
    $(".active-table").find(".user-hand").off("click", clickCard);
    $(".active-table").find(".confirm").remove();

    $.ajax({
      method: "POST",
      url: `/cards/games/${gameId}`,      // Replace with gameId
      data: $.param({ card: $image[0].className })
    }).then((result) => {
      if(!result) {
        return;
      } else {
      }
    });
  };

  // Return any cards from staging area and play the clicked card
  const clickCard = function(event) {
    if($(".active-table").find(".confirm")[0]) {
      let $image = $("active-table").find(".confirm").parent().find("img");
      $(".active-table").find(".user-hand").append($image);
      $(".active-table").find(".confirm").remove();
    }

    let $card = $(`.${event.target.className}`);
    $(".active-table").find(".play-area").append($(`<button class="confirm">Confirm</button>`));
    $(".active-table").find(".confirm").click(confirmCard);
    $(".active-table").find(".play-area").append($card);
  };

  // Event handler for creating a game
  $(".join-lobby").click(function(event) {
    if($(".game-tab").length > 4) {
      return;
    } else {
      let gameNameId = $(this).data("game-name-id");

      $.ajax({
        method: "POST",
        url: `/cards/games/join/${gameNameId}`,   // Replace with gameNameId
        data: $.param({gameNameId: 1})   // Replace with gameNameId and userId
      }).then((res) => {

        $(".active-tab").removeClass("active-tab");

        let $gameTab = makeButton(gameNameId, res[0]);
        $gameTab.addClass("active-tab");

        $(".games").append($gameTab);               // Append new tab and table
        $(".game-table").children().hide();
        $(".game-table").append(createNewGame(res[0]));    // New game with gameId

        $(".game-tab").off("click", clickGameTab);  // Reset tab event listeners
        $(".game-tab").click(clickGameTab);
      });
    }
  });

setGameTimer();

});
