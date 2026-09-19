# Architecture

PeopleLens is intentionally a small client-side product. Its architecture protects the parts that are easiest to make unreliable without introducing layers that do not solve a concrete problem.

## Dependency direction

```text
React UI
  ├─> pure people selectors
  └─> local-storage adapter

seed data ─> selectors ─> view model ─> components
```

The pure domain module never imports React, browser globals, CSS, or persistence.

## State ownership

`App.jsx` owns only interaction state:

- search query
- team filter
- availability filter
- sort order
- shortlisted ids

Employee records stay immutable. Filtering and sorting always derive a new view from the canonical list.

## Persistence boundary

Only shortlist ids are durable. Search and filter state are intentionally ephemeral so a reload returns to a predictable discovery view.

The storage adapter:

- validates the JSON shape
- allow-lists ids against the current dataset
- deduplicates values
- treats unavailable browser storage as a non-fatal condition

## Accessibility

The UI uses semantic form controls, labels, native `meter`, explicit pressed state for shortlist actions, visible focus treatment, a result-count live region, reduced-motion support, and forced-colors fallbacks.

## Scope

The bundled directory is fictional demo data. This repository is a portfolio case study, not an HR system and not a representation of BearIT personnel.
