$(() => {
  const renderCards = function(cards) {
    cards.forEach( (card) => {
      $('.user-hand').append(`<img class="${card}" src="/images/cards/${card}.png" height="70" width="50">`);
    });
  };

  const confirmCard = function(event) {
    let $image = $('.deck').find('img');
    console.log("confirming");

    $.ajax({
      method: "POST",
      url: "/cards/games/1",      // Replace with gameId
      data: $.param({ card: $image[0].className })
    }).then((result) => {
      console.log(result);
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

  $.ajax({
    method: "GET",
    url: "/cards/games/1"   // Replace with gameId
  }).done((state) => {
    console.log("From get:", state.hands["4"]); // Replace with userId
    renderCards(state.hands["4"]);    // Replace with userId
  }).then(() => {
    $('.user-hand').click(clickCard);
  });
});
