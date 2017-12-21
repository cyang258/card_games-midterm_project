
exports.seed = function(knex, Promise) {
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
    return knex('cards').del()
    .then(function () {
      return Promise.all([
        knex('cards').insert({suit: 1, face_value: 1}),
        knex('cards').insert({suit: 1, face_value: 2}),
        knex('cards').insert({suit: 1, face_value: 3}),
        knex('cards').insert({suit: 1, face_value: 4}),
        knex('cards').insert({suit: 1, face_value: 5}),
        knex('cards').insert({suit: 1, face_value: 6}),
        knex('cards').insert({suit: 1, face_value: 7}),
        knex('cards').insert({suit: 1, face_value: 8}),
        knex('cards').insert({suit: 1, face_value: 9}),
        knex('cards').insert({suit: 1, face_value: 10}),
        knex('cards').insert({suit: 1, face_value: 11}),
        knex('cards').insert({suit: 1, face_value: 12}),
        knex('cards').insert({suit: 1, face_value: 13}),
        knex('cards').insert({suit: 2, face_value: 1}),
        knex('cards').insert({suit: 2, face_value: 2}),
        knex('cards').insert({suit: 2, face_value: 3}),
        knex('cards').insert({suit: 2, face_value: 4}),
        knex('cards').insert({suit: 2, face_value: 5}),
        knex('cards').insert({suit: 2, face_value: 6}),
        knex('cards').insert({suit: 2, face_value: 7}),
        knex('cards').insert({suit: 2, face_value: 8}),
        knex('cards').insert({suit: 2, face_value: 9}),
        knex('cards').insert({suit: 2, face_value: 10}),
        knex('cards').insert({suit: 2, face_value: 11}),
        knex('cards').insert({suit: 2, face_value: 12}),
        knex('cards').insert({suit: 2, face_value: 13}),
        knex('cards').insert({suit: 3, face_value: 1}),
        knex('cards').insert({suit: 3, face_value: 2}),
        knex('cards').insert({suit: 3, face_value: 3}),
        knex('cards').insert({suit: 3, face_value: 4}),
        knex('cards').insert({suit: 3, face_value: 5}),
        knex('cards').insert({suit: 3, face_value: 6}),
        knex('cards').insert({suit: 3, face_value: 7}),
        knex('cards').insert({suit: 3, face_value: 8}),
        knex('cards').insert({suit: 3, face_value: 9}),
        knex('cards').insert({suit: 3, face_value: 10}),
        knex('cards').insert({suit: 3, face_value: 11}),
        knex('cards').insert({suit: 3, face_value: 12}),
        knex('cards').insert({suit: 3, face_value: 13}),
        knex('cards').insert({suit: 4, face_value: 1}),
        knex('cards').insert({suit: 4, face_value: 2}),
        knex('cards').insert({suit: 4, face_value: 3}),
        knex('cards').insert({suit: 4, face_value: 4}),
        knex('cards').insert({suit: 4, face_value: 5}),
        knex('cards').insert({suit: 4, face_value: 6}),
        knex('cards').insert({suit: 4, face_value: 7}),
        knex('cards').insert({suit: 4, face_value: 8}),
        knex('cards').insert({suit: 4, face_value: 9}),
        knex('cards').insert({suit: 4, face_value: 10}),
        knex('cards').insert({suit: 4, face_value: 11}),
        knex('cards').insert({suit: 4, face_value: 12}),
        knex('cards').insert({suit: 4, face_value: 13})
      ]);
    });
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
        knex('games').insert({game_name_id: 1, start_date: '2017-12-19', end_date: '2017-12-20'}),
        knex('games').insert({game_name_id: 1, start_date: '2017-12-19', end_date: '2017-12-20'})
      ]);
    });
  }).then(function () {
    return knex('game_cards').del()
    .then(function () {
      return Promise.all([
        knex('game_cards').insert({game_name_id: 1, card_id: 1}),
        knex('game_cards').insert({game_name_id: 1, card_id: 2}),
        knex('game_cards').insert({game_name_id: 1, card_id: 3}),
        knex('game_cards').insert({game_name_id: 1, card_id: 4}),
        knex('game_cards').insert({game_name_id: 1, card_id: 5}),
        knex('game_cards').insert({game_name_id: 1, card_id: 6}),
        knex('game_cards').insert({game_name_id: 1, card_id: 7}),
        knex('game_cards').insert({game_name_id: 1, card_id: 8}),
        knex('game_cards').insert({game_name_id: 1, card_id: 9}),
        knex('game_cards').insert({game_name_id: 1, card_id: 10}),
        knex('game_cards').insert({game_name_id: 1, card_id: 11}),
        knex('game_cards').insert({game_name_id: 1, card_id: 12}),
        knex('game_cards').insert({game_name_id: 1, card_id: 13}),
        knex('game_cards').insert({game_name_id: 1, card_id: 14}),
        knex('game_cards').insert({game_name_id: 1, card_id: 15}),
        knex('game_cards').insert({game_name_id: 1, card_id: 16}),
        knex('game_cards').insert({game_name_id: 1, card_id: 17}),
        knex('game_cards').insert({game_name_id: 1, card_id: 18}),
        knex('game_cards').insert({game_name_id: 1, card_id: 19}),
        knex('game_cards').insert({game_name_id: 1, card_id: 20}),
        knex('game_cards').insert({game_name_id: 1, card_id: 21}),
        knex('game_cards').insert({game_name_id: 1, card_id: 22}),
        knex('game_cards').insert({game_name_id: 1, card_id: 23}),
        knex('game_cards').insert({game_name_id: 1, card_id: 24}),
        knex('game_cards').insert({game_name_id: 1, card_id: 25}),
        knex('game_cards').insert({game_name_id: 1, card_id: 26}),
        knex('game_cards').insert({game_name_id: 1, card_id: 27}),
        knex('game_cards').insert({game_name_id: 1, card_id: 28}),
        knex('game_cards').insert({game_name_id: 1, card_id: 29}),
        knex('game_cards').insert({game_name_id: 1, card_id: 30}),
        knex('game_cards').insert({game_name_id: 1, card_id: 31}),
        knex('game_cards').insert({game_name_id: 1, card_id: 32}),
        knex('game_cards').insert({game_name_id: 1, card_id: 33}),
        knex('game_cards').insert({game_name_id: 1, card_id: 34}),
        knex('game_cards').insert({game_name_id: 1, card_id: 35}),
        knex('game_cards').insert({game_name_id: 1, card_id: 36}),
        knex('game_cards').insert({game_name_id: 1, card_id: 37}),
        knex('game_cards').insert({game_name_id: 1, card_id: 38}),
        knex('game_cards').insert({game_name_id: 1, card_id: 39}),
        knex('game_cards').insert({game_name_id: 1, card_id: 40}),
        knex('game_cards').insert({game_name_id: 1, card_id: 41}),
        knex('game_cards').insert({game_name_id: 1, card_id: 42}),
        knex('game_cards').insert({game_name_id: 1, card_id: 43}),
        knex('game_cards').insert({game_name_id: 1, card_id: 44}),
        knex('game_cards').insert({game_name_id: 1, card_id: 45}),
        knex('game_cards').insert({game_name_id: 1, card_id: 46}),
        knex('game_cards').insert({game_name_id: 1, card_id: 47}),
        knex('game_cards').insert({game_name_id: 1, card_id: 48}),
        knex('game_cards').insert({game_name_id: 1, card_id: 49}),
        knex('game_cards').insert({game_name_id: 1, card_id: 50}),
        knex('game_cards').insert({game_name_id: 1, card_id: 51}),
        knex('game_cards').insert({game_name_id: 1, card_id: 52})
      ]);
    });
  }).then(function () {
    return knex('user_games').del()
    .then(function () {
      return Promise.all([
        knex('user_games').insert({user_id: 3, game_id: 1}),
        knex('user_games').insert({user_id: 4, game_id: 1}),
        knex('user_games').insert({user_id: 3, game_id: 2}),
        knex('user_games').insert({user_id: 4, game_id: 2})
      ]);
    });
  });
    // knex('logs').del()
    // .then(function () {
    //   return Promise.all([
    //     knex('logs').insert({game_id: 1, card_id: 3, user_id: 2, visibility: 'player'}),
    //   ]);
    // }),
};

// Original seed
// exports.seed = function(knex, Promise) {
//   return knex('users').del()
//     .then(function () {
//       return Promise.all([
//         knex('users').insert({id: 1, name: 'Alice'}),
//         knex('users').insert({id: 2, name: 'Bob'}),
//         knex('users').insert({id: 3, name: 'Charlie'})
//       ]);
//     });
// };

