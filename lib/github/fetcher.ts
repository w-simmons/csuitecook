import { differenceInDays, format, startOfWeek, subDays } from "date-fns"
import { githubFetch } from "./client"
import type {
  GitHubEvent,
  GitHubRepo,
  GitHubUser,
  ExecutiveMetrics,
} from "./types"

const AI_KEYWORDS = [
  "ai",
  "ml",
  "machine-learning",
  "deep-learning",
  "neural",
  "llm",
  "gpt",
  "transformer",
  "diffusion",
  "pytorch",
  "tensorflow",
  "langchain",
  "openai",
  "anthropic",
  "huggingface",
]

function isAiRelated(repo: GitHubRepo): boolean {
  const text = [
    repo.name,
    repo.description ?? "",
    ...repo.topics,
  ]
    .join(" ")
    .toLowerCase()
  return AI_KEYWORDS.some((kw) => text.includes(kw))
}

export async function fetchExecutiveMetrics(
  username: string,
  token: string
): Promise<ExecutiveMetrics | null> {
  const [user, repos, events] = await Promise.all([
    githubFetch<GitHubUser>(`/users/${username}`, token),
    githubFetch<GitHubRepo[]>(
      `/users/${username}/repos?sort=pushed&per_page=100&type=owner`,
      token
    ),
    githubFetch<GitHubEvent[]>(
      `/users/${username}/events/public?per_page=100`,
      token
    ),
  ])

  if (!user) return null

  const now = new Date()
  const ninetyDaysAgo = subDays(now, 90)
  const safeRepos = repos ?? []
  const safeEvents = events ?? []

  // Count events by type
  let pushEventCount = 0
  let commitCount = 0
  let prCount = 0
  let issueCount = 0
  const eventTypes = new Set<string>()

  for (const event of safeEvents) {
    eventTypes.add(event.type)
    switch (event.type) {
      case "PushEvent":
        pushEventCount++
        commitCount += event.payload.size ?? event.payload.commits?.length ?? 0
        break
      case "PullRequestEvent":
        prCount++
        break
      case "IssuesEvent":
        issueCount++
        break
    }
  }

  // Repos stats
  const recentRepos = safeRepos.filter(
    (r) => !r.fork && new Date(r.pushed_at) > ninetyDaysAgo
  )
  const totalStars = safeRepos.reduce((sum, r) => sum + r.stargazers_count, 0)

  // Languages
  const languages: Record<string, number> = {}
  for (const repo of safeRepos.filter((r) => !r.fork && r.language)) {
    languages[repo.language!] = (languages[repo.language!] ?? 0) + 1
  }

  // AI signal
  const aiRelatedActivity = safeRepos.filter(
    (r) => !r.fork && isAiRelated(r)
  ).length

  // Days since last event
  const lastEventDate =
    safeEvents.length > 0 ? new Date(safeEvents[0].created_at) : null
  const daysSinceLastEvent = lastEventDate
    ? differenceInDays(now, lastEventDate)
    : null

  // Weekly breakdown (last 12 weeks)
  const weeklyMap = new Map<string, number>()
  for (let i = 0; i < 12; i++) {
    const weekStart = startOfWeek(subDays(now, i * 7))
    weeklyMap.set(format(weekStart, "yyyy-MM-dd"), 0)
  }
  for (const event of safeEvents) {
    const weekStart = startOfWeek(new Date(event.created_at))
    const key = format(weekStart, "yyyy-MM-dd")
    if (weeklyMap.has(key)) {
      weeklyMap.set(key, (weeklyMap.get(key) ?? 0) + 1)
    }
  }
  const weeklyBreakdown = Array.from(weeklyMap.entries())
    .map(([week, events]) => ({ week, events }))
    .reverse()

  // Top repos
  const topRepos = safeRepos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      language: r.language,
    }))

  // Recent events summary
  const recentEventsSummary = safeEvents.slice(0, 10).map((e) => ({
    type: e.type,
    repo: e.repo.name,
    date: e.created_at,
  }))

  return {
    pushEventCount,
    commitCount,
    prCount,
    issueCount,
    totalStars,
    recentRepoCount: recentRepos.length,
    languages,
    aiRelatedActivity,
    daysSinceLastEvent,
    weeklyBreakdown,
    topRepos,
    recentEvents: recentEventsSummary,
  }
}
