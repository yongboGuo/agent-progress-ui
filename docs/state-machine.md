# State Machine

The package uses a fixed state machine so product, design, and engineering can align on one vocabulary.

## States

- `queued`
- `understanding`
- `planning`
- `executing`
- `synthesizing`
- `waiting_external`
- `waiting_user`
- `retrying`
- `backgrounded`
- `ready_for_review`
- `completed`
- `failed`
- `cancelled`

## Guidance

- `planning` should expose scope or task intent before deep work begins.
- `executing` is where live sources, tools, and steps should be visible.
- `waiting_external` must not look like active execution.
- `ready_for_review` should appear before a final “completed” claim whenever the task produces a meaningful draft or artifact.
- `backgrounded` should collapse the surface but keep recovery entry points visible elsewhere in the product.
