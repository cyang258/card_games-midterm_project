
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('users').del(),
    knex('game_names').del(),
    knex('games').del(),
    knex('user_games').del()
  ]).then(function () {
    return knex('users').insert({username: 'Andrew', email: 'andrew@gmail.com', password: 'pass'})
    .then(() => { return knex('users').insert({username: 'Chun', email: 'chun@gmail.com', password: 'pass'}); })
    .then(() => { return knex('users').insert({username: 'Tymm', email: 'tymm@gmail.com', password: 'pass'}); })
    .then(() => { return knex('users').insert({username: 'Bryan', email: 'bryan@gmail.com', password: 'pass'}); })
    .then(() => { return knex('users').insert({username: 'Mandy', email: 'mandy@gmail.com', password: 'pass'}); })
    .then(() => { return knex('users').insert({username: 'Matt', email: 'matt@gmail.com', password: 'pass'}); })
    .then(() => { return knex('users').insert({username: 'Mary', email: 'mary@gmail.com', password: 'pass'}); });
  }).then(function () {
    return knex('game_names').insert({name: 'goofspiel'})
      .then(() => { return knex('game_names').insert({name: 'hearts'});
     });
  }).then(function () {
    return knex('games').insert({game_name_id: 1, start_date: "2017-12-20", end_date: "2017-12-21", state: { hands: { "Andrew": [], "Chun": [], deck:[] }, scores: { "Andrew": 40, "Chun": 51 }, turn: 14, winner:["Chun"], played: []}})
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-21", end_date: "2017-12-22", state: { hands: { "Chun": [], "Tymm": [], deck:[] }, scores: { "Chun": 45, "Tymm": 46 }, round: 14, winner:["Tymm"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-19", end_date: "2017-12-20", state: { hands: { "Bryan": [], "Matt": [], deck:[] }, scores: { "Bryan": 61, "Matt": 30 }, round: 14, winner:["Bryan"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-15", end_date: "2017-12-16", state: { hands: { "Mandy": [], "Chun": [], deck:[] }, scores: { "Mandy": 55, "Chun": 36 }, round: 14, winner:["Mandy"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-17", end_date: "2017-12-18", state: { hands: { "Tymm": [], "Mary": [], deck:[] }, scores: { "Tymm": 43, "Mary": 48 }, round: 14, winner:["Mary"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-16", end_date: "2017-12-17", state: { hands: { "Andrew": [], "Mary": [], deck:[] }, scores: { "Andrew": 42, "Mary": 49 }, round: 14, winner:["Mary"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-12", end_date: "2017-12-13", state: { hands: { "Bryan": [], "Mandy": [], deck:[] }, scores: { "Bryan": 52, "Mandy": 39 }, round: 14, winner:["Bryan"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-11", end_date: "2017-12-12", state: { hands: { "Chun": [], "Matt": [], deck:[] }, scores: { "Chun": 63, "Matt": 28 }, round: 14, winner:["Chun"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-20", end_date: "2017-12-21", state: { hands: { "Tymm": [], "Andrew": [], deck:[] }, scores: { "Tymm": 44, "Andrew": 47 }, round: 14, winner:["Andrew"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-18", end_date: "2017-12-19", state: { hands: { "Mary": [], "Bryan": [], deck:[] }, scores: { "Mary": 41, "Bryan": 50 }, round: 14, winner:["Bryan"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-30", end_date: "2017-12-31", state: { hands: { "Matt": [], "Andrew": [], deck:[] }, scores: { "Matt": 52, "Andrew": 39 }, round: 14, winner:["Matt"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2017-12-27", end_date: "2017-12-28", state: { hands: { scores: { "Andrew": 106, "Chun": 93, "Tymm": 84, "Bryan": 90 }, winner:["Tymm"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2018-01-01", end_date: "2018-01-02", state: { hands: { scores: { "Bryan": 102, "Mandy": 84, "Matt": 75, "Mary": 60 }, winner:["Mary"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2018-01-03", end_date: "2018-01-03", state: { hands: { scores: { "Andrew": 110, "Tymm": 89, "Mandy": 66, "Mary": 70 }, winner:["Mandy"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2017-12-28", end_date: "2017-12-29", state: { hands: { scores: { "Andrew": 70, "Tymm": 63, "Mandy": 106, "Mary": 95 }, winner:["Bryan"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2017-12-29", end_date: "2017-12-30", state: { hands: { winner:["Matt"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2017-12-20", end_date: "2017-12-21", state: { hands: { winner:["Matt"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2018-01-03", end_date: "2018-01-04", state: { hands: { winner:["Andrew"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2017-12-27", end_date: "2017-12-28", state: { hands: { winner:["Chun"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2017-12-30", end_date: "2017-12-31", state: { hands: { winner:["Tymm"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2018-01-02", end_date: "2018-01-03", state: { hands: { winner:["Matt"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2017-12-19", end_date: "2017-12-20", state: { hands: { winner:["Mary"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2018-01-04", end_date: "2018-01-05", state: { hands: { winner:["Chun"] }}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2018-01-01", end_date: null, state: { hands: { "Andrew": [4, 9], "Chun": [18, 23], deck:[45, 48] }, scores: { "Andrew": 43, "Chun": 33 }, round: 12, turn: ["Andrew", "Chun"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2017-12-05", end_date: null, state: { hands: {
        "Andrew": [1, 7, 14, 15, 16, 22, 23, 25, 30, 37, 45, 48, 52],
        "Chun": [4, 8, 18, 28, 29, 34, 35, 38, 39, 40, 41, 47, 50],
        "Tymm": [2, 9, 10, 11, 12, 17, 19, 27, 31, 33, 44, 46, 49],
        "Bryan": [3, 5, 6, 13, 20, 21, 24, 26, 32, 36, 42, 43, 51]
      },
        scores: { "Andrew": 0, "Chun": 0, "Tymm": 0, "Bryan": 0 },
        round: 1,
        turn: ["Tymm"],
        played: []
      }}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2018-01-05", end_date: null, state: { hands: {
        "Andrew": [7, 16, 27],
        "Chun": [28, 34, 40],
        "Tymm": [10, 25, 44],
        "Bryan": [5, 21, 36]
      },
        scores: { "Andrew": 99, "Chun": 85, "Tymm": 93, "Bryan": 88 },
        round: 16,
        turn: ["Chun"],
        played: []
      }}); });
  }).then(function () {
    return Promise.all([
      knex('user_games').insert({user_id: 1, game_id: 1, score: 40}),
      knex('user_games').insert({user_id: 2, game_id: 1, score: 51}),
      knex('user_games').insert({user_id: 2, game_id: 2, score: 45}),
      knex('user_games').insert({user_id: 3, game_id: 2, score: 46}),
      knex('user_games').insert({user_id: 4, game_id: 3, score: 61}),
      knex('user_games').insert({user_id: 6, game_id: 3, score: 30}),
      knex('user_games').insert({user_id: 5, game_id: 4, score: 55}),
      knex('user_games').insert({user_id: 2, game_id: 4, score: 36}),
      knex('user_games').insert({user_id: 3, game_id: 5, score: 43}),
      knex('user_games').insert({user_id: 7, game_id: 5, score: 48}),
      knex('user_games').insert({user_id: 1, game_id: 6, score: 42}),
      knex('user_games').insert({user_id: 7, game_id: 6, score: 49}),
      knex('user_games').insert({user_id: 4, game_id: 7, score: 52}),
      knex('user_games').insert({user_id: 5, game_id: 7, score: 39}),
      knex('user_games').insert({user_id: 2, game_id: 8, score: 63}),
      knex('user_games').insert({user_id: 6, game_id: 8, score: 28}),
      knex('user_games').insert({user_id: 3, game_id: 9, score: 44}),
      knex('user_games').insert({user_id: 1, game_id: 9, score: 47}),
      knex('user_games').insert({user_id: 7, game_id: 10, score: 41}),
      knex('user_games').insert({user_id: 4, game_id: 10, score: 50}),
      knex('user_games').insert({user_id: 6, game_id: 11, score: 52}),
      knex('user_games').insert({user_id: 1, game_id: 11, score: 39}),
      knex('user_games').insert({user_id: 1, game_id: 12, score: 106}),
      knex('user_games').insert({user_id: 2, game_id: 12, score: 93}),
      knex('user_games').insert({user_id: 3, game_id: 12, score: 84}),
      knex('user_games').insert({user_id: 4, game_id: 12, score: 90}),
      knex('user_games').insert({user_id: 4, game_id: 13, score: 102}),
      knex('user_games').insert({user_id: 5, game_id: 13, score: 84}),
      knex('user_games').insert({user_id: 6, game_id: 13, score: 75}),
      knex('user_games').insert({user_id: 7, game_id: 13, score: 60}),
      knex('user_games').insert({user_id: 1, game_id: 14, score: 110}),
      knex('user_games').insert({user_id: 3, game_id: 14, score: 89}),
      knex('user_games').insert({user_id: 5, game_id: 14, score: 66}),
      knex('user_games').insert({user_id: 7, game_id: 14, score: 70}),
      knex('user_games').insert({user_id: 2, game_id: 15, score: 70}),
      knex('user_games').insert({user_id: 4, game_id: 15, score: 63}),
      knex('user_games').insert({user_id: 6, game_id: 15, score: 106}),
      knex('user_games').insert({user_id: 1, game_id: 15, score: 95}),
      knex('user_games').insert({user_id: 1, game_id: 16, score: 90}),
      knex('user_games').insert({user_id: 2, game_id: 16, score: 87}),
      knex('user_games').insert({user_id: 5, game_id: 16, score: 106}),
      knex('user_games').insert({user_id: 6, game_id: 16, score: 50}),
      knex('user_games').insert({user_id: 3, game_id: 17, score: 103}),
      knex('user_games').insert({user_id: 4, game_id: 17, score: 87}),
      knex('user_games').insert({user_id: 6, game_id: 17, score: 81}),
      knex('user_games').insert({user_id: 7, game_id: 17, score: 85}),
      knex('user_games').insert({user_id: 1, game_id: 18, score: 58}),
      knex('user_games').insert({user_id: 2, game_id: 18, score: 101}),
      knex('user_games').insert({user_id: 4, game_id: 18, score: 81}),
      knex('user_games').insert({user_id: 5, game_id: 18, score: 85}),
      knex('user_games').insert({user_id: 2, game_id: 19, score: 67}),
      knex('user_games').insert({user_id: 3, game_id: 19, score: 96}),
      knex('user_games').insert({user_id: 4, game_id: 19, score: 89}),
      knex('user_games').insert({user_id: 6, game_id: 19, score: 78}),
      knex('user_games').insert({user_id: 1, game_id: 20, score: 80}),
      knex('user_games').insert({user_id: 3, game_id: 20, score: 74}),
      knex('user_games').insert({user_id: 5, game_id: 20, score: 98}),
      knex('user_games').insert({user_id: 7, game_id: 20, score: 104}),
      knex('user_games').insert({user_id: 1, game_id: 21, score: 107}),
      knex('user_games').insert({user_id: 2, game_id: 21, score: 86}),
      knex('user_games').insert({user_id: 5, game_id: 21, score: 94}),
      knex('user_games').insert({user_id: 6, game_id: 21, score: 78}),
      knex('user_games').insert({user_id: 4, game_id: 22, score: 92}),
      knex('user_games').insert({user_id: 5, game_id: 22, score: 102}),
      knex('user_games').insert({user_id: 6, game_id: 22, score: 91}),
      knex('user_games').insert({user_id: 7, game_id: 22, score: 40}),
      knex('user_games').insert({user_id: 1, game_id: 23, score: 67}),
      knex('user_games').insert({user_id: 2, game_id: 23, score: 96}),
      knex('user_games').insert({user_id: 4, game_id: 23, score: 89}),
      knex('user_games').insert({user_id: 6, game_id: 23, score: 78}),
      knex('user_games').insert({user_id: 1, game_id: 24, score: null}),
      knex('user_games').insert({user_id: 2, game_id: 24, score: null}),
      knex('user_games').insert({user_id: 1, game_id: 25, score: null}),
      knex('user_games').insert({user_id: 2, game_id: 25, score: null}),
      knex('user_games').insert({user_id: 3, game_id: 25, score: null}),
      knex('user_games').insert({user_id: 4, game_id: 25, score: null}),
      knex('user_games').insert({user_id: 1, game_id: 26, score: null}),
      knex('user_games').insert({user_id: 2, game_id: 26, score: null}),
      knex('user_games').insert({user_id: 3, game_id: 26, score: null}),
      knex('user_games').insert({user_id: 4, game_id: 26, score: null}),
    ]);
  });
};
