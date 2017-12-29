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

    $(".game-table").children().hide(); // Hide other games and show current game
    $(".active-table").removeClass("active-table");
    $newTable.addClass("active-table");
    $newTable.show();
  };

  // Update game tabs for turn
  const updateTabs = function(games, userId) {
    let $buttons = $(".games").find("button");

    if(!$buttons[0]) {          // If there are no tabs then make them
      $(".game-table").empty();
      games.forEach((game) => {
        let $button = makeButton(game.game_name_id, game.game_id).text(game.game_id);
        $(".games").append($button);

        let $newTable = createNewGame(game.game_id).hide();
        $(".game-table").append($newTable);       // Add button and table for each game
      });
      $(".games").find("button").first().addClass("active-tab").show();
      $(".game-table").children().first().addClass("active-table").show(); // Show the first button and table

      $(".game-tab").click(clickGameTab); // Add tab event listener
    }

    $buttons = $(".games").find("button");

    $buttons.each(function(button) {  // Update buttons to show user turn
      let gameId = $(this).data("game-id");
      let game = games.find((game) => { return game.game_id === gameId; });

      if(game.state) {
        if(!game.state.played.find((player) => { return player["userId"] == userId; })) {
          $(this).addClass("user-turn");   // Add a class to each tab where it is the users turn
        } else {
          $(this).removeClass("user-turn");
        }
      }
    });
  };

  const updatePlayedCards = function(game, userId) {
    console.log("Game for update played cards:", game);
    let $userHand = $(".active-table .play-area");
    $userHand.find("img").remove();

    let $opp = $(`.active-table .active-opp`);
    $opp.find("img").remove();

    game.state.played.forEach((player) => {
      if(player.userId === userId) {
        $userHand.append($(`<img class="${player.card}" src="/images/cards/${player.card}.png">`).addClass("played-card"));
        $(".active-table .user-hand").off("click", clickCard);
      } else {
        $opp.append($(`<img class="${player.card}" src="/images/cards/${player.card}.png">`).addClass("played-card"));
      }
    });
  };

  // Update to the beginning of the next round
  const updateDisplay = function(state, userId) {
    // Scores
    updateScore(state.scores);
    if(state.turn === 13) {
      $(".active-table").find(".deck-display").children().first().remove();
    } else if(state.turn > 13) {
      endGame(state);
      return;
    }

    // User hand
    $(".active-table").find(".play-area").empty();

    renderCards(state.hands[userId]);    // Clears hand and renders new hand
    $(".user-hand").click(clickCard);

    // Deck and play-area
    $(".active-table").find(".deck-flipped").remove();
    $(".active-table").find(".deck-display").append(
      `<img class="deck-flipped" src="/images/cards/${state.hands.deck[0]}.png">`
      );
  };

  // End of game display
  const endGame = function(state) {
    // clearGameTimer();
    $(".active-table .play-area p").remove();
    let oppScores = [];
    for(let opp in state.scores.opp) {
      oppScores.push(state.scores.opp[opp]);
    }

    if(oppScores.find((score) => { return score > state.scores.user; })) {
      $(".active-table").find(".play-area").append($(`<p>Better Luck Next Time!</p>`));
    } else {
      $(".active-table").find(".play-area").append($(`<p>You Win!</p>`));
    }
  };

  // Check lobby to see if waiting, game has started, or not in any lobbies
  const checkGames = function() {
    $.ajax({
      method: "GET",
      url: "/cards/user/games",   // Replace with gameId
      dataType: "JSON"
    }).then((games) => {
      // clearGameTimer();
      if(!games.censoredGames[0] && !games.lobbyGames[0]) {
        return;
      } else {
        let activeGames = games.censoredGames;
        let allGames = activeGames.concat(games.lobbyGames);
        updateTabs(allGames, games.userId);

        if(activeGames[0]) {
          let gameId = $(".active-tab").data("game-id");
          let game = activeGames.find((game) => { return game.game_id == gameId; });
          let turn = game.state.turn.find((player) => { return player == games.userId; });
          console.log("Played length:", game.state.played.length, "Played card:", $(".active-table .played-card").length);
          if(game.state.played.length !== $(".active-table .played-card").length) {
            updatePlayedCards(game, games.userId);
          }

          if(!$(".active-table .active-opp")[0]) {
            addOpponents(game.state.scores);
          }
          console.log("Made it here!!!!!!!!!!!!!!!!! Game:", game);
          console.log("Turn:", turn, "Played Card:", $(".active-table .play-area img")[0]);
          if(game && ($(".active-table .user-hand img")[0] || game.state.hands[games.userId].length === 1) && (!turn || $(".active-table .play-area img")[0])) {
            return;
          } else {
            updateDisplay(game.state, games.userId);
          }
        }
        // setGameTimer();
      }
    });
  };

  // Confirm the card to play
  const confirmCard = function(event) {
    let gameId = $(".active-tab").data("game-id");
    let $image = $(".active-table .play-area img").first();
    $(".active-table .confirm").off("click", confirmCard);
    $(".active-table .user-hand").off("click", clickCard);
    $(".active-table .confirm").remove();

    $.ajax({
      method: "POST",
      url: `/cards/games/${gameId}`,      // Replace with gameId
      data: $.param({ card: $image[0].className })
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
    } else {
      let gameNameId = $(this).data("game-name-id");

      $.ajax({
        method: "POST",
        url: `/cards/games/join/${gameNameId}`,   // Replace with gameNameId
        data: $.param({ gameNameId })   // Replace with gameNameId and userId
      }).then((res) => {

        $(".active-tab").removeClass("active-tab");

        let $gameTab = makeButton(gameNameId, res[0]).text(res[0]);
        $gameTab.addClass("active-tab");

        $(".games").append($gameTab);               // Append new tab and table
        $(".game-table").children().hide();
        $(".active-table").removeClass("active-table");
        $(".game-table").append(createNewGame(res[0]).addClass("active-table"));    // New game with gameId


        $(".game-tab").off("click", clickGameTab);  // Reset tab event listeners
        $(".game-tab").click(clickGameTab);
      });
    }
  });

setGameTimer();

});
