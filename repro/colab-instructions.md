# Reproducibility Notes

This public export contains configuration snapshots and final tables, but not the original private run archives.

## Intended Reproduction Flow

1. Prepare a Python environment compatible with the original runner.
2. Configure an LLM endpoint for `llama3.1:8b` or a compatible local/open endpoint.
3. Use the config snapshots in `repro/configs/`.
4. Run matched seeds for both arms:
   - `full-step7m-rt23`
   - `full-village-scaffold-step7m-rt23`
5. Compute metrics from original run outputs only.
6. Treat display sanitization as a presentation-quality layer, not as a performance layer.

## Public Export Limit

This package is GitHub-facing. It is meant to document the method, demo, and final results. It does not bundle private logs, raw archives, or internal agent session history.

## Minimum Checks

- Same seed range across compared arms.
- Same player/role configuration.
- Raw performance metrics separated from display-quality metrics.
- No claim beyond exploratory trends unless larger follow-up runs reproduce the effect.
