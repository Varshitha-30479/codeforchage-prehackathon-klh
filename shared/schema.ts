import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  companyName: text("company_name"),
  industry: text("industry"),
  teamSize: integer("team_size"),
  creditsUsed: integer("credits_used").default(0),
  creditsRemaining: integer("credits_remaining").default(100),
  createdAt: timestamp("created_at").defaultNow(),
});

// Financial Scenarios Table
export const financialScenarios = pgTable("financial_scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  monthlyRevenue: decimal("monthly_revenue", { precision: 12, scale: 2 }),
  monthlyExpenses: decimal("monthly_expenses", { precision: 12, scale: 2 }),
  teamSize: integer("team_size"),
  burnRate: decimal("burn_rate", { precision: 12, scale: 2 }),
  runway: decimal("runway", { precision: 12, scale: 2 }),
  cashBalance: decimal("cash_balance", { precision: 12, scale: 2 }),
  scenarioData: jsonb("scenario_data"), // Store chart data and projections
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Recommendations Table
export const aiRecommendations = pgTable("ai_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  scenarioId: varchar("scenario_id").references(() => financialScenarios.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: text("impact").notNull(), // "high", "medium", "low"
  category: text("category").notNull(), // "revenue", "cost", "hiring", "funding"
  applied: boolean("applied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Usage Tracking Table
export const usageTracking = pgTable("usage_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // "ai_recommendation", "scenario_save", "twin_comparison"
  creditsUsed: integer("credits_used").notNull(),
  metadata: jsonb("metadata"), // Store additional context
  createdAt: timestamp("created_at").defaultNow(),
});

// Financial Twin Templates Table
export const financialTwins = pgTable("financial_twins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  stage: text("stage").notNull(), // "seed", "series_a", "series_b", etc.
  teamSize: integer("team_size"),
  monthlyRevenue: decimal("monthly_revenue", { precision: 12, scale: 2 }),
  monthlyExpenses: decimal("monthly_expenses", { precision: 12, scale: 2 }),
  burnRate: decimal("burn_rate", { precision: 12, scale: 2 }),
  runway: decimal("runway", { precision: 12, scale: 2 }),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  creditsUsed: true,
  creditsRemaining: true,
  createdAt: true,
});

export const insertScenarioSchema = createInsertSchema(financialScenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
  applied: true,
  createdAt: true,
});

export const insertUsageSchema = createInsertSchema(usageTracking).omit({
  id: true,
  createdAt: true,
});

export const insertTwinSchema = createInsertSchema(financialTwins).omit({
  id: true,
  isActive: true,
  createdAt: true,
});

// Type Exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type FinancialScenario = typeof financialScenarios.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type AIRecommendation = typeof aiRecommendations.$inferSelect;
export type InsertUsage = z.infer<typeof insertUsageSchema>;
export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertTwin = z.infer<typeof insertTwinSchema>;
export type FinancialTwin = typeof financialTwins.$inferSelect;
