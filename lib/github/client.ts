const GITHUB_API = "https://api.github.com"

interface RateLimitInfo {
  remaining: number
  reset: number
}

let rateLimitInfo: RateLimitInfo = { remaining: 5000, reset: 0 }

export async function githubFetch<T>(
  path: string,
  token: string
): Promise<T | null> {
  if (rateLimitInfo.remaining < 100) {
    const waitMs = (rateLimitInfo.reset - Date.now() / 1000) * 1000
    if (waitMs > 0) {
      console.log(`Rate limit low, waiting ${Math.ceil(waitMs / 1000)}s`)
      await new Promise((r) => setTimeout(r, Math.min(waitMs, 60000)))
    }
  }

  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 0 },
  })

  rateLimitInfo = {
    remaining: parseInt(response.headers.get("x-ratelimit-remaining") ?? "5000"),
    reset: parseInt(response.headers.get("x-ratelimit-reset") ?? "0"),
  }

  if (!response.ok) {
    console.error(`GitHub API error: ${response.status} ${path}`)
    return null
  }

  return response.json() as Promise<T>
}
