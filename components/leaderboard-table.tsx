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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getScoreTier } from "@/lib/constants"
import { formatDistanceToNow } from "date-fns"
import type { Executive, Company } from "@/lib/db/schema"

interface LeaderboardEntry {
  executive: Executive
  company: Company
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const [filter, setFilter] = useState<"all" | "c-suite" | "founder">("all")

  const filtered =
    filter === "all"
      ? entries
      : entries.filter((e) => e.executive.category === filter)

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="c-suite">C-Suite</TabsTrigger>
          <TabsTrigger value="founder">Founders</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Executive</TableHead>
              <TableHead className="hidden sm:table-cell">Company</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell text-right">
                Last Active
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

              return (
                <TableRow key={entry.executive.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/executives/${entry.executive.id}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={entry.executive.avatarUrl ?? undefined}
                          alt={entry.executive.name}
                        />
                        <AvatarFallback className="text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{entry.executive.name}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {entry.executive.title}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Link
                      href={`/companies/${entry.company.id}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      {entry.company.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {entry.executive.title}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-lg font-bold ${tier.color}`}>
                      {Math.round(entry.executive.currentScore)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={tier.badgeVariant}>{tier.label}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-right text-sm text-muted-foreground">
                    {entry.executive.lastSyncedAt
                      ? formatDistanceToNow(entry.executive.lastSyncedAt, {
                          addSuffix: true,
                        })
                      : "Never"}
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No executives found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
