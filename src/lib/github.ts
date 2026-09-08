interface RepoStats {
  stars: number;
  updatedAt: string;
}

const cache = new Map<string, Promise<RepoStats | null>>();

async function fetchStats(repo: string): Promise<RepoStats | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "prjvvl.github.io" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { stars: data.stargazers_count, updatedAt: data.pushed_at };
  } catch {
    return null;
  }
}

/**
 * Cached per repo for the lifetime of the build/dev process, so repeated
 * page renders (especially `astro dev`, which re-runs frontmatter per
 * request) don't re-hit the GitHub API and burn through the unauthenticated
 * rate limit. Resolves to null on any failure (offline, rate-limited) so a
 * build never breaks because of this.
 */
export function getRepoStats(repo: string): Promise<RepoStats | null> {
  if (!cache.has(repo)) {
    cache.set(repo, fetchStats(repo));
  }
  return cache.get(repo)!;
}
