import Link from "next/link"
import { FlameIcon } from "@/components/flame-icon"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <FlameIcon className="h-7 w-7" />
          <span className="text-[1.15rem] font-extrabold tracking-tight">
            csuitecook
          </span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-primary transition-colors hover:text-primary"
          >
            Leaderboard
          </Link>
          <Link
            href="/companies"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Companies
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
