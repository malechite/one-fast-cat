import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .table("sessions", function (table) {
      // We'll actually perform the update in a raw query below.
    })
    .then(() => {
      // Update the 'duration' column, converting milliseconds to seconds
      return knex.raw('UPDATE sessions SET "duration" = "duration" / 1000');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .table("sessions", function (table) {
      // Reverse the migration: convert seconds back to milliseconds
    })
    .then(() => {
      // Revert the 'duration' column values from seconds back to milliseconds
      return knex.raw('UPDATE sessions SET "duration" = "duration" * 1000');
    });
}
