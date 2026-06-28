# AI NPC Social Reasoning Harness: Exploratory Werewolf Evaluation

## Abstract

This project presents a repeatable evaluation harness for LLM-driven NPCs in a 7-player Werewolf environment. The goal is not to claim human-level social reasoning, but to separate surface dialogue quality from measurable game behavior such as village win rate, role inference, and vote consistency. In STEP7-M RT2.3, the village-scaffold arm showed exploratory positive deltas under output-quality control, while remaining below the pre-defined strong-claim gate.

## Research Question

Can an interdisciplinary scaffold based on utterance analysis, public-opinion tracking, beneficiary analysis, and interrogation strategy change observable social-reasoning behavior in LLM NPCs?

## Method

The experiment uses a fixed 7-player Werewolf setup with two wolves, two villagers, a prophet, a guard, and a witch. Runs are controlled by seed and arm configuration. Metrics are computed from original game outputs. Display sanitization is treated separately as an output-quality layer.

## Conditions

| condition | description |
|---|---|
| full-step7m-rt23 | baseline full cognitive architecture |
| full-village-scaffold-step7m-rt23 | village-side scaffold with utterance, crowd, beneficiary, and interrogation cues |

## Results

| metric | baseline | scaffold | delta |
|---|---:|---:|---:|
| village win rate | 0.200 | 0.300 | +0.100 |
| role inference | 0.317 | 0.383 | +0.066 |
| vote consistency | 0.334 | 0.353 | +0.019 |
| raw quality pass | 20/20 | 20/20 | +0 |
| replacements | 0 | 0 | +0 |

The observed deltas are small. The result should be read as an exploratory signal, not as a statistically established improvement.

## Contribution

1. A seed-controlled Werewolf harness for LLM NPC social-reasoning evaluation.
2. A separation between raw performance metrics and display-quality sanitization.
3. A four-axis scaffold that connects interdisciplinary reasoning concepts to observable game logs.
4. A browser replay demo that preserves the claim boundary between representative case and aggregate result.

## Limitations

- N=20 per arm is exploratory.
- Only one model family/size is represented in the final result.
- Rule-based metrics do not capture all forms of social reasoning.
- A representative replay cannot prove the aggregate effect.
- Follow-up runs should include larger N, additional models, and independent qualitative labeling.

## Claim Boundary

This work supports the claim that a controlled harness can expose measurable changes in LLM NPC behavior. It does not prove general superiority, statistical significance, or human-level social reasoning.
