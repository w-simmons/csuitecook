import { desc, eq, gte, asc } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { executives, companies, githubSnapshots } from "@/lib/db/schema"
import { Podium } from "@/components/podium"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { LiveBadge } from "@/components/live-badge"

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

  const top5 = allExecutives.slice(0, 5)
  const rest = allExecutives.slice(5)

  return (
    <>
      {/* Hero */}
      <div className="px-4 pt-10 pb-4 text-center sm:px-6 sm:pt-14 sm:pb-5 md:px-10">
        <h1 className="bg-gradient-to-br from-foreground to-orange-500 bg-clip-text text-[clamp(1.8rem,5vw,3.8rem)] font-black leading-[1.1] tracking-tight text-transparent">
          Who&apos;s Actually Building?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-[1.05rem]">
          Tracking which tech leaders ship code &middot; Updated daily from
          public GitHub
        </p>
        <LiveBadge />
      </div>

      {/* Top 5 Podium */}
      {top5.length > 0 && (
        <section className="mx-auto max-w-[1100px] px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-5 md:px-10">
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground sm:mb-6">
            Top {Math.min(5, top5.length)} &middot; This Week
          </p>
          <Podium entries={top5} scoreHistory={scoreHistory} />
        </section>
      )}

      {/* Full Rankings Table */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-[1100px] px-4 pt-4 pb-16 sm:px-6 sm:pt-5 sm:pb-20 md:px-10">
          <LeaderboardTable
            entries={rest}
            scoreHistory={scoreHistory}
            startRank={6}
          />
        </section>
      )}

      {/* Show table for all if less than 5 */}
      {allExecutives.length > 0 && allExecutives.length <= 5 && (
        <section className="mx-auto max-w-[1100px] px-4 pt-4 pb-16 sm:px-6 sm:pt-5 sm:pb-20 md:px-10">
          <LeaderboardTable
            entries={allExecutives}
            scoreHistory={scoreHistory}
          />
        </section>
      )}
    </>
  )
}
