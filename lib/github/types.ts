export interface GitHubUser {
  login: string
  avatar_url: string
  public_repos: number
  created_at: string
}

export interface GitHubRepo {
  name: string
  full_name: string
  stargazers_count: number
  language: string | null
  pushed_at: string
  topics: string[]
  fork: boolean
  description: string | null
}

export interface GitHubEvent {
  id: string
  type: string
  repo: { name: string }
  created_at: string
  payload: {
    size?: number // PushEvent commit count
    commits?: { message: string }[]
    action?: string
  }
}

export interface ExecutiveMetrics {
  pushEventCount: number
  commitCount: number
  prCount: number
  issueCount: number
  totalStars: number
  recentRepoCount: number
  languages: Record<string, number>
  aiRelatedActivity: number
  daysSinceLastEvent: number | null
  weeklyBreakdown: { week: string; events: number }[]
  topRepos: { name: string; stars: number; language: string | null }[]
  recentEvents: { type: string; repo: string; date: string }[]
}

export interface ScoreBreakdown {
  commitVelocity: number
  activityBreadth: number
  recency: number
  repoEngagement: number
  aiSignal: number
  languageDiversity: number
  total: number
}
