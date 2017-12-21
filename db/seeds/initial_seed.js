
exports.seed = function(knex, Promise) {
  let seedState = {
    hands: {
      deck: [40, 41, 42, 43, 45, 46, 47, 49, 50, 52],
      "3": [1, 2, 4, 5, 6, 7, 8, 9, 10, 13],
      "4": [14, 15, 16, 17, 19, 20, 22, 23, 24, 25]
    },
    scores: {
      "3": 9,
      "4": 17
    },
    turn: ['deck']
  };
  // Deletes ALL existing entries
  return knex('users').del()
  .then(function () {
    return Promise.all([
      knex('users').insert({username: 'deck', email: 'deck', password: 'deck'}),
      knex('users').insert({username: 'discard', email: 'discard', password: 'discard'}),
      knex('users').insert({username: 'Chun', email: 'cy@gmail.com', password: 'pass'}),
      knex('users').insert({username: 'Andrew', email: 'ac@gmail.com', password: 'pass'})
    ]);
  }).then(function () {
    return knex('game_names').del()
    .then(function () {
      return Promise.all([
        knex('game_names').insert({name: 'goofspiel'})
      ]);
    });
  }).then(function () {
    return knex('games').del()
    .then(function () {
      return Promise.all([
        knex('games').insert({game_name_id: 1, start_date: '2017-12-19', end_date: '2017-12-20', state: seedState}),
      ]);
    });
  }).then(function () {
    return knex('user_games').del()
    .then(function () {
      return Promise.all([
        knex('user_games').insert({user_id: 3, game_id: 1}),
        knex('user_games').insert({user_id: 4, game_id: 1}),
      ]);
    });
  }).then(function () {
    return knex('moves').del()
    .then(function () {
      return Promise.all([
        knex('moves').insert({game_id: 1, user_id: 1, card: 'S9', move: 'play'}),
        knex('moves').insert({game_id: 1, user_id: 3, card: 'C11', move: 'play'}),
        knex('moves').insert({game_id: 1, user_id: 4, card: 'D8', move: 'play'}),
        knex('moves').insert({game_id: 1, user_id: 1, card: 'S12', move: 'play'}),
        knex('moves').insert({game_id: 1, user_id: 3, card: 'C12', move: 'play'}),
        knex('moves').insert({game_id: 1, user_id: 4, card: 'D13', move: 'play'}),
        knex('moves').insert({game_id: 1, user_id: 1, card: 'S5', move: 'play'}),
        knex('moves').insert({game_id: 1, user_id: 3, card: 'C3', move: 'play'}),
        knex('moves').insert({game_id: 1, user_id: 4, card: 'D5', move: 'play'}),
      ]);
    });
  });
};
