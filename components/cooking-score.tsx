import { cn } from "@/lib/utils"
import { getScoreTier } from "@/lib/constants"

interface CookingScoreProps {
  score: number
  size?: "sm" | "md" | "lg"
}

export function CookingScore({ score, size = "md" }: CookingScoreProps) {
  const tier = getScoreTier(score)

  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-3xl font-bold",
    lg: "text-5xl font-bold",
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={cn("font-mono text-orange-500", sizeClasses[size])}>
        {Math.round(score)}
      </span>
      {size !== "sm" && (
        <span className={cn("font-mono text-xs font-medium", tier.color)}>
          {tier.label}
        </span>
      )}
    </div>
  )
}
