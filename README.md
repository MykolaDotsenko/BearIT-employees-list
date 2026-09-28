# PeopleLens — PeopleOps Directory

[![Quality](https://github.com/MykolaDotsenko/people-lens/actions/workflows/quality.yml/badge.svg)](https://github.com/MykolaDotsenko/people-lens/actions/workflows/quality.yml)

**Find teammates by role, skills, team, location, availability and near-term capacity.**

[**Open the live demo →**](https://mykoladotsenko.github.io/people-lens/)

![PeopleLens directory showing search, team filters, availability, capacity signals, and a saved shortlist](./docs/screenshots/people-lens-home.png)

The bundled profiles are fictional demo data. Additions, edits, removals and shortlist choices stay in the current browser; there is no HR backend or shared personnel database behind the demo.

## What you can do

- search across names, roles, skills, teams, locations and work modes;
- filter by team and availability;
- sort by name, capacity, team or shortlist status;
- save a shortlist;
- add, edit or remove people;
- keep local workspace changes across reloads;
- see live result counts and summary metrics;
- use the same workflows on desktop and mobile.

The header has one primary **Add person** action. Existing profiles keep edit/remove actions in a compact per-person menu.

## Data flow

PeopleLens keeps one effective directory built from:

```text
fictional seed profiles
        +
local additions / edits / removals
        ↓
effective people collection
        ↓
search + filters + sort
        ↓
derived stats and visible cards
```

Search results, filters and metrics are derived rather than stored as parallel copies.

Shortlist and profile changes are durable. Search terms and filters are intentionally temporary.

## Architecture

```text
React UI
  ├── people selectors
  ├── shortlist storage
  └── local profile storage

selectors → derived view → accessible components
```

Search, filtering, sorting, stats and presentation helpers live in browser-independent functions that can be tested without rendering React.

Persistence is kept behind defensive storage adapters so malformed saved data does not become UI state unchecked.

## Stack

- React 19
- Vite 8
- JavaScript
- modern CSS
- Web Storage
- Node built-in test runner
- Playwright
- axe-core
- ESLint
- GitHub Actions / GitHub Pages

There is no router, global state library, component framework, API client or backend because this single-screen product does not need them.

## Accessibility

The UI uses native search/select/meter controls where they fit, plus:

- skip navigation;
- visible keyboard focus;
- profile-specific action labels;
- live result-count announcements;
- explicit shortlist pressed state;
- reduced-motion handling;
- forced-colors fallbacks.

## Quality

```bash
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
```

The repository tests the parts most likely to regress:

- cross-field search;
- composable filters;
- non-mutating sort;
- shortlist ordering;
- derived metrics;
- persisted-profile normalization;
- corrupted/stale stored IDs;
- add/edit/remove browser flows;
- accessibility.

## Run locally

```bash
npm ci
npm run dev
```

## Quick code review

- [`src/App.jsx`](./src/App.jsx) — state ownership/composition
- [`src/domain/people.js`](./src/domain/people.js) — discovery rules
- [`src/storage/peopleStorage.js`](./src/storage/peopleStorage.js) — profile persistence
- [`src/storage/pinnedStorage.js`](./src/storage/pinnedStorage.js) — shortlist persistence
- [`src/components/PersonDialog.jsx`](./src/components/PersonDialog.jsx) — add/edit flow
- [`e2e/`](./e2e/) — browser/accessibility coverage

More design and architecture notes: [ARCHITECTURE.md](./ARCHITECTURE.md) · [DESIGN.md](./DESIGN.md)
