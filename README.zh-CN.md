# agent-progress-ui

面向长任务 AI 和 agent 产品的开源 React UI 系统。

[![CI](https://github.com/yongboGuo/agent-progress-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/yongboGuo/agent-progress-ui/actions/workflows/ci.yml)
[![在线 Demo](https://img.shields.io/badge/demo-live-C4FF4D)](https://yongboGuo.github.io/agent-progress-ui/)
[![License: MIT](https://img.shields.io/badge/license-MIT-white)](./LICENSE)

![封面](./assets/cover.png)

`agent-progress-ui` 的目标是把“模糊的 loading”升级成“可观察、可中断、可审阅的任务工作台”。仓库同时提供固定状态机、事件 reducer、可复用 React 组件，以及一个带首页、playground 和示例场景的 Next.js demo 站。

在线 Demo: [yongboGuo.github.io/agent-progress-ui](https://yongboGuo.github.io/agent-progress-ui/)

## v0.1 包含内容

- 一套稳定的长任务状态机
- 从事件流归并到 `TaskSnapshot` 的 reducer
- 可复用 React 组件：`TaskWorkbench`、`StageRail`、`EvidenceFeed`、`LivenessPulse`、`TaskStateBadge`、`TaskTimer`
- 三套内置场景：chat、research、agent
- 一个完整 demo 站：`/`、`/playground`、`/examples/*`

## 快速开始

```bash
npm install
npm run dev
```

然后访问 `http://localhost:3000`。

## 仓库结构

```text
apps/web        Next.js 官网和交互 demo
packages/core   状态机、事件模型、reducer、场景数据
packages/react  可复用 React UI 组件
```

## 文档

- [设计原则](./docs/principles.md)
- [状态机](./docs/state-machine.md)
- [事件协议](./docs/event-schema.md)
- [场景说明](./docs/scenarios.md)
- [中文原始研究文档](./docs/zh/AI%20%E9%95%BF%E4%BB%BB%E5%8A%A1%E5%8A%A0%E8%BD%BD%E5%8A%A8%E7%94%BB%E6%96%B9%E6%A1%88.md)

## 开发检查

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

仓库内已经包含 CI 校验流程和 GitHub Pages demo 发布流程。

## 预览资源

![首页截图](./assets/screenshots/home.png)
![Playground 截图](./assets/screenshots/playground.png)
![Agent 示例截图](./assets/screenshots/example-agent.png)

![Demo 动图](./assets/demo.gif)
