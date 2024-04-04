import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('sessions', function(table) {
    table.timestamp('startTime', { useTz: true }).alter();
    table.timestamp('endTime', { useTz: true }).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('sessions', function(table) {
    table.bigInteger('startTime').alter();
    table.bigInteger('endTime').alter();
  });
}

