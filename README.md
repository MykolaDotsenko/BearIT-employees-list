# PeopleLens — Internal Staffing Directory

**Find the teammate who can actually take the work.**

[**Open the live demo →**](https://mykoladotsenko.github.io/people-lens/) ·
[Architecture](./ARCHITECTURE.md) ·
[Design notes](./DESIGN.md)

[![Quality](https://github.com/MykolaDotsenko/people-lens/actions/workflows/quality.yml/badge.svg)](https://github.com/MykolaDotsenko/people-lens/actions/workflows/quality.yml)

![PeopleLens directory showing search, filters, capacity signals and a shortlist](./docs/screenshots/people-lens-home.png)

A staffing question often starts in a much messier way than it should:

> “We need someone with React and accessibility experience for the next sprint. Who is available, and who actually has room to take it?”

Without a focused view, the answer may be scattered across Slack, spreadsheets, team knowledge and calendar context.

PeopleLens turns that question into one short workflow:

```text
work to staff
   ↓
search expertise
   ↓
check availability
   ↓
compare near-term capacity
   ↓
shortlist candidates
   ↓
make the staffing decision
```

The bundled profiles are fictional demo data. Profile changes and shortlist choices stay in the current browser; there is no shared HR database behind the demo.

## A realistic staffing example

Suppose a product team needs help improving accessibility in a React interface.

Search for:

```text
accessibility
```

The current demo returns **Ava Lind**:

- Senior Frontend Engineer
- Engineering
- Turku
- Hybrid
- Available
- 72% near-term capacity
- React · TypeScript · Accessibility

That does not make the staffing decision automatically.

It does make the decision easier to discuss because the relevant context is visible in one place:

> “Ava has the skill match, is currently available, and appears to have meaningful near-term capacity. Add her to the shortlist and compare against the other options.”

That is the job PeopleLens is built around.

## Discovery before administration

PeopleLens is not trying to be a full HR platform.

The main screen is optimized for one practical question:

> **Who could help with this work?**

You can:

- search across names, roles, skills, teams, locations and work modes;
- filter by team and availability;
- sort by name, capacity, team or shortlist status;
- compare near-term capacity;
- save a shortlist for the current staffing discussion;
- add, edit or remove local profiles;
- keep local workspace changes across reloads.

The interface keeps one persistent **Add person** action. Editing and removal stay behind each profile's action menu so discovery remains the primary workflow.

## Capacity is context, not a promise

A number such as `72%` is useful only if its meaning stays modest.

In PeopleLens it represents a **near-term capacity signal** supplied by the directory data. It is not a prediction, utilization score, performance metric or automated staffing recommendation.

The app keeps these concepts separate:

```text
skill match ≠ availability ≠ capacity ≠ final staffing decision
```

PeopleLens surfaces those signals together. A person still makes the decision.

## Shortlist keeps the conversation focused

Finding one plausible person is rarely the whole job.

A lead may want to compare:

- a stronger skill match with less capacity;
- someone available now but in another location;
- a teammate with related skills who can start sooner;
- two or three reasonable options before discussing the work with them.

Shortlisting keeps those candidates visible without turning the directory into a ranking engine.

Pinned profiles can also be sorted to the top, and the shortlist survives reloads in the same browser.

## Local profile changes behave like a small workspace

The demo ships with fictional seed profiles, but the directory itself is editable.

A local profile can be:

- added;
- edited;
- removed;
- searched immediately;
- included in filters and derived metrics;
- shortlisted;
- restored after reload.

The effective directory is composed from the bundled data plus local workspace changes:

```text
fictional seed profiles
        +
local additions and edits
        −
local removals
        ↓
effective directory
        ↓
search / filters / sort
        ↓
visible people + derived stats
```

Seed data stays immutable in source. Local overrides, additions and removed IDs are persisted separately and merged deterministically.

## Search and metrics come from one directory

PeopleLens does not keep separate copies of filtered people, counts and shortlist views.

Search, filters, sorting and summary metrics are derived from the current effective collection.

That means an edited or newly added person immediately participates in:

- result counts;
- team filters;
- availability filters;
- capacity sorting;
- summary metrics;
- shortlist ordering.

This keeps the UI consistent without adding a global state library for a small single-screen product.

## What happens when local storage is messy

Browser storage is treated as a boundary rather than trusted input.

The persistence layer validates stored profiles and shortlist IDs before they become application state.

For profile data it:

- validates required fields;
- constrains work-mode and availability values;
- clamps capacity to 0–100;
- trims and deduplicates skills;
- ignores malformed records;
- merges seed data, overrides, additions and removals predictably.

Search terms and filters stay temporary so a reload returns to a clean discovery view.

## Interaction details that matter

The product includes:

- one primary add-person CTA;
- accessible add/edit modal;
- explicit removal confirmation;
- keyboard-operable profile action menus;
- Escape-to-close;
- dialog focus trapping;
- native `meter` for capacity;
- explicit shortlist pressed state;
- live result-count announcements;
- visible keyboard focus;
- reduced-motion handling;
- forced-colors fallbacks;
- responsive desktop/mobile layouts.

The pointer-aware card tilt is decorative. It collapses for reduced-motion users and is not required to operate the directory.

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
- GitHub Actions
- GitHub Pages

## Verification

```bash
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
```

Tests cover:

- cross-field search;
- composable filters;
- non-mutating sorting;
- shortlist persistence and ordering;
- derived directory metrics;
- profile normalization;
- malformed/stale stored data;
- add/edit/remove browser flows;
- accessibility;
- viewport overflow.

## Run locally

```bash
git clone https://github.com/MykolaDotsenko/people-lens.git
cd people-lens
npm ci
npm run dev
```

## Code map

- [`src/App.jsx`](./src/App.jsx) — workflow state and effective directory composition
- [`src/domain/people.js`](./src/domain/people.js) — search, filters, sorting and derived stats
- [`src/storage/peopleStorage.js`](./src/storage/peopleStorage.js) — local profile persistence
- [`src/storage/pinnedStorage.js`](./src/storage/pinnedStorage.js) — shortlist persistence
- [`src/components/PersonDialog.jsx`](./src/components/PersonDialog.jsx) — add/edit workflow
- [`src/components/EmployeeCard.jsx`](./src/components/EmployeeCard.jsx) — profile, capacity and actions
- [`e2e/`](./e2e/) — browser and accessibility coverage

PeopleLens stays small: it helps a team find and compare internal expertise without pretending to replace the systems where staffing decisions are actually approved and managed.
