import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { CookingScore } from "@/components/cooking-score"
import type { Executive, Company } from "@/lib/db/schema"

interface ExecutiveCardProps {
  executive: Executive
  company: Company
}

export function ExecutiveCard({ executive, company }: ExecutiveCardProps) {
  const initials = executive.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Link href={`/executives/${executive.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={executive.avatarUrl ?? undefined} alt={executive.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{executive.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {executive.title}, {company.name}
            </p>
          </div>
          <CookingScore score={executive.currentScore} size="sm" />
        </CardContent>
      </Card>
    </Link>
  )
}
