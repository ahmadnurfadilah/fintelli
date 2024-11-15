import { doublePrecision, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }),
  username: varchar({ length: 256 }).unique(),
  email: varchar({ length: 256 }).unique(),
  created_at: timestamp().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial().primaryKey(),
  user_id: integer().references(() => users.id),
  type: varchar({ length: 256, enum: ["expense", "income"] }),
  name: varchar({ length: 256 }),
  created_at: timestamp().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: serial().primaryKey(),
  user_id: integer().references(() => users.id),
  name: varchar({ length: 256 }),
  balance: doublePrecision(),
  created_at: timestamp().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial().primaryKey(),
  user_id: integer().references(() => users.id),
  account_id: integer().references(() => accounts.id),
  category_id: integer().references(() => categories.id),
  balance: doublePrecision(),
  transaction_date: timestamp(),
  description: varchar({ length: 256 }),
  created_at: timestamp().defaultNow(),
});
