"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScoreSparkline } from "@/components/score-sparkline"
import { getScoreTier } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Executive, Company } from "@/lib/db/schema"

interface LeaderboardEntry {
  executive: Executive
  company: Company
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  scoreHistory?: Record<string, number[]>
  startRank?: number
}

export function LeaderboardTable({
  entries,
  scoreHistory = {},
  startRank = 1,
}: LeaderboardTableProps) {
  const [filter, setFilter] = useState<"all" | "c-suite" | "founder">("all")

  const filtered =
    filter === "all"
      ? entries
      : entries.filter((e) => e.executive.category === filter)

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground">
          Full Rankings {startRank > 1 ? `\u00b7 ${startRank}-${startRank + entries.length - 1}` : ""}
        </span>
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
          {(["all", "c-suite", "founder"] as const).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-[0.78rem] font-semibold transition-all sm:px-4",
                filter === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {value === "all" ? "All" : value === "c-suite" ? "C-Suite" : "Founders"}
            </button>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="w-12 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal">
              #
            </TableHead>
            <TableHead className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal">
              Name
            </TableHead>
            <TableHead className="hidden sm:table-cell font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal">
              Company
            </TableHead>
            <TableHead className="text-center font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal">
              Score
            </TableHead>
            <TableHead className="hidden md:table-cell text-center font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal w-[120px]">
              30d Trend
            </TableHead>
            <TableHead className="hidden md:table-cell text-center font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((entry, index) => {
            const tier = getScoreTier(entry.executive.currentScore)
            const initials = entry.executive.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
            const history = scoreHistory[entry.executive.id] ?? []
            const rank = startRank + index
            const scoreClass =
              entry.executive.currentScore >= 62
                ? "text-orange-500"
                : entry.executive.currentScore >= 50
                  ? "text-amber-500"
                  : "text-muted-foreground"

            return (
              <TableRow
                key={entry.executive.id}
                className="border-none bg-card transition-all hover:translate-x-1 hover:bg-accent [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
              >
                <TableCell className="py-3.5">
                  <span className="font-mono text-sm font-bold text-muted-foreground">
                    {rank}
                  </span>
                </TableCell>
                <TableCell className="py-3.5">
                  <Link
                    href={`/executives/${entry.executive.id}`}
                    className="flex items-center gap-3 hover:opacity-80"
                  >
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage
                        src={entry.executive.avatarUrl ?? undefined}
                        alt={entry.executive.name}
                      />
                      <AvatarFallback className="text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[0.88rem] font-semibold tracking-tight">
                        {entry.executive.name}
                      </p>
                      <p className="text-[0.7rem] text-muted-foreground">
                        {entry.executive.title}
                      </p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell py-3.5">
                  <Link
                    href={`/companies/${entry.company.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {entry.company.name}
                  </Link>
                </TableCell>
                <TableCell className="py-3.5 text-center">
                  <span className={cn("font-mono text-base font-bold", scoreClass)}>
                    {Math.round(entry.executive.currentScore)}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3.5">
                  <div className="flex justify-center">
                    <ScoreSparkline
                      scores={history}
                      color={tier.status === "smoking" ? "orange" : "muted"}
                    />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3.5 text-center">
                  <Badge variant={tier.badgeVariant}>
                    {tier.status === "smoking" ? "Smoking" : "Slow & Low"}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-muted-foreground"
              >
                No executives found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
