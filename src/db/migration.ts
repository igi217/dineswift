import { DBCollections } from "./index.type";

const records = [
  {
    _id: "card",
    name: "Card",
    table: DBCollections.PAYMENT_METHODS,
    modified: Date.now(),
    default: true,
    status: true,
  },
  {
    _id: "payment_cash",
    name: "Cash",
    modified: Date.now(),
    table: DBCollections.PAYMENT_METHODS,
    default: true,
    status: true,
  },
  {
    _id: "payment_split",
    name: "Split",
    modified: Date.now(),
    table: DBCollections.PAYMENT_METHODS,
    default: true,
    status: true,
  },
  {
    _id: "payment/_clover",
    api_key: "",
    modified: Date.now(),
    table: DBCollections.PAYMENT_CONFIG,
  },
  {
    _id: "payment/_worldpay",
    api_key: "",
    modified: Date.now(),
    table: DBCollections.PAYMENT_CONFIG,
  },
  {
    _id: "payment/_dojo",
    api_key: "",
    modified: Date.now(),
    table: DBCollections.PAYMENT_CONFIG,
  },
  {
    _id: "payment/_stripe",
    public_key: "",
    secret_key: "",
    modified: Date.now(),
    table: DBCollections.PAYMENT_CONFIG,
  },
];

export async function runMigration(db: PouchDB.Database) {
  for (let record of records) {
    try {
      await db.put(record);
    } catch {
      console.warn("Migration Warning: Migration already ran");
    }
  }
}
