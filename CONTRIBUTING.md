# Contributing

`agent-progress-ui` is built for teams shipping long-running AI experiences. Contributions should improve clarity, trust, and implementation readiness.

## Local setup

```bash
npm install
npm run dev
```

Core validation:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Contribution principles

- Prefer evidence-heavy UI patterns over decorative loading treatments.
- Keep the state machine stable. New states should be rare and defensible.
- Add or update scenarios when a new UX pattern materially changes behavior.
- Keep public APIs small and composable. If a feature only helps one demo page, keep it local to the app.
- Provide visual proof for UI changes whenever the modification affects the workbench or landing page.

## Pull requests

- Explain the task shape affected: chat, research, agent, or cross-cutting.
- List which states or events changed.
- Mention any screenshot or docs updates that accompany the change.
- Run the full validation suite before asking for review.
