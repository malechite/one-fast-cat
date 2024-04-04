import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Step 1: Add temporary columns with the correct type
  await knex.schema.alterTable('sessions', function(table) {
    table.specificType('startTime_temp', 'TIMESTAMPTZ');
    table.specificType('endTime_temp', 'TIMESTAMPTZ');
  });

  // Step 2: Populate the temporary columns
  await knex.raw(`
    UPDATE sessions
    SET "startTime_temp" = TO_TIMESTAMP("startTime" / 1000.0),
        "endTime_temp" = TO_TIMESTAMP("endTime" / 1000.0)
    WHERE "startTime" IS NOT NULL AND "endTime" IS NOT NULL;
  `);

  // Step 3: Drop original columns
  await knex.schema.alterTable('sessions', function(table) {
    table.dropColumn('startTime');
    table.dropColumn('endTime');
  });

  // Step 4: Rename temporary columns to original names
  await knex.schema.alterTable('sessions', function(table) {
    table.renameColumn('startTime_temp', 'startTime');
    table.renameColumn('endTime_temp', 'endTime');
  });
}

export async function down(knex: Knex): Promise<void> {
//
}

