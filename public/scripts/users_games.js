$(() => {
  const renderCards = function(cards) {
    cards.forEach( (card) => {
      let $cardImage = $(`<img class="${card}" src="/images/cards/${card}.png" height="70" width="50">`);
      $('.user-hand').append($cardImage);
    });
  };

  const confirmCard = function(event) {
    let $image = $('.deck').find('img');
    // $('.confirm').off(confirmCard);
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
    $('.deck').append($(`<button class="confirm">Confirm</button>`));
    $('.confirm').click(confirmCard);
    $('.deck').append($card);
  };

  const checkGameState = function() {
    $.ajax({
      method: "GET",
      url: "/cards/games/1/lobby",   // Replace with gameId
      dataType: 'JSON'
    }).then((lobby) => {
      if(lobby) {
        checkGameState(lobby.gameId);
      }
    });
  };

  $('.join-lobby').click(function() {
    $.ajax({
      method: "POST",
      url: "/cards/games/join/1",   // Replace with gameNameId
      data: $.param({userId: 4, gameNameId: 1})   // Replace with gameNameId and userId
    }).then(() => {
      console.log("Done joining lobby");
    });
    setInterval(checkGameState, 5000);
  });


const getGameState = function(gameId) {
  $.ajax({
    method: "GET",
    url: `/cards/games/${gameId}`   // Replace with gameId
  }).done((state) => {
    console.log("Respose from GET request to game:", state.hands["4"]); // Replace with userId
    renderCards(state.hands["4"]);    // Replace with userId
  }).then(() => {
    $('.user-hand').click(clickCard);
  });
};

});
