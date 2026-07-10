import { env } from "~/src/.server/env";

interface GitHubRepoResponse {
    stargazers_count: number;
}

const DEFAULT_REPO = "dreamy-ui/dreamy-ui";

export async function getGithubStars(): Promise<number | null> {
    const repo = env.VITE_SOURCE_REPO ?? DEFAULT_REPO;
    const [owner, name] = repo.split("/");

    if (!owner || !name) {
        console.warn(`Invalid VITE_SOURCE_REPO format: ${repo}`);
        return null;
    }

    try {
        const headers: HeadersInit = {
            Accept: "application/vnd.github+json",
            "User-Agent": "dreamy-ui-website"
        };

        const token = process.env.GITHUB_TOKEN;
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
            headers
        });

        if (!response.ok) {
            console.warn(`Failed to fetch GitHub stars for ${repo}: ${response.status}`);
            return null;
        }

        const data = (await response.json()) as GitHubRepoResponse;
        return data.stargazers_count ?? null;
    } catch (error) {
        console.warn(`Error fetching GitHub stars for ${repo}:`, error);
        return null;
    }
}
