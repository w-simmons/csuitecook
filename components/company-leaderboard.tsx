"use client"

import { useState } from "react"
import Link from "next/link"
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
import type { Company } from "@/lib/db/schema"

export interface CompanyLeaderboardEntry {
  company: Company
  avgScore: number
  executiveCount: number
  activeCoders: number
  scoreHistory: number[]
}

interface CompanyLeaderboardProps {
  entries: CompanyLeaderboardEntry[]
}

type FilterValue = "all" | "public" | "private_startup" | "open_source"

function matchesFilter(companyType: string, filter: FilterValue): boolean {
  if (filter === "all") return true
  if (filter === "public") return companyType === "public"
  if (filter === "private_startup") return companyType === "private" || companyType === "subsidiary"
  if (filter === "open_source") return companyType === "open_source_project" || companyType === "non_profit"
  return true
}

export function CompanyLeaderboard({ entries }: CompanyLeaderboardProps) {
  const [filter, setFilter] = useState<FilterValue>("all")

  const filtered = entries.filter((e) => matchesFilter(e.company.companyType, filter))

  const filters: { value: FilterValue; label: string }[] = [
    { value: "all", label: "All" },
    { value: "public", label: "Public" },
    { value: "private_startup", label: "Private" },
    { value: "open_source", label: "Open Source" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground">
          Rankings
        </span>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-md px-4 py-1.5 text-[0.78rem] font-semibold transition-all",
                filter === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {label}
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
              Company
            </TableHead>
            <TableHead className="hidden sm:table-cell font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal">
              Industry
            </TableHead>
            <TableHead className="text-center font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal">
              Avg Score
            </TableHead>
            <TableHead className="hidden md:table-cell text-center font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal w-[120px]">
              Trend
            </TableHead>
            <TableHead className="hidden sm:table-cell text-center font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground font-normal">
              Executives
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((entry, index) => {
            const tier = getScoreTier(entry.avgScore)
            const scoreClass =
              entry.avgScore >= 62
                ? "text-orange-500"
                : entry.avgScore >= 50
                  ? "text-amber-500"
                  : "text-muted-foreground"

            return (
              <TableRow
                key={entry.company.id}
                className="border-none bg-card transition-all hover:translate-x-1 hover:bg-accent [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
              >
                <TableCell className="py-3.5">
                  <span className="font-mono text-sm font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                </TableCell>
                <TableCell className="py-3.5">
                  <Link
                    href={`/companies/${entry.company.id}`}
                    className="hover:opacity-80"
                  >
                    <p className="text-[0.88rem] font-semibold tracking-tight">
                      {entry.company.name}
                    </p>
                    {entry.company.ticker && (
                      <p className="font-mono text-xs text-muted-foreground">
                        {entry.company.ticker}
                      </p>
                    )}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell py-3.5 text-sm text-muted-foreground">
                  {entry.company.industry}
                </TableCell>
                <TableCell className="py-3.5 text-center">
                  <span className={cn("font-mono text-base font-bold", scoreClass)}>
                    {Math.round(entry.avgScore)}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3.5">
                  <div className="flex justify-center">
                    <ScoreSparkline
                      scores={entry.scoreHistory}
                      color={tier.status === "smoking" ? "orange" : "muted"}
                    />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell py-3.5 text-center font-mono text-sm text-muted-foreground">
                  {entry.activeCoders}/{entry.executiveCount} coding
                </TableCell>
              </TableRow>
            )
          })}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No companies found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
