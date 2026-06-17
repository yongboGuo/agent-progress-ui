# agent-progress-ui

Open-source React runtime UI kit for long-running agents, MCP transcripts, approvals, and artifacts.

[![CI](https://github.com/yongboGuo/agent-progress-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/yongboGuo/agent-progress-ui/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-C4FF4D)](https://yongboGuo.github.io/agent-progress-ui/)
[![License: MIT](https://img.shields.io/badge/license-MIT-white)](./LICENSE)

![Cover](./assets/cover.png)

`agent-progress-ui` is no longer a generic task progress demo.  
It is now an MCP-first runtime UI kit for product teams building long-running code agents, research agents, and approval-aware workflows.

Live demo: [yongboGuo.github.io/agent-progress-ui](https://yongboGuo.github.io/agent-progress-ui/)

## What ships in v0.2

- A normalized `AgentRunEvent` and `AgentRunSnapshot` model
- A reducer and live store for incremental runtime updates
- A composable React workbench: `AgentWorkbench`, `AgentHeader`, `AgentStageRail`, `AgentTimeline`, `AgentEvidencePanel`, `AgentArtifactDock`, `AgentApprovalBar`, `AgentInspector`
- A thin `@agent-progress-ui/mcp` adapter package for transcript and session mapping
- A reference app with static transcripts, live store replay, and MCP adapter demos

## Why this repo changed

This repo targets the gap between:

- a spinner with no runtime context
- a chat shell with hidden tool state
- a real operator surface for runs that plan, wait, ask for approval, call tools, and emit reviewable artifacts

The new design principle is simple: the run itself should be visible as a product surface.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Minimal example

```ts
import { scenarioCatalog, getAgentRunSnapshot } from "@agent-progress-ui/core";
import { AgentWorkbench } from "@agent-progress-ui/react";

const snapshot = getAgentRunSnapshot(scenarioCatalog["code-agent"].events);
```

## MCP adapter example

```ts
import { createMcpRunAdapter, createMockMcpTranscript } from "@agent-progress-ui/mcp";

const adapter = createMcpRunAdapter({
  initialEnvelopes: createMockMcpTranscript("code-agent")
});

const snapshot = adapter.getSnapshot();
```

## Repo layout

```text
apps/web        docs + interactive reference app
packages/core   AgentRun model, reducer, store, mock scenarios
packages/react  composable runtime workbench components
packages/mcp    thin MCP transcript/session adapter
```

## Migration

`v0.2` is a breaking release.

- `TaskEvent` -> `AgentRunEvent`
- `TaskSnapshot` -> `AgentRunSnapshot`
- `TaskWorkbench` -> `AgentWorkbench`
- legacy task event conversion is available via `legacyTaskEventsToAgentRunEvents`

Detailed notes: [MIGRATION.md](./MIGRATION.md)

## Docs

- [Migration guide](./MIGRATION.md)
- [中文 README](./README.zh-CN.md)

## Development

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Versioning and release prep:

```bash
npm run changeset
npm run version-packages
```

## Assets

![Homepage screenshot](./assets/screenshots/home.png)
![Playground screenshot](./assets/screenshots/playground.png)
![Agent example screenshot](./assets/screenshots/example-agent.png)

![Demo GIF](./assets/demo.gif)
