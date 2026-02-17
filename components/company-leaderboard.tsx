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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreSparkline } from "@/components/score-sparkline"
import { getScoreTier } from "@/lib/constants"
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

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="private_startup">Private</TabsTrigger>
          <TabsTrigger value="open_source">Open Source</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden sm:table-cell">Industry</TableHead>
              <TableHead className="text-right">Avg Score</TableHead>
              <TableHead className="hidden md:table-cell">Trend</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Executives</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((entry, index) => {
              const tier = getScoreTier(entry.avgScore)

              return (
                <TableRow key={entry.company.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/companies/${entry.company.id}`}
                      className="hover:underline"
                    >
                      <p className="font-medium">{entry.company.name}</p>
                      {entry.company.ticker && (
                        <p className="text-xs text-muted-foreground">
                          {entry.company.ticker}
                        </p>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {entry.company.industry}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-lg font-bold ${tier.color}`}>
                      {Math.round(entry.avgScore)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <ScoreSparkline scores={entry.scoreHistory} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-sm text-muted-foreground">
                    {entry.activeCoders}/{entry.executiveCount} coding
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No companies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
