"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart } from "recharts"

interface ScoreSparklineProps {
  scores: number[]
  color?: "orange" | "muted"
}

export function ScoreSparkline({ scores, color = "orange" }: ScoreSparklineProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted || scores.length < 2) {
    return (
      <span className="text-xs text-muted-foreground">&mdash;</span>
    )
  }

  const strokeColor = color === "orange" ? "#f97316" : "#78716c"
  const fillColor = color === "orange" ? "#f97316" : "#78716c"
  const gradId = `sparkGrad-${color}`

  const data = scores.map((value) => ({ value }))

  return (
    <div className="h-7 w-24">
      <AreaChart width={96} height={28} data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={1.5}
          fill={`url(#${gradId})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </div>
  )
}
