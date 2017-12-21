exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('user_games', (table) => {
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.foreign('game_id').references('games.id').onDelete('CASCADE');
    }),
    knex.schema.alterTable('games', (table) => {
      table.foreign('game_name_id').references('game_names.id').onDelete('CASCADE');
    }),
    knex.schema.alterTable('moves', (table) => {
      table.foreign('game_id').references('games.id').onDelete('CASCADE');
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('user_games', (table) => {
      table.dropForeign('user_id');
      table.dropForeign('game_id');
    }),
    knex.schema.alterTable('games', (table) => {
      table.dropForeign('game_name_id');
    }),
    knex.schema.alterTable('moves', (table) => {
      table.dropForeign('game_id');
      table.dropForeign('user_id');
    })
  ]);
};
