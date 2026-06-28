# AI NPC Social Reasoning Harness

7-player Werewolf environment for evaluating LLM NPC social-reasoning behavior under repeated, seed-controlled runs.

This repository is a public-facing export of the final demo/report package. It does not include internal progress logs, private session notes, or original run archives.

## What This Shows

- A browser demo that replays a selected STEP7-M RT2.3 seed 58 example.
- A presentation deck summarizing the evaluation harness and claim boundary.
- A final report with raw performance metrics separated from display-quality handling.
- Reproducibility notes and public-safe config snapshots.

## Run Locally

```bash
python3 -m http.server 5217
```

Open:

```text
http://127.0.0.1:5217/demo/
```

Presentation:

```text
http://127.0.0.1:5217/presentation/
```

## Result Boundary

RT2.3 N=20 is reported as exploratory positive trends under strict output-quality control, not as a statistically proven or generally established result.

In Korean:

> 이 프로젝트는 7인 늑대인간 환경에서 LLM NPC의 사회추론 행동을 반복 평가하기 위한 하네스와 데모를 제시한다. RT2.3 N=20 결과는 품질 통제 상태에서 관찰된 탐색적 양의 경향으로만 해석하며, 통계 검정 완료나 일반화 결론으로 쓰지 않는다.

## Key Numbers

| arm | N | village win rate | role inference | vote consistency | raw quality pass | replacements |
|---|---:|---:|---:|---:|---:|---:|
| baseline | 20 | 0.200 | 0.317 | 0.334 | 20/20 | 0 |
| village scaffold | 20 | 0.300 | 0.383 | 0.353 | 20/20 | 0 |
| delta | - | +0.100 | +0.066 | +0.019 | +0 | +0 |

These deltas are small. The representative replay is explanatory, not standalone proof.

## Repository Layout

```text
demo/                  Browser replay demo and report
presentation/          HTML slide deck
docs/final-report.md   Final report
docs/results-tables.md Public result tables
docs/paper-draft.md    Paper-style draft
repro/configs/         Public-safe config snapshots
repro/run-manifest.md  Run and source boundary manifest
```

## Data Boundary

- Original run JSON archives are not bundled.
- The demo includes a redacted replay payload and source hashes only.
- Sanitized display data is used for presentation hygiene and does not recalculate raw performance metrics.

## License

No public license has been selected yet. See `LICENSE_PENDING.md`.
