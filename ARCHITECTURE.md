# Architecture

PeopleLens is intentionally a small client-side product. Its architecture protects the parts that are easiest to make unreliable without introducing layers that do not solve a concrete problem.

## Dependency direction

```text
React UI
  ├─> pure people selectors
  ├─> shortlist storage adapter
  └─> workspace people storage adapter

seed data + local overrides/additions/removals ─> selectors ─> view model ─> components
```

The pure domain module never imports React, browser globals, CSS, or persistence.

## State ownership

`App.jsx` owns the product workflow state:

- search query
- team filter
- availability filter
- sort order
- shortlisted ids
- profile overrides and additions
- persistently removed ids
- add/edit dialog state
- remove-confirmation state
- transient user feedback

Bundled seed records remain the baseline. Local profile edits override matching seed ids, new profiles are appended, and removed ids suppress records from the effective workspace before filtering, sorting, and metric derivation.

## Persistence boundary

Two browser-storage adapters keep durable user intent separate from temporary discovery state.

### Shortlist persistence

The shortlist adapter:

- validates JSON shape
- allow-lists ids against the current directory
- deduplicates values
- treats unavailable browser storage as non-fatal

### Workspace profile persistence

The people adapter:

- validates required profile fields
- constrains work-mode and availability enums
- clamps capacity to 0–100
- trims and deduplicates skills
- ignores malformed persisted records
- stores profile overrides and additions separately from immutable seed data
- stores removed ids separately so seed profiles can be removed without mutating source data
- merges seed data, overrides, additions, and removals deterministically

Search and filter state remain intentionally ephemeral so a reload returns to a predictable discovery view.

## People management workflow

The header contains one primary **Add person** action. Each profile card has a compact action menu with **Edit profile** and **Remove from directory**.

Every profile can be:

- edited in an accessible modal
- removed through an explicit destructive confirmation
- searched and filtered immediately after changes
- included in live stats
- shortlisted and sorted
- restored after reload from browser storage when edited or added

New profiles are created through the same local workspace model.

## Accessibility

The UI uses semantic form controls, labels, native `meter`, explicit pressed state for shortlist actions, named action menus, visible focus treatment, a result-count live region, dialog semantics, Escape-to-close, focus trapping, reduced-motion support, and forced-colors fallbacks.

## Scope

The bundled directory is fictional demo data. All workspace changes stay only in the current browser. This portfolio application deliberately does not claim a shared HR backend, authentication, authorization, audit logging, or multi-user persistence.
