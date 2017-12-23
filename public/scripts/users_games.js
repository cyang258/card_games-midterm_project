$(() => {
  var lobbyTimer;

  const setLobbyTimer = function() {
    lobbyTimer = setInterval(function() {
      $.ajax({
        method: "GET",
        url: "/cards/games/1/lobby",   // Replace with gameId
        dataType: 'JSON'
      }).then((lobby) => {
        console.log("Lobby on return:", lobby);
        if(lobby) {
          getGameState(1);    //Hardcoded
          clearLobbyTimer();
        }
      });
    }, 1000);
  };

  const clearLobbyTimer = function() {
    clearInterval(lobbyTimer);
  };

  const renderCards = function(cards) {
    cards.forEach( (card) => {
      let $cardImage = $(`<img class="${card}" src="/images/cards/${card}.png" height="70" width="50">`);
      $('.user-hand').append($cardImage);
    });
  };

  const confirmCard = function(event) {
    let $image = $('.play-area').find('img');
    $('.confirm').off("click", confirmCard);
    $('.user-hand').off("click", clickCard);
    $('.confirm').remove();

    $.ajax({
      method: "POST",
      url: "/cards/games/1",      // Replace with gameId
      data: $.param({ card: $image[0].className })
    }).then((result) => {
      console.log("The result from confirm:", result);
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
    $.ajax({
      method: "POST",
      url: "/cards/games/join/1",   // Replace with gameNameId
      data: $.param({userId: 2, gameNameId: 1})   // Replace with gameNameId and userId
    }).then(() => {
      console.log("Done joining lobby");
    });
    setLobbyTimer();
  });


const getGameState = function(gameId) {
  $.ajax({
    method: "GET",
    url: `/cards/games/${gameId}`   // Replace with gameId
  }).done((state) => {
    if(state.null) {
      return;
    }

    let $hand = $('.user-hand');
    if($hand.data('turn') !== state.turn) {
      $('.confirm').parent().find('img').remove();
      $hand.data('turn', state.turn);
    }
    console.log("Respose from GET request to game:", state.user); // Replace with userId
    renderCards(state.user);    // Replace with userId
    $('.deck-flipped').remove();
    $('.deck-display').append(`<img class="deck-flipped" src="/images/cards/${state.deck}.png" height="70" width="50">`);

    $('.user-hand').click(clickCard);
  });
};

getGameState(1);  //Hardcoded check

});
