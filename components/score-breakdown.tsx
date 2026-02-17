import { Progress } from "@/components/ui/progress"
import { SCORING_WEIGHTS } from "@/lib/constants"
import type { ScoreBreakdown as ScoreBreakdownType } from "@/lib/github/types"

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const components = [
    { key: "commitVelocity" as const, value: breakdown.commitVelocity },
    { key: "activityBreadth" as const, value: breakdown.activityBreadth },
    { key: "recency" as const, value: breakdown.recency },
    { key: "repoEngagement" as const, value: breakdown.repoEngagement },
    { key: "aiSignal" as const, value: breakdown.aiSignal },
    { key: "languageDiversity" as const, value: breakdown.languageDiversity },
  ]

  return (
    <div className="space-y-4">
      {components.map(({ key, value }) => {
        const config = SCORING_WEIGHTS[key]
        const percentage = (value / config.weight) * 100

        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{config.label}</span>
              <span className="text-muted-foreground">
                {value}/{config.weight}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {config.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}
