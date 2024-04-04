// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from "knex";
import type { Knex } from "knex";
import type { Application } from "./declarations";

declare module "./declarations" {
  interface Configuration {
    postgresqlClient: Knex;
  }
}

export const postgresql = (app: Application) => {
  const config = app.get("postgresql");
  console.log("postgresql config", config);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const db = knex(config!);

  app.set("postgresqlClient", db);
};
