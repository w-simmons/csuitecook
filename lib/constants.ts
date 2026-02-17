export const SCORE_TIERS = [
  { min: 80, label: "On Fire", status: "smoking" as const, color: "text-red-500", bgColor: "bg-red-500/10", badgeVariant: "smoking" as const },
  { min: 60, label: "Cooking", status: "smoking" as const, color: "text-orange-500", bgColor: "bg-orange-500/10", badgeVariant: "smoking" as const },
  { min: 40, label: "Warming Up", status: "slow" as const, color: "text-amber-500", bgColor: "bg-amber-500/10", badgeVariant: "slow" as const },
  { min: 20, label: "Simmering", status: "slow" as const, color: "text-stone-400", bgColor: "bg-stone-400/10", badgeVariant: "slow" as const },
  { min: 1, label: "Cold Kitchen", status: "slow" as const, color: "text-stone-500", bgColor: "bg-stone-500/10", badgeVariant: "outline" as const },
  { min: 0, label: "No GitHub", status: "slow" as const, color: "text-stone-600", bgColor: "bg-stone-600/10", badgeVariant: "outline" as const },
] as const

export function getScoreTier(score: number) {
  return SCORE_TIERS.find((tier) => score >= tier.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1]
}

export const SCORING_WEIGHTS = {
  commitVelocity: { weight: 35, label: "Commit Velocity", description: "Commits in last 90 days, recency-weighted" },
  activityBreadth: { weight: 20, label: "Activity Breadth", description: "Diversity of event types (PRs, issues, reviews)" },
  recency: { weight: 20, label: "Recency", description: "How recently they pushed code" },
  repoEngagement: { weight: 10, label: "Repo Engagement", description: "Stars and active repositories" },
  aiSignal: { weight: 10, label: "AI Signal", description: "AI/ML-related repos and activity" },
  languageDiversity: { weight: 5, label: "Language Diversity", description: "Number of programming languages used" },
} as const
