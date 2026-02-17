import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { executives, companies } from "@/lib/db/schema"
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

      <LeaderboardTable entries={allExecutives} />
    </div>
  )
}
