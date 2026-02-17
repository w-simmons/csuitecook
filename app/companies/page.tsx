import { desc, eq, gte, asc } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { executives, companies, githubSnapshots } from "@/lib/db/schema"
import type { Company } from "@/lib/db/schema"
import {
  CompanyLeaderboard,
  type CompanyLeaderboardEntry,
} from "@/components/company-leaderboard"

export const revalidate = 3600

export default async function CompaniesPage() {
  // Fetch all companies with their executives
  const rows = await db
    .select({
      company: companies,
      executive: executives,
    })
    .from(companies)
    .innerJoin(executives, eq(executives.companyId, companies.id))

  // Aggregate by company
  const companyMap = new Map<
    string,
    {
      company: Company
      totalScore: number
      executiveCount: number
      activeCoders: number
    }
  >()

  for (const row of rows) {
    const existing = companyMap.get(row.company.id)
    if (existing) {
      existing.totalScore += row.executive.currentScore
      existing.executiveCount += 1
      if (row.executive.codingStatus === "active" || row.executive.codingStatus === "sometimes") {
        existing.activeCoders += 1
      }
    } else {
      companyMap.set(row.company.id, {
        company: row.company,
        totalScore: row.executive.currentScore,
        executiveCount: 1,
        activeCoders:
          row.executive.codingStatus === "active" || row.executive.codingStatus === "sometimes"
            ? 1
            : 0,
      })
    }
  }

  // Fetch last 9 days of snapshots for sparklines
  const snapshots = await db
    .select({
      executiveId: githubSnapshots.executiveId,
      snapshotDate: githubSnapshots.snapshotDate,
      cookingScore: githubSnapshots.cookingScore,
    })
    .from(githubSnapshots)
    .where(gte(githubSnapshots.snapshotDate, sql`current_date - 9`))
    .orderBy(asc(githubSnapshots.snapshotDate))

  // Map executive -> company for lookup
  const execToCompany = new Map<string, string>()
  for (const row of rows) {
    execToCompany.set(row.executive.id, row.company.id)
  }

  // Group snapshots by company and date, computing daily avg
  const companyDateScores = new Map<string, Map<string, number[]>>()
  for (const snap of snapshots) {
    const companyId = execToCompany.get(snap.executiveId)
    if (!companyId) continue

    if (!companyDateScores.has(companyId)) {
      companyDateScores.set(companyId, new Map())
    }
    const dateMap = companyDateScores.get(companyId)!
    if (!dateMap.has(snap.snapshotDate)) {
      dateMap.set(snap.snapshotDate, [])
    }
    dateMap.get(snap.snapshotDate)!.push(snap.cookingScore)
  }

  // Build score history arrays (daily averages, sorted by date)
  const companyScoreHistory = new Map<string, number[]>()
  for (const [companyId, dateMap] of companyDateScores) {
    const sortedDates = [...dateMap.keys()].sort()
    const avgScores = sortedDates.map((date) => {
      const scores = dateMap.get(date)!
      return scores.reduce((a, b) => a + b, 0) / scores.length
    })
    companyScoreHistory.set(companyId, avgScores)
  }

  // Build final entries sorted by avg score
  const entries: CompanyLeaderboardEntry[] = [...companyMap.values()]
    .map((c) => ({
      company: c.company,
      avgScore: c.executiveCount > 0 ? c.totalScore / c.executiveCount : 0,
      executiveCount: c.executiveCount,
      activeCoders: c.activeCoders,
      scoreHistory: companyScoreHistory.get(c.company.id) ?? [],
    }))
    .sort((a, b) => b.avgScore - a.avgScore)

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-12 md:px-10">
      <div className="mb-6 space-y-2 sm:mb-8">
        <h1 className="bg-gradient-to-br from-foreground to-orange-500 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-4xl">
          Company Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground sm:text-[1.05rem]">
          Which companies have leadership that actually codes? Ranked by average
          executive Cook Index score.
        </p>
      </div>

      <CompanyLeaderboard entries={entries} />
    </div>
  )
}
