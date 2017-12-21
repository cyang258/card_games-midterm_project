$(() => {
  const renderCards = function(cards) {
    cards.forEach( (card) => {
      $('.user-hand').append(`<img src="/images/cards/${card}.png" height="70" width="50">`);
    });
  };

  $.ajax({
    method: "GET",
    url: "/cards/games/1"
  }).done((state) => {
    console.log("From get:", state.hands["4"]);
    renderCards(state.hands["4"]);
  });
});
