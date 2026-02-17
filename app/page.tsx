import { desc, eq, gte, asc } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { executives, companies, githubSnapshots } from "@/lib/db/schema"
import { LeaderboardTable } from "@/components/leaderboard-table"

export const revalidate = 3600 // ISR: revalidate every hour

export default async function HomePage() {
  const allExecutives = await db
    .select({
      executive: executives,
      company: companies,
    })
    .from(executives)
    .innerJoin(companies, eq(executives.companyId, companies.id))
    .orderBy(desc(executives.currentScore))

  // Fetch last 9 days of scores for sparklines
  const snapshots = await db
    .select({
      executiveId: githubSnapshots.executiveId,
      snapshotDate: githubSnapshots.snapshotDate,
      cookingScore: githubSnapshots.cookingScore,
    })
    .from(githubSnapshots)
    .where(gte(githubSnapshots.snapshotDate, sql`current_date - 9`))
    .orderBy(asc(githubSnapshots.snapshotDate))

  // Group scores by executiveId
  const scoreHistory: Record<string, number[]> = {}
  for (const snap of snapshots) {
    if (!scoreHistory[snap.executiveId]) {
      scoreHistory[snap.executiveId] = []
    }
    scoreHistory[snap.executiveId].push(snap.cookingScore)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Who&apos;s Actually Building?
        </h1>
        <p className="text-lg text-muted-foreground">
          Tracking how much tech leaders are coding. Updated daily from GitHub
          public activity.
        </p>
      </div>

      <LeaderboardTable entries={allExecutives} scoreHistory={scoreHistory} />
    </div>
  )
}
