# GitHub Release Checklist

## Current State

- Local export repository is initialized.
- Public-safe files are committed on `main`.
- No remote is configured yet.

## Before Remote Creation

Decide:

1. Repository name.
2. Visibility: public or private.
3. License strategy.

Recommended temporary visibility: private.

Recommended repository name:

```text
ai-npc-social-reasoning-harness
```

## Suggested Remote Commands

Create private repository:

```bash
gh repo create ai-npc-social-reasoning-harness --private --source=. --remote=origin --push
```

Create public repository:

```bash
gh repo create ai-npc-social-reasoning-harness --public --source=. --remote=origin --push
```

## Post-Push Checks

- README renders correctly.
- `demo/` works through local clone or GitHub Pages configuration.
- Raw run archives are absent.
- `LICENSE_PENDING.md` is resolved before broad public sharing.
- The result claim remains exploratory.
