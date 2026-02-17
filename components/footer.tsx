import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-[1100px] px-6 text-center font-mono text-xs text-muted-foreground md:px-10">
        <p>
          Data from GitHub public activity &middot;{" "}
          <Link href="/about" className="text-primary hover:underline">
            How we score
          </Link>
        </p>
      </div>
    </footer>
  )
}
