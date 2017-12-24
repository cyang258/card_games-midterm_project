$(() => {
  let lobbyTimer;
  let gameTimer;
  $('.deck').data('gameId', 1);

  const setLobbyTimer = function() {
    lobbyTimer = setInterval(checkLobby, 1000);
  };

  const clearLobbyTimer = function() {
    clearInterval(lobbyTimer);
  };

  const setGameTimer = function() {
    gameTimer = setInterval(getGameState, 1000);
  };

  const clearGameTimer = function() {
    clearInterval(gameTimer);
  };

  const updateScore = function(scores) {
    $('.user-score').text(scores.user);
    $('.opponent-score').text(scores.opp);
  };

  const checkLobby = function() {
    $.ajax({
      method: "GET",
      url: "/cards/games/1/lobby",   // Replace with gameId
      dataType: 'JSON'
    }).then((lobby) => {
      if(lobby) {
        clearLobbyTimer();
        setGameTimer();
      }
    });
  };

  const renderCards = function(cards) {
    cards.forEach( (card) => {
      let $cardImage = $(`<img class="${card}" src="/images/cards/${card}.png">`);
      $('.user-hand').append($cardImage);
    });
  };

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

  $('.join-lobby').click(function() {
    let gameId = $('.deck').data('gameId');
    $.ajax({
      method: "POST",
      url: `/cards/games/join/${gameId}`,   // Replace with gameNameId
      data: $.param({userId: 2, gameNameId: 1})   // Replace with gameNameId and userId
    }).then((res) => {
      if(res === 404) {
        return;
      }
      setLobbyTimer();
    });
  });


const getGameState = function() {
  let gameId = $('.deck').data('gameId');

  $.ajax({
    method: "GET",
    url: `/cards/games/${gameId}`   // Replace with gameId
  }).done((state) => {
    let $hand = $('.user-hand');
    if(!state || $hand.data('turn') === state.turn) {
      return;
    }
    console.log("Turn:", state.turn);
    console.log("Scores:",  state.score);

    if(state.turn !== 0) {
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
    } else {
      clearGameTimer();

      if(state.score.user >= state.score.opp) {
        $('.play-area').append($(`<p>You Win!</p>`));
      } else {
        $('.play-area').append($(`<p>Better Luck Next Time!</p>`));
      }
    }
  });
};

setLobbyTimer();

});
