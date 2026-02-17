import { notFound } from "next/navigation"
import Link from "next/link"
import { eq, desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { executives, companies, githubSnapshots } from "@/lib/db/schema"
import { calculateScore } from "@/lib/github/scoring"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CookingScore } from "@/components/cooking-score"
import { ScoreBreakdown } from "@/components/score-breakdown"
import { ActivityChart } from "@/components/activity-chart"
import { getScoreTier } from "@/lib/constants"

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ExecutivePage({ params }: Props) {
  const { slug } = await params

  const result = await db
    .select({
      executive: executives,
      company: companies,
    })
    .from(executives)
    .innerJoin(companies, eq(executives.companyId, companies.id))
    .where(eq(executives.id, slug))
    .limit(1)

  if (result.length === 0) return notFound()

  const { executive, company } = result[0]

  const latestSnapshot = await db
    .select()
    .from(githubSnapshots)
    .where(eq(githubSnapshots.executiveId, executive.id))
    .orderBy(desc(githubSnapshots.snapshotDate))
    .limit(1)

  const snapshot = latestSnapshot[0] ?? null
  const tier = getScoreTier(executive.currentScore)

  const initials = executive.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  // Reconstruct score breakdown from snapshot metrics
  const scoreBreakdown = snapshot
    ? calculateScore({
        pushEventCount: snapshot.pushEventCount,
        commitCount: snapshot.commitCount,
        prCount: snapshot.prCount,
        issueCount: snapshot.issueCount,
        totalStars: snapshot.totalStars,
        recentRepoCount: snapshot.recentRepoCount,
        languages: (snapshot.languages ?? {}) as Record<string, number>,
        aiRelatedActivity: snapshot.aiRelatedActivity,
        daysSinceLastEvent: snapshot.daysSinceLastEvent,
        weeklyBreakdown: snapshot.rawEventSummary?.weeklyBreakdown ?? [],
        topRepos: snapshot.rawEventSummary?.topRepos ?? [],
        recentEvents: snapshot.rawEventSummary?.recentEvents ?? [],
      })
    : null

  const eventSummary = snapshot?.rawEventSummary as {
    weeklyBreakdown: { week: string; events: number }[]
    topRepos: { name: string; stars: number; language: string | null }[]
    recentEvents: { type: string; repo: string; date: string }[]
  } | null

  const languages = (snapshot?.languages ?? {}) as Record<string, number>

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-12 md:px-10">
      {/* Profile Header */}
      <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={executive.avatarUrl ?? undefined}
            alt={executive.name}
          />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{executive.name}</h1>
          <p className="text-lg text-muted-foreground">
            {executive.title},{" "}
            <Link
              href={`/companies/${company.id}`}
              className="hover:underline"
            >
              {company.name}
            </Link>
            {company.ticker && (
              <Badge variant="outline" className="ml-1.5 align-middle text-xs">
                {company.ticker}
              </Badge>
            )}
          </p>
          <div className="flex items-center gap-2">
            {executive.githubUsername && (
              <a
                href={`https://github.com/${executive.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:underline"
              >
                @{executive.githubUsername}
              </a>
            )}
            {executive.codingStatus && executive.codingStatus !== "never" && (
              <Badge variant="outline" className="text-xs">
                {executive.codingStatus === "active"
                  ? "Active Coder"
                  : executive.codingStatus === "sometimes"
                    ? "Sometimes Codes"
                    : "Engineering Background"}
              </Badge>
            )}
          </div>
          {executive.bio && (
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              {executive.bio}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center">
          <CookingScore score={executive.currentScore} size="lg" />
          <Badge variant={tier.badgeVariant} className="mt-2">
            {tier.label}
          </Badge>
        </div>
      </div>

      <Separator className="mb-8" />

      {!executive.githubUsername ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No public GitHub account found for {executive.name}.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This executive either doesn&apos;t code publicly or uses a
              private account.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Score Breakdown */}
          {scoreBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreBreakdown breakdown={scoreBreakdown} />
              </CardContent>
            </Card>
          )}

          {/* Weekly Activity */}
          {eventSummary && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityChart data={eventSummary.weeklyBreakdown} />
              </CardContent>
            </Card>
          )}

          {/* Languages */}
          {Object.keys(languages).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(languages)
                    .sort(([, a], [, b]) => b - a)
                    .map(([lang, count]) => (
                      <Badge key={lang} variant="secondary">
                        {lang} ({count})
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Repos */}
          {eventSummary && eventSummary.topRepos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Repositories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eventSummary.topRepos.map((repo) => (
                    <div
                      key={repo.name}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{repo.name}</p>
                        {repo.language && (
                          <p className="text-xs text-muted-foreground">
                            {repo.language}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {repo.stars.toLocaleString()} stars
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Stats */}
          {snapshot && (
            <Card>
              <CardHeader>
                <CardTitle>Activity Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{snapshot.commitCount}</p>
                    <p className="text-xs text-muted-foreground">
                      Recent Commits
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{snapshot.prCount}</p>
                    <p className="text-xs text-muted-foreground">
                      Pull Requests
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {snapshot.totalStars.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Stars</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {snapshot.recentRepoCount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Active Repos (90d)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
