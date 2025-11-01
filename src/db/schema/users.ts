import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const membership = pgEnum("membership", ['free', 'pro']);

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  membership: membership().default('free').notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

