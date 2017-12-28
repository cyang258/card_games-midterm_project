$(() => {

  const getRankings = function() {
    $.ajax({
      method: "GET",
      url: `3/history`,
      dataType: "JSON"
    }).done((games) => {
      games.forEach((game, i) => {
        let $newRow = $(
          `<tr>
            <td>${game.name}</td>
            <td>${game.id}</td>
            <td>${game.start_date}</td>
            <td>${game.end_date}</td>
            <td>${game.opponents}</td>
            <td>${game.score}</td>
          </tr>`);
        $(".history").append($newRow);
      });
    });
  };

  getRankings();

});
