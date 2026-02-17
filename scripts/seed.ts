import "dotenv/config"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { companies, executives, githubSnapshots } from "../lib/db/schema"
import { seedCompanies, seedExecutives } from "../lib/seed-data"
import { fetchExecutiveMetrics } from "../lib/github/fetcher"
import { calculateScore } from "../lib/github/scoring"
import { format } from "date-fns"

async function seed() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL not set")
    process.exit(1)
  }

  const sql = neon(url)
  const db = drizzle({ client: sql })

  console.log("Seeding companies...")
  for (const company of seedCompanies) {
    await db
      .insert(companies)
      .values(company)
      .onConflictDoUpdate({
        target: companies.id,
        set: {
          name: company.name,
          ticker: company.ticker,
          industry: company.industry,
          companyType: company.companyType,
          scale: company.scale,
          foundedYear: company.foundedYear,
          headquarters: company.headquarters,
          description: company.description,
          websiteUrl: company.websiteUrl,
          employeeRange: company.employeeRange,
          sector: company.sector,
        },
      })
  }
  console.log(`Inserted ${seedCompanies.length} companies`)

  console.log("Seeding executives...")
  for (const exec of seedExecutives) {
    await db
      .insert(executives)
      .values({
        ...exec,
        currentScore: 0,
      })
      .onConflictDoUpdate({
        target: executives.id,
        set: {
          name: exec.name,
          title: exec.title,
          companyId: exec.companyId,
          githubUsername: exec.githubUsername,
          category: exec.category,
          codingStatus: exec.codingStatus,
          bio: exec.bio,
        },
      })
  }
  console.log(`Inserted ${seedExecutives.length} executives`)

  // Optionally fetch GitHub data
  const githubToken = process.env.GITHUB_TOKEN
  if (!githubToken) {
    console.log("No GITHUB_TOKEN set, skipping GitHub data fetch")
    return
  }

  console.log("Fetching GitHub data for executives with accounts...")
  const today = format(new Date(), "yyyy-MM-dd")

  for (const exec of seedExecutives) {
    if (!exec.githubUsername) {
      console.log(`  ${exec.name}: No GitHub account`)
      continue
    }

    console.log(`  Fetching ${exec.name} (@${exec.githubUsername})...`)
    const metrics = await fetchExecutiveMetrics(exec.githubUsername, githubToken)

    if (!metrics) {
      console.log(`    Failed to fetch data`)
      continue
    }

    const score = calculateScore(metrics)
    console.log(`    Score: ${score.total}`)

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

    // Update denormalized score
    const { eq } = await import("drizzle-orm")
    await db
      .update(executives)
      .set({
        currentScore: score.total,
        lastSyncedAt: new Date(),
        avatarUrl: `https://github.com/${exec.githubUsername}.png`,
      })
      .where(eq(executives.id, exec.id))

    // Polite delay
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log("Seed complete!")
}

seed().catch(console.error)
