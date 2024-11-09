import { Octokit } from "octokit";
import { env } from "./env";

export const octokit = new Octokit(env.GITHUB_TOKEN ? { auth: env.GITHUB_TOKEN } : undefined);
