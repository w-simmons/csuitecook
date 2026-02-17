"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScoreSparkline } from "@/components/score-sparkline"
import { getScoreTier } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Executive, Company } from "@/lib/db/schema"

interface PodiumEntry {
  executive: Executive
  company: Company
}

interface PodiumProps {
  entries: PodiumEntry[]
  scoreHistory: Record<string, number[]>
}

function PodiumCard({
  entry,
  rank,
  scoreHistory,
}: {
  entry: PodiumEntry
  rank: number
  scoreHistory: number[]
}) {
  const tier = getScoreTier(entry.executive.currentScore)
  const isFirst = rank === 1
  const initials = entry.executive.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
  const [firstName, ...lastParts] = entry.executive.name.split(" ")
  const lastName = lastParts.join(" ")

  return (
    <Link href={`/executives/${entry.executive.id}`} className="group">
      <Card
        className={cn(
          "relative flex flex-col items-center border px-4 pb-4 pt-6 transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]",
          "w-[140px] sm:w-[170px]",
          isFirst &&
            "w-[160px] sm:w-[210px] border-orange-500/40 bg-gradient-to-b from-orange-500/[0.08] to-card px-5 pb-5 pt-7 sm:pt-8 sm:pb-6"
        )}
      >
        {/* Rank badge */}
        <div
          className={cn(
            "absolute -top-3 left-1/2 flex h-[26px] w-[26px] -translate-x-1/2 items-center justify-center rounded-lg font-mono text-xs font-extrabold",
            rank === 1 &&
              "h-[30px] w-[30px] bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.5)]",
            rank === 2 && "bg-slate-400 text-black",
            rank === 3 && "bg-amber-600 text-black",
            rank >= 4 &&
              "border border-border bg-background text-muted-foreground"
          )}
        >
          {rank}
        </div>

        {/* Avatar */}
        <Avatar
          className={cn(
            "mb-2 h-12 w-12 border-2 border-border sm:mb-3 sm:h-16 sm:w-16",
            isFirst && "h-14 w-14 border-orange-500 sm:h-20 sm:w-20"
          )}
        >
          <AvatarImage
            src={entry.executive.avatarUrl ?? undefined}
            alt={entry.executive.name}
          />
          <AvatarFallback className={cn("text-sm sm:text-lg", isFirst && "text-lg sm:text-2xl")}>
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Name */}
        <div
          className={cn(
            "text-center text-xs font-bold leading-tight sm:text-sm",
            isFirst && "text-sm sm:text-base"
          )}
        >
          {firstName}
          <br />
          {lastName}
        </div>

        {/* Company */}
        <span className="mt-0.5 font-mono text-[0.65rem] text-muted-foreground sm:text-[0.72rem]">
          {entry.company.name}
        </span>

        {/* Score */}
        <div className="mt-2 sm:mt-3">
          <span
            className={cn(
              "font-mono text-xl font-bold text-orange-500 sm:text-2xl",
              isFirst && "text-2xl sm:text-3xl"
            )}
          >
            {Math.round(entry.executive.currentScore)}
          </span>
        </div>

        {/* Sparkline - hidden on small mobile */}
        <div className="mt-2 hidden w-full sm:block">
          <ScoreSparkline
            scores={scoreHistory}
            color={tier.status === "smoking" ? "orange" : "muted"}
          />
        </div>

        {/* Status badge */}
        <Badge variant={tier.badgeVariant} className="mt-2">
          {tier.status === "smoking" ? "Smoking" : "Slow & Low"}
        </Badge>
      </Card>
    </Link>
  )
}

export function Podium({ entries, scoreHistory }: PodiumProps) {
  const top5 = entries.slice(0, 5)
  const top3 = top5.slice(0, 3)

  // Desktop order: 4, 2, 1, 3, 5 (podium style)
  const desktopOrder = [top5[3], top5[1], top5[0], top5[2], top5[4]].filter(
    Boolean
  )
  // Mobile order: 2, 1, 3 (classic podium)
  const mobileOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3

  return (
    <div className="relative">
      <div className="podium-glow" />

      {/* Desktop: all 5 cards */}
      <div className="relative z-10 hidden items-end justify-center gap-4 md:flex">
        {desktopOrder.map((entry) => (
          <PodiumCard
            key={entry.executive.id}
            entry={entry}
            rank={top5.indexOf(entry) + 1}
            scoreHistory={scoreHistory[entry.executive.id] ?? []}
          />
        ))}
      </div>

      {/* Mobile: top 3 as podium cards */}
      <div className="relative z-10 flex items-end justify-center gap-3 md:hidden">
        {mobileOrder.map((entry) => (
          <PodiumCard
            key={entry.executive.id}
            entry={entry}
            rank={top5.indexOf(entry) + 1}
            scoreHistory={scoreHistory[entry.executive.id] ?? []}
          />
        ))}
      </div>

      {/* Mobile: 4th and 5th as compact rows */}
      {top5.length > 3 && (
        <div className="relative z-10 mt-3 space-y-2 md:hidden">
          {top5.slice(3).map((entry) => {
            const rank = top5.indexOf(entry) + 1
            const initials = entry.executive.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
            return (
              <Link
                key={entry.executive.id}
                href={`/executives/${entry.executive.id}`}
              >
                <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3">
                  <span className="w-6 font-mono text-sm font-bold text-muted-foreground">
                    {rank}
                  </span>
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage
                      src={entry.executive.avatarUrl ?? undefined}
                      alt={entry.executive.name}
                    />
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {entry.executive.name}
                    </p>
                    <p className="truncate font-mono text-[0.65rem] text-muted-foreground">
                      {entry.company.name}
                    </p>
                  </div>
                  <span className="font-mono text-lg font-bold text-orange-500">
                    {Math.round(entry.executive.currentScore)}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
