export * from "./models/auth";
export * from "./models/chat";

import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  jobUrl: text("job_url"),
  offerText: text("offer_text"),
  riskScore: integer("risk_score").notNull(),
  result: text("result").notNull(), // REAL, FAKE, SUSPICIOUS
  details: jsonb("details").$type<{ reasoning: string, flags: string[] }>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blacklist = pgTable("blacklist", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull().unique(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  word: text("word").notNull().unique(),
  category: text("category").notNull(), // payment, urgency, generic
  weight: integer("weight").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const scansRelations = relations(scans, ({ one }) => ({
  user: one(users, {
    fields: [scans.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  scans: many(scans),
}));

// Schemas
export const insertScanSchema = createInsertSchema(scans).omit({ id: true, createdAt: true, userId: true, riskScore: true, result: true, details: true });
export const insertBlacklistSchema = createInsertSchema(blacklist).omit({ id: true, createdAt: true });
export const insertKeywordSchema = createInsertSchema(keywords).omit({ id: true, createdAt: true });

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;
export type Blacklist = typeof blacklist.$inferSelect;
export type InsertBlacklist = z.infer<typeof insertBlacklistSchema>;
export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;

// API Types
export type ScanRequest = {
  jobUrl?: string;
  offerText?: string;
};
