import PouchDBFind from "pouchdb-find";
import { runMigration } from "./migration";

export const PouchDB = window.PouchDB;
PouchDB.plugin(PouchDBFind);

let database = window.localStorage.getItem("@db_key") ?? "test_db";

let db_url = `http://localhost:12000/${database}`;

PouchDB.sync(database, db_url, {
  live: true,
  retry: true,
});

export const db = new PouchDB(database);

runMigration(db);
