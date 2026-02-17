"use client"

import { Area, AreaChart } from "recharts"

interface ScoreSparklineProps {
  scores: number[]
}

export function ScoreSparkline({ scores }: ScoreSparklineProps) {
  if (scores.length < 2) {
    return (
      <span className="text-xs text-muted-foreground">—</span>
    )
  }

  const first = scores[0]
  const last = scores[scores.length - 1]
  const diff = last - first

  const strokeColor =
    diff > 2 ? "#22c55e" : diff < -2 ? "#ef4444" : "#94a3b8"
  const fillColor =
    diff > 2 ? "#22c55e" : diff < -2 ? "#ef4444" : "#94a3b8"

  const data = scores.map((value) => ({ value }))

  return (
    <div className="h-7 w-20">
      <AreaChart width={80} height={28} data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={`sparkGrad-${fillColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={1.5}
          fill={`url(#sparkGrad-${fillColor})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </div>
  )
}
