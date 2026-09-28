# Architecture

PeopleLens is intentionally a small client-side product. Its architecture protects the parts that are easiest to make unreliable without introducing layers that do not solve a concrete problem.

## Dependency direction

```text
React UI
  ├─> pure people selectors
  ├─> shortlist storage adapter
  └─> managed-people storage adapter

seed data + locally managed profiles ─> selectors ─> view model ─> components
```

The pure domain module never imports React, browser globals, CSS, or persistence.

## State ownership

`App.jsx` owns the product workflow state:

- search query
- team filter
- availability filter
- sort order
- shortlisted ids
- locally managed people
- add/edit dialog state
- transient user feedback

Bundled seed records remain immutable. Locally managed records are stored separately and combined with seed data before filtering, sorting, and metric derivation.

## Persistence boundary

Two browser-storage adapters keep durable user intent separate from temporary discovery state.

### Shortlist persistence

The shortlist adapter:

- validates JSON shape
- allow-lists ids against the current directory
- deduplicates values
- treats unavailable browser storage as non-fatal

### Managed-profile persistence

The people adapter:

- validates required profile fields
- constrains work-mode and availability enums
- clamps capacity to 0–100
- trims and deduplicates skills
- ignores malformed persisted records
- keeps locally created profiles explicitly marked as managed

Search and filter state remain intentionally ephemeral so a reload returns to a predictable discovery view.

## People management workflow

The header plus action and explicit **Add person** button open an accessible modal workflow.

Locally managed profiles can be:

- created
- edited
- deleted with explicit confirmation
- searched and filtered immediately
- included in live stats
- shortlisted and sorted
- restored after reload from browser storage

Bundled demo profiles remain read-only so the application clearly distinguishes seed data from user-managed records.

## Accessibility

The UI uses semantic form controls, labels, native `meter`, explicit pressed state for shortlist actions, visible focus treatment, a result-count live region, dialog semantics, Escape-to-close, focus trapping, reduced-motion support, and forced-colors fallbacks.

## Scope

The bundled directory is fictional demo data. Profiles created through the UI stay only in the current browser. This portfolio application deliberately does not claim a shared HR backend, authentication, authorization, audit logging, or multi-user persistence.
