// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ticks', (table) => {
    table.increments('id');
    table.uuid('sessionId').references('id').inTable('sessions').onDelete('CASCADE');
    table.bigInteger('timestamp').notNullable();
    table.bigInteger('raw');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ticks')
}
