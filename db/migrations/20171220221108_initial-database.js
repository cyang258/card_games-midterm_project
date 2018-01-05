
exports.up = function(knex, Promise) {
  return Promise.all([
    knex('users').del().then(() => {
      return knex.schema.alterTable('users', (table) => {
        table.dropColumn('name');
        table.string('username');
        table.string('email');
        table.string('password');
      });
    }),
    knex.schema.createTable('user_games', (table) => {
      table.integer('user_id');
      table.integer('game_id');
      table.integer('score');
      table.primary(['user_id', 'game_id']);
    }),
    knex.schema.createTable('games', (table) => {
      table.increments('id');
      table.integer('game_name_id');
      table.date('start_date');
      table.date('end_date');
      table.json('state');
    }),
    knex.schema.createTable('game_names', (table) => {
      table.increments('id');
      table.string('name');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user_games'),
    knex.schema.dropTable('games'),
    knex.schema.dropTable('game_names')
  ]);
};
