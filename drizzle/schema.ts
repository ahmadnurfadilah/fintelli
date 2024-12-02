import { date, doublePrecision, jsonb, pgTable, text, timestamp, uuid, varchar, vector } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().notNull().primaryKey(),
  name: varchar({ length: 256 }),
  username: varchar({ length: 256 }).unique(),
  email: varchar({ length: 256 }).unique(),
  created_at: timestamp().defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  user_id: uuid().notNull().references(() => users.id),
  type: varchar({ length: 256, enum: ["expense", "income"] }),
  name: varchar({ length: 256 }),
  created_at: timestamp().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  user_id: uuid().notNull().references(() => users.id),
  name: varchar({ length: 256 }),
  balance: doublePrecision(),
  created_at: timestamp().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  user_id: uuid().notNull().references(() => users.id),
  account_id: uuid().notNull().references(() => accounts.id),
  category_id: uuid().notNull().references(() => categories.id),
  type: varchar({ length: 256, enum: ["expense", "income"] }),
  amount: doublePrecision(),
  transaction_date: date(),
  description: varchar({ length: 256 }),
  created_at: timestamp().defaultNow(),
  embedding: vector({ dimensions: 768 }),
  content: text(),
  metadata: jsonb(),
});
