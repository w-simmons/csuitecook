"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { format, parseISO } from "date-fns"

interface ActivityChartProps {
  data: { week: string; events: number }[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.week), "MMM d"),
  }))

  if (chartData.every((d) => d.events === 0)) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No recent activity
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid hsl(var(--border))",
            backgroundColor: "hsl(var(--card))",
          }}
          labelFormatter={(label) => `Week of ${label}`}
          formatter={(value) => [`${value} events`, "Activity"]}
        />
        <Bar
          dataKey="events"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
