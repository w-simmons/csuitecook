interface SeedCompany {
  id: string
  name: string
  ticker: string | null
  industry: string
  category: string
}

interface SeedExecutive {
  id: string
  name: string
  title: string
  companyId: string
  githubUsername: string | null
  category: "c-suite" | "founder"
}

export const seedCompanies: SeedCompany[] = [
  { id: "shopify", name: "Shopify", ticker: "SHOP", industry: "E-Commerce", category: "public" },
  { id: "stripe", name: "Stripe", ticker: null, industry: "Fintech", category: "startup" },
  { id: "vercel", name: "Vercel", ticker: null, industry: "Developer Tools", category: "startup" },
  { id: "hashicorp", name: "HashiCorp", ticker: "HCP", industry: "Infrastructure", category: "public" },
  { id: "comma-ai", name: "comma.ai", ticker: null, industry: "Autonomous Vehicles", category: "startup" },
  { id: "independent-karpathy", name: "Independent", ticker: null, industry: "AI/ML", category: "startup" },
  { id: "independent-levels", name: "Independent", ticker: null, industry: "Indie Hacker", category: "startup" },
  { id: "replit", name: "Replit", ticker: null, industry: "Developer Tools", category: "startup" },
  { id: "37signals", name: "37signals", ticker: null, industry: "Software", category: "startup" },
  { id: "dagger", name: "Dagger", ticker: null, industry: "Developer Tools", category: "startup" },
  { id: "independent-tpw", name: "Independent", ticker: null, industry: "Developer Tools", category: "startup" },
  { id: "independent-friedman", name: "Independent", ticker: null, industry: "Technology", category: "startup" },
  { id: "apple", name: "Apple", ticker: "AAPL", industry: "Consumer Electronics", category: "public" },
  { id: "microsoft", name: "Microsoft", ticker: "MSFT", industry: "Software", category: "public" },
  { id: "amazon", name: "Amazon", ticker: "AMZN", industry: "E-Commerce/Cloud", category: "public" },
  { id: "google", name: "Google (Alphabet)", ticker: "GOOGL", industry: "Technology", category: "public" },
  { id: "nvidia", name: "NVIDIA", ticker: "NVDA", industry: "Semiconductors", category: "public" },
  { id: "meta", name: "Meta", ticker: "META", industry: "Social Media", category: "public" },
]

export const seedExecutives: SeedExecutive[] = [
  // Known coders
  { id: "tobi-lutke", name: "Tobi Lutke", title: "CEO", companyId: "shopify", githubUsername: "tobi", category: "c-suite" },
  { id: "patrick-collison", name: "Patrick Collison", title: "CEO", companyId: "stripe", githubUsername: "patrickc", category: "c-suite" },
  { id: "guillermo-rauch", name: "Guillermo Rauch", title: "CEO", companyId: "vercel", githubUsername: "rauchg", category: "founder" },
  { id: "mitchell-hashimoto", name: "Mitchell Hashimoto", title: "Co-Founder", companyId: "hashicorp", githubUsername: "mitchellh", category: "founder" },
  { id: "george-hotz", name: "George Hotz", title: "Founder", companyId: "comma-ai", githubUsername: "geohot", category: "founder" },
  { id: "andrej-karpathy", name: "Andrej Karpathy", title: "AI Researcher", companyId: "independent-karpathy", githubUsername: "karpathy", category: "founder" },
  { id: "pieter-levels", name: "Pieter Levels", title: "Founder", companyId: "independent-levels", githubUsername: "levelsio", category: "founder" },
  { id: "amjad-masad", name: "Amjad Masad", title: "CEO", companyId: "replit", githubUsername: "amasad", category: "founder" },
  { id: "dhh", name: "David Heinemeier Hansson", title: "CTO", companyId: "37signals", githubUsername: "dhh", category: "founder" },
  { id: "solomon-hykes", name: "Solomon Hykes", title: "CEO", companyId: "dagger", githubUsername: "shykes", category: "founder" },
  { id: "tom-preston-werner", name: "Tom Preston-Werner", title: "Co-Founder", companyId: "independent-tpw", githubUsername: "mojombo", category: "founder" },
  { id: "nat-friedman", name: "Nat Friedman", title: "Investor & Builder", companyId: "independent-friedman", githubUsername: "nat", category: "founder" },
  // Notable non-coders
  { id: "tim-cook", name: "Tim Cook", title: "CEO", companyId: "apple", githubUsername: null, category: "c-suite" },
  { id: "satya-nadella", name: "Satya Nadella", title: "CEO", companyId: "microsoft", githubUsername: null, category: "c-suite" },
  { id: "andy-jassy", name: "Andy Jassy", title: "CEO", companyId: "amazon", githubUsername: null, category: "c-suite" },
  { id: "sundar-pichai", name: "Sundar Pichai", title: "CEO", companyId: "google", githubUsername: null, category: "c-suite" },
  { id: "jensen-huang", name: "Jensen Huang", title: "CEO", companyId: "nvidia", githubUsername: null, category: "c-suite" },
  { id: "mark-zuckerberg", name: "Mark Zuckerberg", title: "CEO", companyId: "meta", githubUsername: null, category: "c-suite" },
]
