
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('users').del(),
    knex('game_names').del(),
    knex('games').del(),
    knex('user_games').del(),
    knex('moves').del()
  ]).then(function () {
    return Promise.all([
      // knex('users').insert({username: 'deck', email: 'deck', password: 'deck'}),
      // knex('users').insert({username: 'discard', email: 'discard', password: 'discard'}),
      knex('users').insert({username: 'Chun', email: 'cy@gmail.com', password: 'pass'}),
      knex('users').insert({username: 'Andrew', email: 'ac@gmail.com', password: 'pass'})
    ]);
  }).then(function () {
    return Promise.all([
      knex('game_names').insert({name: 'goofspiel'})
    ]);
  }).then(function () {
    return Promise.all([
    ]);
  });
};
