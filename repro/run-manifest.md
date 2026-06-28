# Run Manifest

## Canonical Experiment

| item | value |
|---|---|
| experiment | STEP7-M RT2.3 |
| model | llama3.1:8b |
| players | 7 |
| roles | wolf 2, villager 2, prophet 1, guard 1, witch 1 |
| baseline arm | full-step7m-rt23 |
| scaffold arm | full-village-scaffold-step7m-rt23 |
| N | 20 per arm |
| representative seed | 58 |

## Public Result Summary

| metric | baseline | scaffold | delta |
|---|---:|---:|---:|
| village win rate | 0.200 | 0.300 | +0.100 |
| role inference | 0.317 | 0.383 | +0.066 |
| vote consistency | 0.334 | 0.353 | +0.019 |
| raw quality pass | 20/20 | 20/20 | +0 |
| replacements | 0 | 0 | +0 |

## Source Boundary

Original raw and display JSON archives are not included in this public export.

The browser demo uses a redacted replay payload. Hashes below identify the source artifacts used during local verification.

| source | sha256 |
|---|---|
| scaffold original run | `76bf3a931c1d9d58434f8a795b9abfb98e1b95f45e1d04aa73c28b01e5ad01e4` |
| scaffold display copy | `769786621039e9ae4bad4e1a41345771c0e0fefcd64de8ef42ebeea9dcd8d596` |
| baseline original run | `ee09ee9454e6cc9d5d29b15888e65599a9040b4e478ec5b05085d41e7d3d51ce` |
| baseline display copy | `7d317bbd8a504cc0e9316f276cfc02e80f74da803e0b4ebac62295e1d2072556` |

## Claim Gate

- Allowed: quality-controlled exploratory positive trends.
- Forbidden: statistical significance, general performance superiority, or proof from a single representative replay.
- Sanitized display data must not be used to recalculate performance metrics.
