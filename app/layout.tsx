import type { Metadata } from "next"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "csuitecook - Who's Actually Building?",
  description:
    "Tracking how much tech leaders and C-suite executives are actually coding. The Cook Index for tech leadership.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap"
        />
      </head>
      <body className="antialiased">
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </TooltipProvider>
      </body>
    </html>
  )
}
