# Cognitive-bias check

Every analysis runs a bias check on the user's write-up alongside framework
selection. The findings are attached to the result as `biasFindings`, fed into the
framework generator so the recommendation takes them into account, and shown
on the result page in the "Where your thinking may tilt" panel. The full
catalog is browsable at `/biases`.

## How it flows

```
decisionText ──┬── stage 1: pick framework ─────────┐
               └── bias detection (parallel) ───────┤
                                                    ▼
                        stage 2: generate framework data
                        (prompt includes the bias findings)
                                                    ▼
                  { ...frameworkData, altFrameworks, biasFindings }
```

- `src/lib/insights/detect-biases.ts` — `runDetectBiases()` asks the model for
  0–4 findings using only catalog ids, then `normalizeBiasFindings()` drops
  unknown ids, dedupes, clamps severity, joins `name`/`family` from the
  catalog and sorts strongest-first. Detection never throws; a failure means
  an empty list and the analysis proceeds.
- `src/lib/insights/analyze.ts` — starts detection before framework selection,
  awaits it before generation, and inlines `describeBiasFindings()` into the
  stage-2 prompt.
- `src/components/BiasPanel.tsx` — the result-page panel. Users can strike out
  a finding (`dismissed: true`), which changes the result and enables
  "Re-recommend"; `/api/recommend` is told to ignore dismissed entries.
  Each finding offers a one-click re-run with an antidote framework.
- `keepAdvisory()` in `src/components/analyze-utils.ts` re-attaches
  `recommendation`, `altFrameworks` and `biasFindings` after any edit path
  (framework view, modify, chat-fill), since framework schemas strip them.

## Finding shape

```json
{
  "id": "sunk_cost_fallacy",
  "name": "Sunk cost fallacy",
  "family": "stability",
  "severity": 4,
  "evidence": "I've already put two years into this",
  "effect": "The years already spent are doing the arguing for staying.",
  "counter": "Cross out the two years and list only what continuing costs and returns from today.",
  "dismissed": false
}
```

`severity` is 1–5. `dismissed` is set client-side only.

## Catalog

51 biases in six families, following Lovallo & Sibony's taxonomy of
strategic-decision biases (McKinsey Quarterly 2010; Kahneman, Lovallo & Sibony,
HBR 2011) plus a sixth family for framing and estimation effects:

| Family | What it covers |
|---|---|
| `action` | Overestimating what doing something will achieve |
| `interest` | Incentives and attachments that steer the call |
| `pattern` | Seeing shapes in the evidence that aren't there |
| `stability` | Clinging to where you already are |
| `social` | The pull of the group and of authority |
| `framing` | How the question is posed and how numbers are felt |

## Adding a bias

1. Create `src/biases/catalog/<id>.ts` (kebab-case file name, snake_case id):

   ```ts
   import { defineBias } from "../types";

   export const bias = defineBias({
     id: "my_bias",
     name: "My bias",
     family: "pattern",
     blurb: "One sentence.",
     description: "Two or three plain-English sentences.",
     cues: ["Observable signal in a write-up", "Another one"],
     question: "A self-check question?",
     counters: ["Concrete move", "Another concrete move"],
     antidotes: ["ach", "inversion"],   // framework ids from src/frameworks
     aka: ["Other name"],                // optional
     source: "Author 1999",              // optional
   });
   ```

2. Import it in `src/biases/index.ts` and add it to `ALL`.

That's it. The detection prompt, the `/biases` page, the API help object
(`biasIds`) and the `BiasId` type all derive from the registry.
`tests/unit/biases.test.ts` fails if a catalog file is not registered, if an
id is malformed, if a field is missing, or if an antidote names a framework
that doesn't exist.
