# Insights API (v1)

Unified, stateless HTTP API for the decision-making analyzer. Same model and
frameworks as the web UI, exposed for programmatic use.

- **Endpoint:** `POST /api/v1/insights`
- **Discovery:** `GET /api/v1/insights` returns a help object (action list, body shapes, framework ids).
- **Auth:** none. The route is open; put it behind a firewall / rate limiter before exposing it publicly — you pay every LLM call.
- **State:** none. The client holds `currentData` between turns.

## Envelope

Success:
```json
{ "ok": true, "data": { ... }, "meta": { "action": "analyze", "framework": "first_principles" } }
```

Error:
```json
{ "ok": false, "error": { "code": "MISSING_ACTION", "message": "...", "help": { ... } } }
```

`help` is included on input errors so the endpoint is self-documenting — hit it
wrong and you get back the spec.

## Actions

All actions share `POST /api/v1/insights` and dispatch on the `action` field.

### `clarify` (optional)

Ask the model whether the decision is specific enough to analyze, or whether a
few follow-up questions would meaningfully sharpen it.

```bash
curl -s http://localhost:3000/api/v1/insights \
  -H 'content-type: application/json' \
  -d '{
    "action": "clarify",
    "decisionText": "Should I take the offer?"
  }'
```

Response:
```json
{ "ok": true, "data": { "skip": false, "questions": [
  { "id": "offer_type", "text": "What kind of offer?", "type": "choice", "options": ["Job","Acquisition","Partnership","Investment"], "multiSelect": false }
] }, "meta": { "action": "clarify" } }
```

If the decision is already concrete: `{ "data": { "skip": true } }`.

### `analyze`

Main inference. Picks the best-fit framework (or uses one you specify), then
generates the structured analysis.

```bash
curl -s http://localhost:3000/api/v1/insights \
  -H 'content-type: application/json' \
  -d '{
    "action": "analyze",
    "decisionText": "Should I leave my $120k job for a 3-person startup paying $90k?"
  }'
```

Optional: `frameworkId` to skip framework selection and force a specific one
(see `frameworkIds` in the help object for valid values).

Response `data` contains the framework analysis (shape depends on the chosen
framework) plus:

- `altFrameworks` — other applicable frameworks the client can offer for re-analysis.
- `biasFindings` — 0–4 cognitive biases the model found evidence for in the
  write-up, strongest first. Each is
  `{ id, name, family, severity (1–5), evidence, effect, counter }`. The
  recommendation already takes them into account. Valid ids are listed under
  `biasIds` in the help object; the catalog is documented in
  [biases.md](./biases.md).

When feeding `data` back as `currentData` to `modify`, you may set
`dismissed: true` on a bias the user rejected; the field is preserved by the
client and ignored by the model.

### `modify` — the back-and-forth

Apply a targeted, natural-language adjustment to a prior analysis. Repeatable.

```bash
curl -s http://localhost:3000/api/v1/insights \
  -H 'content-type: application/json' \
  -d '{
    "action": "modify",
    "decisionText": "Should I leave my $120k job for a 3-person startup paying $90k?",
    "currentData": { "framework": "decision_matrix", "...": "(full data from previous analyze response)" },
    "instruction": "Weight financial stability more heavily and re-score."
  }'
```

Response: `{ "data": { "updatedData": { ... } } }` — the full framework JSON
with the adjustment applied. Feed it back in as `currentData` on the next
`modify` call to keep iterating.

## End-to-end flow

```
1. POST {action:"clarify", decisionText}            (optional)
2. POST {action:"analyze", decisionText}            -> insights
3. POST {action:"modify",  decisionText, currentData, instruction}
   (repeat step 3 to refine — the client holds currentData between turns)
```

## Error codes

| Code | When |
|---|---|
| `INVALID_JSON` | Body wasn't JSON. |
| `INVALID_INPUT` | A required field was missing or the wrong type. |
| `MISSING_ACTION` | No `action` field. |
| `UNKNOWN_ACTION` | `action` was not `clarify`, `analyze`, or `modify`. |
| `NO_API_KEY` | Server is missing `ANTHROPIC_API_KEY` / `AI_GATEWAY_API_KEY`. |
| `SELECTOR_FAILED` | Stage-1 framework selection failed. |
| `UNKNOWN_FRAMEWORK` | Selector returned an id we don't ship, or `currentData.framework` is unknown. |
| `SCHEMA_FAIL` | Model output didn't match the framework schema after retries. |
| `TRUNCATED` | Model hit max output tokens. |
| `RATE_LIMIT` | Upstream 429. |
| `AUTH` | Upstream rejected the API key. |
| `UPSTREAM` | Network failure talking to the model. |
| `UNKNOWN` | Anything else. |
