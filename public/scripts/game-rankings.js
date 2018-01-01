$(() => {

  const getRankings = function(event) {
    if(event.target !== $(".active-tab")) {
      $(".active-tab").removeClass("active-tab");
      $(this).addClass("active-tab");
      let gameNameId = $(this).data("game-name-id");
      $("td").parent().remove();

      $.ajax({
        method: "GET",
        url: "rankings/" + gameNameId,
        dataType: "JSON"
      }).done((users) => {
        users.forEach((user, i) => {
          let $newRow = $(
            `<tr>
              <td>${i + 1}</td>
              <td><a href="/cards/users/${user.username}">${user.username}</a></td>
              <td>${user.wins}</td>
            </tr>`);
          $(".rankings").append($newRow);
        });
      });
    }
  };

  $(".games button").click(getRankings);
  $(".games button").first().click();

});
