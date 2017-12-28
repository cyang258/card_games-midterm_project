$(() => {

  const getRankings = function(event) {
    if(event.target !== $(".active-tab")) {
      $(".active-tab").removeClass("active-tab");
      $(this).addClass("active-tab");
      $("td").parent().remove();


      $.ajax({
        method: "GET",
        url: "rankings/1",
        dataType: "JSON"
      }).done((users) => {
        users.forEach((user, i) => {
          let $newRow = $(
            `<tr>
              <td>${i + 1}</td>
              <td>${user.username}</td>
              <td>${user.wins}</td>
            </tr>`);
          $(".rankings").append($newRow);
        });
      });
    }
  };

  $(".games button").click(getRankings);

});
