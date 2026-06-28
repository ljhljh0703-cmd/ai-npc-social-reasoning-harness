# Evaluating Social Reasoning in LLM NPCs through a Controlled Werewolf Game Harness

**An Exploratory Study of Interdisciplinary Scaffolding under Output-Quality Control**

Korean title: **통제된 늑대인간 게임 하네스를 통한 LLM NPC 사회추론 평가**  
Korean subtitle: **출력 품질 통제 하에서의 학제적 스캐폴딩 탐색 연구**

This repository is the public paper/demo export for a 7-player Werewolf evaluation harness. It treats the game as a controlled incomplete-information social-reasoning task for LLM-driven NPCs, not as a free-form chat demo.

Project page: <https://ljhljh0703-cmd.github.io/ai-npc-social-reasoning-harness/>

## Abstract

Large language model NPCs can produce plausible dialogue, but plausible dialogue alone does not show whether an agent tracks hidden roles, deception, public pressure, and vote consequences. This project presents a seed-controlled Werewolf harness for evaluating observable social-reasoning behavior in LLM NPCs. The harness separates raw game-performance metrics from display-level output hygiene, then compares a baseline condition with a village-side interdisciplinary scaffold.

In the final STEP7-M RT2.3 N=20 result, the scaffold arm preserved raw output-quality pass 20/20 and replacements 0 while showing positive but small deltas in village win rate, role inference, vote consistency, and game duration. These results are reported as exploratory trends under output-quality control, not as statistically established improvement or general social-reasoning superiority.

## Public Artifacts

| artifact | link | role |
|---|---|---|
| Paper draft | [docs/paper-draft.md](docs/paper-draft.md) | Main research narrative and claim boundary |
| Final report | [docs/final-report.md](docs/final-report.md) | Korean submission-oriented report |
| Result tables | [docs/results-tables.md](docs/results-tables.md) | Public metrics and interpretation notes |
| Browser demo | [demo/](demo/) | Representative replay and HTML report |
| Presentation deck | [presentation/](presentation/) | HTML presentation for final delivery |
| Reproducibility manifest | [repro/run-manifest.md](repro/run-manifest.md) | Public-safe run/config boundary |

## Research Question

Can an interdisciplinary scaffold based on utterance analysis, public-opinion tracking, beneficiary analysis, and interrogation strategy change observable social-reasoning behavior in LLM NPCs under a fixed Werewolf game harness?

## Method Summary

The environment is a 7-player Werewolf game with two wolves, two villagers, one prophet, one guard, and one witch. Each run records role assignment, night actions, day discussion, votes, executions, deaths, and the final winner.

The final comparison uses the STEP7-M RT2.3 N=20 condition:

| condition | description |
|---|---|
| `full-step7m-rt23` | Baseline full architecture without the final village scaffold |
| `full-village-scaffold-step7m-rt23` | Village-side scaffold using four social-reasoning axes |

The scaffold does not reveal hidden truth to the agents. It structures public reasoning around:

| axis | Korean label | purpose |
|---|---|---|
| utterance analysis | 발화 분석 | Detect contradiction, evasion, overconfidence, and narrative inconsistency |
| public-opinion analysis | 여론 분석 | Track accusation flow, bandwagon pressure, and scapegoating |
| beneficiary analysis | 수혜자 분석 | Ask who benefits from a vote, silence, or accusation shift |
| interrogation strategy | 심문 전략 | Choose follow-up questions and defer premature accusation |

## Final Result Boundary

| arm | N | village win rate | role inference | vote consistency | raw quality pass | replacements |
|---|---:|---:|---:|---:|---:|---:|
| baseline | 20 | 0.200 | 0.317 | 0.334 | 20/20 | 0 |
| village scaffold | 20 | 0.300 | 0.383 | 0.353 | 20/20 | 0 |
| delta | - | +0.100 | +0.066 | +0.019 | +0 | +0 |

The deltas are positive but small. The role-inference delta does not reach the pre-defined +0.10 strong-claim gate. The correct interpretation is:

> Under output-quality control, the village scaffold showed exploratory positive trends in observable Werewolf behavior. The result does not prove statistical significance, general superiority, or human-level social reasoning.

## Data and Sanitization Boundary

- Raw performance metrics are calculated from original run outputs.
- Display sanitization is a presentation-quality layer and does not recalculate raw performance metrics.
- Original run JSON archives, internal progress logs, private session notes, and full session logs are not bundled in this public export.
- The demo includes a redacted representative replay payload for explanation, not as standalone proof.

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

## Repository Layout

```text
demo/                  Browser replay demo and report
presentation/          HTML slide deck
docs/final-report.md   Final Korean report
docs/results-tables.md Public result tables
docs/paper-draft.md    Paper-style draft
repro/configs/         Public-safe config snapshots
repro/run-manifest.md  Run and source boundary manifest
```

## License

This public export uses a split license:

- Code is released under the MIT License. See [LICENSE-CODE-MIT.md](LICENSE-CODE-MIT.md).
- Reports, presentation text, documentation, and visual/demo assets are released under Creative Commons Attribution-NonCommercial 4.0 International. See [LICENSE-DOCS-ASSETS-CC-BY-NC-4.0.md](LICENSE-DOCS-ASSETS-CC-BY-NC-4.0.md).

See [LICENSE](LICENSE) for the repository-level summary.

## Citation

```text
Lee, J. (2026). Evaluating Social Reasoning in LLM NPCs through a Controlled Werewolf Game Harness: An Exploratory Study of Interdisciplinary Scaffolding under Output-Quality Control.
```
