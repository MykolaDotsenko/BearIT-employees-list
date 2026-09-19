import { useEffect, useMemo, useState } from "react";

import "./App.css";
import EmployeeCard from "./components/EmployeeCard.jsx";
import FilterBar from "./components/FilterBar.jsx";
import Header from "./components/Header/Header.jsx";
import { employees } from "./data.js";
import { getPeopleStats, getTeams, selectPeople } from "./domain/people.js";
import { loadPinnedIds, savePinnedIds } from "./storage/pinnedStorage.js";

const validIds = employees.map((person) => person.id);

export default function App() {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [pinnedIds, setPinnedIds] = useState(() => loadPinnedIds(validIds));

  useEffect(() => {
    savePinnedIds(pinnedIds);
  }, [pinnedIds]);

  const teams = useMemo(() => getTeams(employees), []);
  const stats = useMemo(() => getPeopleStats(employees), []);
  const visiblePeople = useMemo(
    () =>
      selectPeople(
        employees,
        {
          query,
          team,
          availability,
          sortBy,
        },
        pinnedIds,
      ),
    [availability, pinnedIds, query, sortBy, team],
  );

  const pinned = useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const hasActiveFilters = Boolean(
    query || team !== "all" || availability !== "all" || sortBy !== "name",
  );

  function togglePinned(id) {
    setPinnedIds((current) =>
      current.includes(id)
        ? current.filter((currentId) => currentId !== id)
        : [...current, id],
    );
  }

  function resetFilters() {
    setQuery("");
    setTeam("all");
    setAvailability("all");
    setSortBy("name");
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to people
      </a>
      <Header />

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow">People intelligence, without the noise</p>
            <h1 id="hero-title">See capacity, skills, and availability in one focused view.</h1>
            <p className="hero-copy">
              PeopleLens is a compact PeopleOps case study built around one job:
              finding the right teammate quickly without turning a small product
              into a heavy HR platform.
            </p>
          </div>

          <div className="hero-signal" aria-label="Current directory signal">
            <span className="signal-dot" aria-hidden="true" />
            <div>
              <strong>{stats.available} people available</strong>
              <span>across {stats.teams} disciplines</span>
            </div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Directory overview">
          <article>
            <span>People</span>
            <strong>{stats.total}</strong>
            <small>Fictional profiles</small>
          </article>
          <article>
            <span>Available now</span>
            <strong>{stats.available}</strong>
            <small>Ready for near-term work</small>
          </article>
          <article>
            <span>Avg. capacity</span>
            <strong>{stats.averageCapacity}%</strong>
            <small>Across the demo directory</small>
          </article>
          <article>
            <span>Shortlist</span>
            <strong>{pinnedIds.length}</strong>
            <small>Saved in this browser</small>
          </article>
        </section>

        <FilterBar
          query={query}
          team={team}
          availability={availability}
          sortBy={sortBy}
          teams={teams}
          onQueryChange={setQuery}
          onTeamChange={setTeam}
          onAvailabilityChange={setAvailability}
          onSortChange={setSortBy}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="results-heading">
          <div>
            <p className="eyebrow">Directory</p>
            <h2>People</h2>
          </div>
          <p className="result-count" role="status" aria-live="polite">
            {visiblePeople.length} {visiblePeople.length === 1 ? "match" : "matches"}
          </p>
        </div>

        {visiblePeople.length > 0 ? (
          <section className="people-grid" aria-label="People directory">
            {visiblePeople.map((person) => (
              <EmployeeCard
                key={person.id}
                person={person}
                pinned={pinned.has(person.id)}
                onTogglePinned={togglePinned}
              />
            ))}
          </section>
        ) : (
          <section className="empty-state" aria-labelledby="empty-title">
            <span aria-hidden="true">⌕</span>
            <h2 id="empty-title">No matching people</h2>
            <p>Broaden the search or reset the filters to return to the full directory.</p>
            <button type="button" onClick={resetFilters}>
              Reset filters
            </button>
          </section>
        )}

        <footer className="page-footer">
          <p>Portfolio case study · all names and staffing data are fictional.</p>
          <a
            href="https://github.com/MykolaDotsenko/BearIT-employees-list"
            target="_blank"
            rel="noreferrer"
          >
            Inspect the engineering
          </a>
        </footer>
      </main>
    </>
  );
}
