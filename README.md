# PeopleLens — PeopleOps Directory

[![Quality](https://github.com/MykolaDotsenko/BearIT-employees-list/actions/workflows/quality.yml/badge.svg)](https://github.com/MykolaDotsenko/BearIT-employees-list/actions/workflows/quality.yml)

A compact React case study for discovering people by **role, skill, team, location, availability, and near-term capacity**.

**Live demo:** https://mykoladotsenko.github.io/BearIT-employees-list/

> The repository began as a React training exercise. The current implementation keeps the small scope but rebuilds it as a focused product with explicit state ownership, pure selectors, resilient local persistence, accessibility, and automated quality gates.

## Product capabilities

- full-directory search across names, roles, skills, teams, locations, and work modes
- team and availability filters
- deterministic sorting by name, capacity, team, or shortlist state
- browser-persisted shortlist
- live result count and clear empty-state recovery
- high-signal overview metrics
- responsive card layout for desktop and mobile
- reduced-motion and forced-colors support
- zero network dependency at runtime

All employee names, roles, capacity figures, and staffing statuses are **fictional demo data**. This project does not represent BearIT personnel or internal company data.

## Stack

- React 18
- Vite 5
- styled-components 6 for the small branded shell
- modern CSS for the product surface
- Web Storage API
- Node.js built-in test runner
- ESLint
- GitHub Actions
- GitHub Pages

The application deliberately avoids a state library, router, component framework, API client, and backend because none are required for this product scope.

## Architecture

~~~text
React UI
  ├─> pure people selectors
  └─> local-storage adapter

seed data ─> selectors ─> derived view ─> accessible components
~~~

The domain module is browser-agnostic. Search, filtering, sorting, stats, labels, and initials are pure functions and can be tested without React or the DOM.

Persistence is isolated behind a defensive adapter. Only shortlist ids are durable; temporary discovery state remains ephemeral.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the design rationale.

## Quality strategy

Run the full local gate:

~~~bash
npm ci
npm run check
~~~

That verifies:

1. ESLint with zero warnings
2. pure selector and persistence-boundary tests
3. production Vite build

GitHub Actions runs the same gate on pushes and pull requests.

Unit coverage targets the behavior with the highest regression risk:

- cross-field search
- composable filters
- non-mutating sort
- shortlist-priority ordering
- deterministic metrics
- presentation helpers
- corrupted or stale persisted ids

## Accessibility

The UI includes:

- skip navigation
- semantic headings and landmarks
- fully labeled native search/select controls
- native meter elements for capacity
- explicit pressed state for shortlist actions
- action labels containing each person's name
- live result-count announcements
- strong keyboard focus
- reduced-motion support
- forced-colors fallbacks

## Product decisions

### Why fictional local data?

The purpose is to demonstrate product interaction and frontend architecture, not to simulate an HR backend. A remote API would add deployment and failure surface without improving the core portfolio signal.

### Why persist only the shortlist?

A shortlist represents deliberate user intent. Search terms and filters are temporary navigation state, so restoring them on every visit would make the product less predictable.

### Why no global state library?

One screen owns a small amount of interaction state. React state plus pure derived selectors keeps ownership obvious and avoids ceremony.

## Run locally

~~~bash
npm ci
npm run dev
~~~

## Recruiter walkthrough

For a quick engineering review:

1. [src/App.jsx](./src/App.jsx) — state ownership and composition
2. [src/domain/people.js](./src/domain/people.js) — pure discovery rules
3. [src/storage/pinnedStorage.js](./src/storage/pinnedStorage.js) — resilient persistence boundary
4. [src/components/EmployeeCard.jsx](./src/components/EmployeeCard.jsx) — accessible product UI
5. [tests/people.test.js](./tests/people.test.js) — regression coverage
6. [.github/workflows/quality.yml](./.github/workflows/quality.yml) — automated verification

## Repository evolution

The original tutorial tabs, timer side effect, remote JSONPlaceholder demo, feedback exercise, and stale deployment metadata were intentionally removed. They demonstrated React syntax but obscured the product story.

The rebuilt repository now has one clear job, one authoritative data flow, and a much smaller cognitive surface.
