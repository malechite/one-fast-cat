// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary()
    table.float('distance').notNullable()
    table.bigInteger('startTime').notNullable()
    table.bigInteger('endTime')
    table.float('duration').notNullable()
    table.float('averageSpeed').notNullable()
    table.float('topSpeed').notNullable()
    table.integer('totalNumberOfTicks').notNullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sessions')
}
