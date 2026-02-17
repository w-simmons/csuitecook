import {
  pgTable,
  text,
  timestamp,
  integer,
  date,
  jsonb,
  real,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const companies = pgTable("companies", {
  id: text("id").primaryKey(), // slug
  name: text("name").notNull(),
  ticker: text("ticker"),
  logoUrl: text("logo_url"),
  industry: text("industry"),
  category: text("category").notNull(), // "public" | "startup"
})

export const executives = pgTable("executives", {
  id: text("id").primaryKey(), // slug
  name: text("name").notNull(),
  title: text("title").notNull(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  githubUsername: text("github_username"),
  avatarUrl: text("avatar_url"),
  category: text("category").notNull(), // "c-suite" | "founder"
  currentScore: real("current_score").notNull().default(0),
  lastSyncedAt: timestamp("last_synced_at"),
})

export type Executive = typeof executives.$inferSelect
export type Company = typeof companies.$inferSelect

export const githubSnapshots = pgTable(
  "github_snapshots",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    executiveId: text("executive_id")
      .notNull()
      .references(() => executives.id),
    snapshotDate: date("snapshot_date").notNull(),
    pushEventCount: integer("push_event_count").notNull().default(0),
    commitCount: integer("commit_count").notNull().default(0),
    prCount: integer("pr_count").notNull().default(0),
    issueCount: integer("issue_count").notNull().default(0),
    totalStars: integer("total_stars").notNull().default(0),
    recentRepoCount: integer("recent_repo_count").notNull().default(0),
    languages: jsonb("languages").$type<Record<string, number>>().default({}),
    aiRelatedActivity: integer("ai_related_activity").notNull().default(0),
    daysSinceLastEvent: integer("days_since_last_event"),
    cookingScore: real("cooking_score").notNull().default(0),
    rawEventSummary: jsonb("raw_event_summary")
      .$type<{
        weeklyBreakdown: { week: string; events: number }[]
        topRepos: { name: string; stars: number; language: string | null }[]
        recentEvents: { type: string; repo: string; date: string }[]
      }>()
      .default({ weeklyBreakdown: [], topRepos: [], recentEvents: [] }),
  },
  (table) => [
    uniqueIndex("snapshot_unique_idx").on(
      table.executiveId,
      table.snapshotDate
    ),
  ]
)

export type GithubSnapshot = typeof githubSnapshots.$inferSelect
