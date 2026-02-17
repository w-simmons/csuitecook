import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SCORING_WEIGHTS } from "@/lib/constants"

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">About csuitecook</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        How we measure who&apos;s actually building.
      </p>

      <Separator className="my-8" />

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold">What is this?</h2>
          <p className="mt-2 text-muted-foreground">
            csuitecook tracks the public GitHub activity of tech leaders,
            C-suite executives, and prominent founders. Think of it as a
            financial indicator &mdash; the &quot;Cook Index&quot; &mdash;
            showing who&apos;s hands-on with technology and who isn&apos;t.
          </p>
          <p className="mt-2 text-muted-foreground">
            Inspired by leaders like Tobi Lutke who ship code daily alongside
            running billion-dollar companies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Scoring Methodology</h2>
          <p className="mt-2 text-muted-foreground">
            Each executive receives a Cooking Score from 0 to 100 based on six
            components of their public GitHub activity:
          </p>
          <div className="mt-4 grid gap-4">
            {Object.entries(SCORING_WEIGHTS).map(([key, config]) => (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{config.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {config.weight} points
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Score Tiers</h2>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-20 text-right font-mono text-sm">80-100</span>
              <span className="font-medium text-red-500">On Fire</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-right font-mono text-sm">60-79</span>
              <span className="font-medium text-orange-500">Cooking</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-right font-mono text-sm">40-59</span>
              <span className="font-medium text-yellow-500">Warming Up</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-right font-mono text-sm">20-39</span>
              <span className="font-medium text-blue-400">Simmering</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-right font-mono text-sm">1-19</span>
              <span className="font-medium text-slate-400">Cold Kitchen</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-right font-mono text-sm">0</span>
              <span className="font-medium text-slate-300">No GitHub</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Data Source</h2>
          <p className="mt-2 text-muted-foreground">
            All data comes from the GitHub REST API, specifically public
            activity. We look at:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            <li>Public events (pushes, PRs, issues)</li>
            <li>Repository metadata (stars, languages, topics)</li>
            <li>User profile information</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            Data is synced daily at 6 AM UTC. Only public activity is tracked
            &mdash; private repositories and enterprise activity are not
            visible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Limitations</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              Only public GitHub activity is measured. Many executives code in
              private repos.
            </li>
            <li>
              GitHub events API only returns the most recent 300 events (up to
              90 days).
            </li>
            <li>
              Activity doesn&apos;t measure quality &mdash; a one-line typo fix
              counts the same as a major feature.
            </li>
            <li>
              Some executives may have GitHub accounts we haven&apos;t
              identified.
            </li>
            <li>
              A low score doesn&apos;t mean someone is a bad leader &mdash;
              different roles require different focus.
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
