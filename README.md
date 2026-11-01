# decidebench

Describe a decision in plain words, and decidebench picks the thinking framework that fits it, then walks you through it interactively.

**Live:** [decidebench.com](https://www.decidebench.com)

## What it does

- **Picks the framework for you.** An AI step reads your decision and recommends a framework (first principles, weighted matrix, pre-mortem, and the rest), with alternatives you can switch to. If the decision is too vague, it asks follow-up questions first.
- **About 90 interactive frameworks**, each a real component, not a text template. Browse and search them in the library, or pick one by hand.
- **Fills the framework through conversation.** Refine the data by chatting instead of filling forms.
- **Checks for cognitive biases.** A pluggable catalog of about 50 biases flags the ones your reasoning may be falling into.
- **Simple and advanced modes**, mobile-first layout, and PWA support with an offline page.
- **A stateless HTTP API** with the same model and frameworks: `POST /api/v1/insights`. See [docs/api.md](docs/api.md).

## Stack

Next.js (App Router), React, TypeScript, Zod, and the Vercel AI SDK with Anthropic models. Deployed on Vercel.

## Running locally

```bash
npm install
ANTHROPIC_API_KEY=... npm run dev
```

```bash
npm run typecheck
npm run lint
npm test            # unit tests
npm run test:e2e    # Playwright
```

## Layout

```
src/
  app/          routes: decide, frameworks library, biases, API
  frameworks/   one folder per framework, one file per concern
  biases/       bias catalog, schema, and summary
  components/   shared UI primitives
docs/
  api.md        Insights API
  biases.md     bias check design
```

The insights API has no auth and every call costs an LLM request, so put it behind a rate limiter before exposing your own deployment.
