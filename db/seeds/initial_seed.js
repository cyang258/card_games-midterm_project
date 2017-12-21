
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, colName: 'rowValue1'}),
        knex('users').insert({id: 2, colName: 'rowValue2'}),
        knex('users').insert({id: 3, colName: 'rowValue3'})
      ]);
    }),
    knex('user_games').del()
    .then(function () {
      return Promise.all([
        knex('user_games').insert({id: 1, colName: 'rowValue1'}),
        knex('user_games').insert({id: 2, colName: 'rowValue2'}),
        knex('user_games').insert({id: 3, colName: 'rowValue3'})
      ]);
    }),
    knex('games').del()
    .then(function () {
      return Promise.all([
        knex('games').insert({id: 1, colName: 'rowValue1'}),
        knex('games').insert({id: 2, colName: 'rowValue2'}),
        knex('games').insert({id: 3, colName: 'rowValue3'})
      ]);
    }),
    knex('games_names').del()
    .then(function () {
      return Promise.all([
        knex('games_names').insert({id: 1, colName: 'rowValue1'}),
        knex('games_names').insert({id: 2, colName: 'rowValue2'}),
        knex('games_names').insert({id: 3, colName: 'rowValue3'})
      ]);
    }),
    knex('game_cards').del()
    .then(function () {
      return Promise.all([
        knex('game_cards').insert({id: 1, colName: 'rowValue1'}),
        knex('game_cards').insert({id: 2, colName: 'rowValue2'}),
        knex('game_cards').insert({id: 3, colName: 'rowValue3'})
      ]);
    }),
    knex('cards').del()
    .then(function () {
      return Promise.all([
        knex('cards').insert({id: 1, colName: 'rowValue1'}),
        knex('cards').insert({id: 2, colName: 'rowValue2'}),
        knex('cards').insert({id: 3, colName: 'rowValue3'})
      ]);
    }),
    knex('logs').del()
    .then(function () {
      return Promise.all([
        knex('logs').insert({id: 1, colName: 'rowValue1'}),
        knex('logs').insert({id: 2, colName: 'rowValue2'}),
        knex('logs').insert({id: 3, colName: 'rowValue3'})
      ]);
    }),
  ]);
};
