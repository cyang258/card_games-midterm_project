exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('user_games', (table) => {
      table.foreign('user_id').references('users.id');
      table.foreign('game_id').references('games.id');
    }),
    knex.schema.alterTable('games', (table) => {
      table.foreign('game_name_id').references('game_names.id');
    }),
    knex.schema.alterTable('game_cards', (table) => {
      table.foreign('game_name_id').references('game_names.id');
      table.foreign('card_id').references('cards.id');
    }),
    knex.schema.alterTable('logs', (table) => {
      table.foreign('game_id').references('games.id');
      table.foreign('card_id').references('cards.id');
      table.foreign('user_id').references('users.id');
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
    knex.schema.alterTable('game_cards', (table) => {
      table.dropForeign('game_name_id');
      table.dropForeign('card_id');
    }),
    knex.schema.alterTable('logs', (table) => {
      table.dropForeign('game_id');
      table.dropForeign('card_id');
      table.dropForeign('user_id');
    })
  ]);
};
