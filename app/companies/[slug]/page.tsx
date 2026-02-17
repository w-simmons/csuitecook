import { notFound } from "next/navigation"
import { eq, desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { executives, companies } from "@/lib/db/schema"
import { Badge } from "@/components/ui/badge"
import { ExecutiveCard } from "@/components/executive-card"
import { getScoreTier } from "@/lib/constants"
import { MapPin, Calendar, Users, ExternalLink } from "lucide-react"

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

const companyTypeLabels: Record<string, string> = {
  public: "Public",
  private: "Private",
  subsidiary: "Subsidiary",
  non_profit: "Non-Profit",
  open_source_project: "Open Source Project",
}

const scaleLabels: Record<string, string> = {
  mega_cap: "Mega Cap",
  large_cap: "Large Cap",
  mid_cap: "Mid Cap",
  small_cap: "Small Cap",
  unicorn: "Unicorn",
  growth: "Growth",
  early_stage: "Early Stage",
  bootstrapped: "Bootstrapped",
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
    <div className="mx-auto max-w-[1100px] px-6 py-12 md:px-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{company.name}</h1>
          {company.ticker && (
            <Badge variant="outline">{company.ticker}</Badge>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {companyTypeLabels[company.companyType] ?? company.companyType}
          </Badge>
          {company.scale && (
            <Badge variant="secondary">
              {scaleLabels[company.scale] ?? company.scale}
            </Badge>
          )}
          {company.sector && (
            <Badge variant="outline">{company.sector}</Badge>
          )}
        </div>
        <p className="mt-1 text-muted-foreground">{company.industry}</p>

        {company.description && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {company.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {company.foundedYear && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Founded {company.foundedYear}
            </span>
          )}
          {company.headquarters && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {company.headquarters}
            </span>
          )}
          {company.employeeRange && (
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {company.employeeRange} employees
            </span>
          )}
          {company.websiteUrl && (
            <a
              href={company.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {company.websiteUrl.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>

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
