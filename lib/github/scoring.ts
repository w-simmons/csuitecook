import type { ExecutiveMetrics, ScoreBreakdown } from "./types"

export function calculateScore(metrics: ExecutiveMetrics): ScoreBreakdown {
  // Commit Velocity (35 points)
  // Log scale: 1 commit = ~5pts, 10 = ~17pts, 50 = ~28pts, 100+ = ~35pts
  const commitVelocity = Math.min(
    35,
    metrics.commitCount > 0
      ? Math.round(35 * (Math.log10(metrics.commitCount + 1) / Math.log10(150)))
      : 0
  )

  // Activity Breadth (20 points)
  // Count distinct event types from recent events
  const eventTypes = new Set(metrics.recentEvents.map((e) => e.type))
  const breadthScore = Math.min(eventTypes.size, 5) // cap at 5 types
  const activityBreadth = Math.round((breadthScore / 5) * 20)

  // Recency (20 points)
  // 0-1 days = 20, 7 days = 15, 30 days = 8, 90+ days = 0
  let recency = 0
  if (metrics.daysSinceLastEvent !== null) {
    if (metrics.daysSinceLastEvent <= 1) recency = 20
    else if (metrics.daysSinceLastEvent <= 7)
      recency = Math.round(20 - (metrics.daysSinceLastEvent / 7) * 5)
    else if (metrics.daysSinceLastEvent <= 30)
      recency = Math.round(15 - ((metrics.daysSinceLastEvent - 7) / 23) * 7)
    else if (metrics.daysSinceLastEvent <= 90)
      recency = Math.round(8 - ((metrics.daysSinceLastEvent - 30) / 60) * 8)
  }

  // Repo Engagement (10 points)
  // Stars (log scale) + recent active repos
  const starScore = Math.min(
    5,
    metrics.totalStars > 0
      ? Math.round(5 * (Math.log10(metrics.totalStars + 1) / Math.log10(10000)))
      : 0
  )
  const repoScore = Math.min(5, Math.round((metrics.recentRepoCount / 10) * 5))
  const repoEngagement = starScore + repoScore

  // AI Signal (10 points)
  const aiSignal = Math.min(10, metrics.aiRelatedActivity * 2)

  // Language Diversity (5 points)
  const langCount = Object.keys(metrics.languages).length
  const languageDiversity = Math.min(5, langCount)

  const total = Math.min(
    100,
    commitVelocity +
      activityBreadth +
      recency +
      repoEngagement +
      aiSignal +
      languageDiversity
  )

  return {
    commitVelocity,
    activityBreadth,
    recency,
    repoEngagement,
    aiSignal,
    languageDiversity,
    total,
  }
}
