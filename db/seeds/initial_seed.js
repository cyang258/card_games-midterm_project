
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('users').del(),
    knex('game_names').del(),
    knex('games').del(),
    knex('user_games').del(),
    knex('moves').del()
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
    return knex('games').insert({game_name_id: 1, start_date: "2017-12-20", end_date: "2017-12-21", state: { hands: { 1: [], 2: [], deck:[] }, scores: { 1: 40, 2: 51 }, turn: 14, played: []}})
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-21", end_date: "2017-12-22", state: { hands: { 2: [], 3: [], deck:[] }, scores: { 2: 45, 3: 46 }, round: 14, winner:["3"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-19", end_date: "2017-12-20", state: { hands: { 4: [], 6: [], deck:[] }, scores: { 4: 61, 6: 30 }, round: 14, winner:["4"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-15", end_date: "2017-12-16", state: { hands: { 5: [], 2: [], deck:[] }, scores: { 5: 55, 2: 36 }, round: 14, winner:["5"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-17", end_date: "2017-12-18", state: { hands: { 3: [], 7: [], deck:[] }, scores: { 3: 43, 7: 48 }, round: 14, winner:["7"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-16", end_date: "2017-12-17", state: { hands: { 1: [], 7: [], deck:[] }, scores: { 1: 42, 7: 49 }, round: 14, winner:["7"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-12", end_date: "2017-12-13", state: { hands: { 4: [], 5: [], deck:[] }, scores: { 4: 52, 5: 39 }, round: 14, winner:["4"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-11", end_date: "2017-12-12", state: { hands: { 2: [], 6: [], deck:[] }, scores: { 2: 63, 6: 28 }, round: 14, winner:["2"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-20", end_date: "2017-12-21", state: { hands: { 3: [], 1: [], deck:[] }, scores: { 3: 44, 1: 47 }, round: 14, winner:["1"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-18", end_date: "2017-12-19", state: { hands: { 7: [], 4: [], deck:[] }, scores: { 7: 41, 4: 50 }, round: 14, winner:["4"], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 1, start_date: "2017-12-05", end_date: null, state: { hands: { 1: [4, 9], 2: [18, 23], deck:[45, 48] }, scores: { 1: 43, 2: 33 }, round: 12, turn: [1, 2], played: []}}); })
      .then(() => { return knex('games').insert({game_name_id: 2, start_date: "2017-12-05", end_date: null, state: { hands: {
        1: [52, 48, 45, 37, 30, 25, 23, 22, 16, 15, 14, 7, 1],
        2: [50, 47, 41, 40, 39, 38, 35, 34, 29, 28, 18, 8, 4],
        3: [49, 46, 44, 33, 31, 27, 19, 17, 12, 11, 10, 9, 2],
        4: [51, 43, 42, 36, 32, 26, 24, 21, 20, 13, 6, 5, 3]
      },
        scores: { 1: 0, 2: 0, 3: 0, 4: 0 },
        roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
        round: 1,
        turn: [3],
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
      knex('user_games').insert({user_id: 1, game_id: 11, score: null}),
      knex('user_games').insert({user_id: 2, game_id: 11, score: null}),
      knex('user_games').insert({user_id: 1, game_id: 12, score: null}),
      knex('user_games').insert({user_id: 2, game_id: 12, score: null}),
      knex('user_games').insert({user_id: 3, game_id: 12, score: null}),
      knex('user_games').insert({user_id: 4, game_id: 12, score: null}),
    ]);
  });
};
