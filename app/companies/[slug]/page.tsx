import { notFound } from "next/navigation"
import { eq, desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { executives, companies } from "@/lib/db/schema"
import { Badge } from "@/components/ui/badge"
import { ExecutiveCard } from "@/components/executive-card"
import { getScoreTier } from "@/lib/constants"

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params

  const companyResult = await db
    .select()
    .from(companies)
    .where(eq(companies.id, slug))
    .limit(1)

  if (companyResult.length === 0) return notFound()

  const company = companyResult[0]

  const companyExecutives = await db
    .select()
    .from(executives)
    .where(eq(executives.companyId, company.id))
    .orderBy(desc(executives.currentScore))

  const avgScore =
    companyExecutives.length > 0
      ? companyExecutives.reduce((sum, e) => sum + e.currentScore, 0) /
        companyExecutives.length
      : 0
  const avgTier = getScoreTier(avgScore)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{company.name}</h1>
          {company.ticker && (
            <Badge variant="outline">{company.ticker}</Badge>
          )}
        </div>
        <p className="mt-1 text-muted-foreground">{company.industry}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Average Score:</span>
          <span className={`text-2xl font-bold ${avgTier.color}`}>
            {Math.round(avgScore)}
          </span>
          <Badge variant={avgTier.badgeVariant}>{avgTier.label}</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companyExecutives.map((exec) => (
          <ExecutiveCard key={exec.id} executive={exec} company={company} />
        ))}
      </div>

      {companyExecutives.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No tracked executives for this company.
        </p>
      )}
    </div>
  )
}
