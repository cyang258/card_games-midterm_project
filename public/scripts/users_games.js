$(() => {
  // Global interval variables
  let lobbyTimer;
  let gameTimer;
  $('.deck').data('gameId', 1);

  // Timer to check game state
  const setGameTimer = function() {
    gameTimer = setInterval(checkGames, 1000);
  };

  const clearGameTimer = function() {
    clearInterval(gameTimer);
  };

  // Change score elements to reflect score
  const updateScore = function(scores) {
    $('.user-score').text(scores.user);
    $('.opponent-score').text(scores.opp);
  };

  // Display a users hand
  const renderCards = function(cards) {
    cards.forEach( (card) => {
      let $cardImage = $(`<img class="${card}" src="/images/cards/${card}.png">`);
      $('.user-hand').append($cardImage);
    });
  };

  // Update to the beginning of the next round
  const updateGame = function() {
    updateScore(state.score);
    if(state.turn === 13) {
      $('.deck-display').children().first().remove();
    }
    $hand.data('turn', state.turn);
    $hand.empty();
    $('.play-area').empty();

    renderCards(state.user);    // Replace with userId
    $('.deck-flipped').remove();
    $('.deck-display').append(`<img class="deck-flipped" src="/images/cards/${state.deck}.png">`);
    $('.user-hand').click(clickCard);
  };

  // End of game display
  const endGame = function() {
    clearGameTimer();

    $('.play-area').empty($(`<p>You Win!</p>`));
    if(state.score.user >= state.score.opp) {
      $('.play-area').append($(`<p>You Win!</p>`));
    } else {
      $('.play-area').append($(`<p>Better Luck Next Time!</p>`));
    }
  };

  // Check lobby to see if waiting, game has started, or not in any lobbies
  const checkGames = function() {
    $.ajax({
      method: "GET",
      url: "/cards/games/1/lobby",   // Replace with gameId
      dataType: 'JSON'
    }).then((games) => {
      console.log("Returned games from Game check:", games);
      clearGameTimer();
      if(games.activeGames[0] || games.lobbyGames[0]) {
        if(games.activeGames[0]) {
          // function to update tabs
        }
        setGameTimer();
      } else {
      }

      let gameId = $('.game-id').data('game-id');
      let state = (games.activeGames.find((game) => { return game.id === gameId; }) ||
                   games.lobbyGames.find((game) => { return game.id === gameId; }));


      let $hand = $('.user-hand');
      if(!state || $hand.data('turn') === state.turn) {
        return;
      }
      console.log("Turn:", state.turn);
      console.log("Scores:",  state.score);

      if(state.turn !== 0) {
        updateScore(state.score);
        updateGame();
      } else {
        endGame();
      }
    });
  };

  // Confirm the card to play
  const confirmCard = function(event) {
    let gameId = $('.deck').data('gameId');
    let $image = $('.play-area').find('img');
    $('.confirm').off("click", confirmCard);
    $('.user-hand').off("click", clickCard);
    $('.confirm').remove();

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
    if($('.confirm')[0]) {
      let $image = $('.confirm').parent().find('img');
      $('.user-hand').append($image);
      $('.confirm').remove();
    }

    let $card = $(`.${event.target.className}`);
    $('.play-area').append($(`<button class="confirm">Confirm</button>`));
    $('.confirm').click(confirmCard);
    $('.play-area').append($card);
  };

  // Event handler for creating a game
  $('.join-lobby').click(function(event) {
    let gameNameId = $(this).data('game-name-id');
    let $gameTab = $(
      `<button class="game-tab">New Game
      <span class="close-tab">x</span>
      </button>`).data('game-name-id', gameNameId);

    $('.games').append($gameTab);

    $.ajax({
      method: "POST",
      url: `/cards/games/join/${gameNameId}`,   // Replace with gameNameId
      data: $.param({gameNameId: 1})   // Replace with gameNameId and userId
    }).then((res) => {
      if(res === 404) {
        return;
      }
      clearGameTimer();
      setGameTimer();
    });
  });

// Updates the state of the current game
const getGameState = function() {
  let gameId = $('.deck').data('gameId');

  $.ajax({
    method: "GET",
    url: `/cards/games/${gameId}`   // Replace with gameId
  }).done((state) => {

  });
};

checkGames();

});
