"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { FlameIcon } from "@/components/flame-icon"

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-4 sm:px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <FlameIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="text-base font-extrabold tracking-tight sm:text-[1.15rem]">
            csuitecook
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 sm:flex">
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

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground sm:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="border-t border-border bg-background px-4 pb-4 pt-2 sm:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-primary"
            >
              Leaderboard
            </Link>
            <Link
              href="/companies"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Companies
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
