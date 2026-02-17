# csuitecook

Tracks public GitHub activity of tech leaders and C-suite executives. The "Cook Index" for tech leadership.

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript, Tailwind v4)
- **Database**: Neon Postgres + Drizzle ORM
- **UI**: shadcn/ui (new-york style, neutral base)
- **Charts**: recharts
- **Deployment**: Vercel with Vercel Cron (daily sync at 6 AM UTC)

## Key Patterns

- `lib/db/schema.ts` - Single schema file with all tables
- `lib/github/` - GitHub API client, fetcher, and scoring algorithm
- `lib/constants.ts` - Score tiers and scoring weight config
- Denormalized `currentScore` on executives table for fast leaderboard sorting
- ISR with 1hr revalidation on all pages
- JSONB columns for flexible display data (languages, event summaries)

## Data Pipeline

- GitHub REST API (public events, repos, profile)
- ~150 API calls/day for ~30 people (well within 5000/hr limit)
- Sequential processing with 500ms delay between executives
- Cron route at `/api/cron/sync-github` authenticated with CRON_SECRET

## Scoring (0-100)

| Component | Points |
|-----------|--------|
| Commit Velocity | 35 |
| Activity Breadth | 20 |
| Recency | 20 |
| Repo Engagement | 10 |
| AI Signal | 10 |
| Language Diversity | 5 |

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm tsx scripts/seed.ts  # Seed database
pnpm drizzle-kit push     # Push schema to Neon
pnpm drizzle-kit generate # Generate migrations
```

## Environment Variables

- `DATABASE_URL` - Neon Postgres connection string
- `GITHUB_TOKEN` - GitHub PAT (public_repo scope)
- `CRON_SECRET` - Vercel Cron auth secret
