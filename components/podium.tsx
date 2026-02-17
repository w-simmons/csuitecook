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

export function Podium({ entries, scoreHistory }: PodiumProps) {
  const top5 = entries.slice(0, 5)

  // Reorder for podium display: 4, 2, 1, 3, 5
  const podiumOrder = [top5[3], top5[1], top5[0], top5[2], top5[4]].filter(
    Boolean
  )

  return (
    <div className="relative">
      <div className="podium-glow" />
      <div className="relative z-10 flex flex-wrap items-end justify-center gap-4">
        {podiumOrder.map((entry) => {
          const rank = top5.indexOf(entry) + 1
          const tier = getScoreTier(entry.executive.currentScore)
          const isFirst = rank === 1
          const history = scoreHistory[entry.executive.id] ?? []
          const initials = entry.executive.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
          const [firstName, ...lastParts] = entry.executive.name.split(" ")
          const lastName = lastParts.join(" ")

          return (
            <Link
              key={entry.executive.id}
              href={`/executives/${entry.executive.id}`}
              className="group"
            >
              <Card
                className={cn(
                  "relative flex w-[170px] flex-col items-center border px-5 pb-5 pt-7 transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]",
                  isFirst &&
                    "w-[210px] border-orange-500/40 bg-gradient-to-b from-orange-500/[0.08] to-card pt-8 pb-6"
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
                    "mb-3 h-16 w-16 border-2 border-border",
                    isFirst && "h-20 w-20 border-orange-500"
                  )}
                >
                  <AvatarImage
                    src={entry.executive.avatarUrl ?? undefined}
                    alt={entry.executive.name}
                  />
                  <AvatarFallback
                    className={cn("text-lg", isFirst && "text-2xl")}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Name */}
                <div
                  className={cn(
                    "text-center text-sm font-bold leading-tight",
                    isFirst && "text-base"
                  )}
                >
                  {firstName}
                  <br />
                  {lastName}
                </div>

                {/* Company */}
                <span className="mt-0.5 font-mono text-[0.72rem] text-muted-foreground">
                  {entry.company.name}
                </span>

                {/* Score */}
                <div className="mt-3">
                  <span
                    className={cn(
                      "font-mono text-2xl font-bold text-orange-500",
                      isFirst && "text-3xl"
                    )}
                  >
                    {Math.round(entry.executive.currentScore)}
                  </span>
                </div>

                {/* Sparkline */}
                <div className="mt-2 w-full">
                  <ScoreSparkline
                    scores={history}
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
        })}
      </div>
    </div>
  )
}
