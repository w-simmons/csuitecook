import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { format } from "date-fns"
import { db } from "@/lib/db"
import { executives, githubSnapshots } from "@/lib/db/schema"
import { fetchExecutiveMetrics } from "@/lib/github/fetcher"
import { calculateScore } from "@/lib/github/scoring"

export const maxDuration = 300 // 5 min for Vercel Pro

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const githubToken = process.env.GITHUB_TOKEN
  if (!githubToken) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 }
    )
  }

  const allExecutives = await db.select().from(executives)
  const today = format(new Date(), "yyyy-MM-dd")
  const results: { name: string; score: number | null; error?: string }[] = []

  for (const exec of allExecutives) {
    if (!exec.githubUsername) {
      results.push({ name: exec.name, score: 0 })
      continue
    }

    try {
      const metrics = await fetchExecutiveMetrics(exec.githubUsername, githubToken)

      if (!metrics) {
        results.push({ name: exec.name, score: null, error: "fetch failed" })
        continue
      }

      const score = calculateScore(metrics)

      await db
        .insert(githubSnapshots)
        .values({
          executiveId: exec.id,
          snapshotDate: today,
          pushEventCount: metrics.pushEventCount,
          commitCount: metrics.commitCount,
          prCount: metrics.prCount,
          issueCount: metrics.issueCount,
          totalStars: metrics.totalStars,
          recentRepoCount: metrics.recentRepoCount,
          languages: metrics.languages,
          aiRelatedActivity: metrics.aiRelatedActivity,
          daysSinceLastEvent: metrics.daysSinceLastEvent,
          cookingScore: score.total,
          rawEventSummary: {
            weeklyBreakdown: metrics.weeklyBreakdown,
            topRepos: metrics.topRepos,
            recentEvents: metrics.recentEvents,
          },
        })
        .onConflictDoNothing()

      await db
        .update(executives)
        .set({
          currentScore: score.total,
          lastSyncedAt: new Date(),
          avatarUrl: `https://github.com/${exec.githubUsername}.png`,
        })
        .where(eq(executives.id, exec.id))

      results.push({ name: exec.name, score: score.total })
    } catch (error) {
      results.push({
        name: exec.name,
        score: null,
        error: error instanceof Error ? error.message : "unknown",
      })
    }

    // Polite delay between requests
    await new Promise((r) => setTimeout(r, 500))
  }

  return NextResponse.json({
    synced: results.length,
    date: today,
    results,
  })
}
