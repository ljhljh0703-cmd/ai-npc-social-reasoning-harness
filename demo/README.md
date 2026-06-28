# Demo

Static Phaser 3 replay demo for the AI NPC social-reasoning harness.

## Run

From the repository root:

```bash
python3 -m http.server 5217
```

Open:

```text
http://127.0.0.1:5217/demo/
```

## Modes

- `Fixture`: scripted branch table for testing controls and presentation flow.
- `기록`: selected STEP7-M RT2.3 seed 58 display replay.
- `순정 AI` / `스캐폴드`: comparison modes for presentation.
- `발표자` / `관람`: role visibility boundary for demo explanation.

## Claim Boundary

The replay is explanatory. Performance interpretation uses the RT2.3 N=20 result table, not a single replay.

Sanitized display data is for presentation hygiene only. It does not recalculate raw performance metrics.

## Public Export Boundary

Original run JSON files are not included in this public demo package. The browser payload keeps replay fields and source hashes only.
