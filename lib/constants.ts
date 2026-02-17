export const SCORE_TIERS = [
  { min: 80, label: "On Fire", color: "text-red-500", bgColor: "bg-red-500/10", badgeVariant: "destructive" as const },
  { min: 60, label: "Cooking", color: "text-orange-500", bgColor: "bg-orange-500/10", badgeVariant: "default" as const },
  { min: 40, label: "Warming Up", color: "text-yellow-500", bgColor: "bg-yellow-500/10", badgeVariant: "secondary" as const },
  { min: 20, label: "Simmering", color: "text-blue-400", bgColor: "bg-blue-400/10", badgeVariant: "secondary" as const },
  { min: 1, label: "Cold Kitchen", color: "text-slate-400", bgColor: "bg-slate-400/10", badgeVariant: "outline" as const },
  { min: 0, label: "No GitHub", color: "text-slate-300", bgColor: "bg-slate-300/10", badgeVariant: "outline" as const },
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
