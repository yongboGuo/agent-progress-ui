import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "agent-progress-ui";
const basePath = isGitHubPagesBuild ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  transpilePackages: ["@agent-progress-ui/core", "@agent-progress-ui/react"],
  output: isGitHubPagesBuild ? "export" : undefined,
  assetPrefix: basePath || undefined,
  basePath,
  trailingSlash: isGitHubPagesBuild
};

export default nextConfig;
