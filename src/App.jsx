import { useCallback, useEffect, useMemo, useState } from "react";

import "./App.css";
import EmployeeCard from "./components/EmployeeCard.jsx";
import FilterBar from "./components/FilterBar.jsx";
import Header from "./components/Header/Header.jsx";
import PersonDialog from "./components/PersonDialog.jsx";
import RemovePersonDialog from "./components/RemovePersonDialog.jsx";
import { employees } from "./data.js";
import { getPeopleStats, getTeams, selectPeople } from "./domain/people.js";
import {
  loadManagedPeople,
  loadRemovedPersonIds,
  mergeWorkspacePeople,
  saveManagedPeople,
  saveRemovedPersonIds,
} from "./storage/peopleStorage.js";
import { loadPinnedIds, savePinnedIds } from "./storage/pinnedStorage.js";

function createManagedId(name) {
  const slug = name
    .toLocaleLowerCase("en")
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "person";

  const unique = globalThis.crypto?.randomUUID?.() ?? String(Date.now());
  return `local-${slug}-${unique}`;
}

export default function App() {
  const [managedPeople, setManagedPeople] = useState(() => loadManagedPeople());
  const [removedIds, setRemovedIds] = useState(() => loadRemovedPersonIds());
  const people = useMemo(
    () => mergeWorkspacePeople(employees, managedPeople, removedIds),
    [managedPeople, removedIds],
  );

  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [pinnedIds, setPinnedIds] = useState(() => {
    const initialPeople = mergeWorkspacePeople(
      employees,
      loadManagedPeople(),
      loadRemovedPersonIds(),
    );
    return loadPinnedIds(initialPeople.map((person) => person.id));
  });
  const [dialog, setDialog] = useState({ open: false, person: null });
  const [removeTarget, setRemoveTarget] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    savePinnedIds(pinnedIds);
  }, [pinnedIds]);

  useEffect(() => {
    saveManagedPeople(managedPeople);
  }, [managedPeople]);

  useEffect(() => {
    saveRemovedPersonIds(removedIds);
  }, [removedIds]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const teams = useMemo(() => getTeams(people), [people]);
  const activeTeam = team === "all" || teams.includes(team) ? team : "all";
  const stats = useMemo(() => getPeopleStats(people), [people]);
  const visiblePeople = useMemo(
    () =>
      selectPeople(
        people,
        {
          query,
          team: activeTeam,
          availability,
          sortBy,
        },
        pinnedIds,
      ),
    [activeTeam, availability, people, pinnedIds, query, sortBy],
  );

  const pinned = useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const hasActiveFilters = Boolean(
    query || activeTeam !== "all" || availability !== "all" || sortBy !== "name",
  );

  const closeDialog = useCallback(() => {
    setDialog({ open: false, person: null });
  }, []);

  const closeRemoveDialog = useCallback(() => {
    setRemoveTarget(null);
  }, []);

  function openCreatePerson() {
    setDialog({ open: true, person: null });
  }

  function openEditPerson(person) {
    setDialog({ open: true, person });
  }

  function savePerson(person) {
    if (person.id) {
      const updated = { ...person, managed: true };
      setManagedPeople((current) =>
        current.some((entry) => entry.id === person.id)
          ? current.map((entry) => (entry.id === person.id ? updated : entry))
          : [...current, updated],
      );
      setRemovedIds((current) => current.filter((id) => id !== person.id));
      setNotice(`${person.name} updated`);
    } else {
      const created = {
        ...person,
        id: createManagedId(person.name),
        managed: true,
      };
      setManagedPeople((current) => [...current, created]);
      setNotice(`${created.name} added to the directory`);
    }

    closeDialog();
  }

  function deletePerson(id) {
    const person = people.find((entry) => entry.id === id);
    const isSeedProfile = employees.some((entry) => entry.id === id);

    setManagedPeople((current) => current.filter((entry) => entry.id !== id));
    if (isSeedProfile) {
      setRemovedIds((current) =>
        current.includes(id) ? current : [...current, id],
      );
    }
    setPinnedIds((current) => current.filter((entryId) => entryId !== id));
    closeDialog();
    closeRemoveDialog();
    setNotice(person ? `${person.name} removed` : "Profile removed");
  }

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
      <Header onAddPerson={openCreatePerson} />

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-copy-block">
            <p className="eyebrow">People intelligence, without the noise</p>
            <h1 id="hero-title">
              See <span>capacity, skills, and availability</span> in one focused view.
            </h1>
            <p className="hero-copy">
              PeopleLens is a compact PeopleOps directory built around one job:
              finding the right teammate quickly without turning a small product
              into a heavy HR platform.
            </p>
          </div>

          <div className="hero-signal" aria-label="Current directory signal">
            <span className="signal-index">Current signal</span>
            <div>
              <strong>{stats.available} available</strong>
              <span>people ready for near-term work</span>
              <small>across {stats.teams} disciplines</small>
            </div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Directory overview">
          <article>
            <span>People</span>
            <strong>{stats.total}</strong>
            <small>Directory profiles</small>
          </article>
          <article>
            <span>Available now</span>
            <strong>{stats.available}</strong>
            <small>Ready for near-term work</small>
          </article>
          <article>
            <span>Avg. capacity</span>
            <strong>{stats.averageCapacity}%</strong>
            <small>Across the directory</small>
          </article>
          <article>
            <span>Shortlist</span>
            <strong>{pinnedIds.length}</strong>
            <small>Saved in this browser</small>
          </article>
        </section>

        <FilterBar
          query={query}
          team={activeTeam}
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
                onEdit={openEditPerson}
                onRequestRemove={setRemoveTarget}
              />
            ))}
          </section>
        ) : (
          <section className="empty-state" aria-labelledby="empty-title">
            <span aria-hidden="true">⌕</span>
            <h2 id="empty-title">{people.length === 0 ? "No people yet" : "No matching people"}</h2>
            <p>
              {people.length === 0
                ? "Add a person to start building this local workspace."
                : "Broaden the search or reset the filters to return to the full directory."}
            </p>
            {people.length === 0 ? (
              <button type="button" onClick={openCreatePerson}>
                Add person
              </button>
            ) : (
              <button type="button" onClick={resetFilters}>
                Reset filters
              </button>
            )}
          </section>
        )}

        <footer className="page-footer">
          <p>
            Local demo workspace · profile changes are stored only in this browser.
          </p>
          <a
            href="https://github.com/MykolaDotsenko/people-lens"
            target="_blank"
            rel="noreferrer"
          >
            Inspect the engineering
          </a>
        </footer>
      </main>

      {dialog.open && (
        <PersonDialog
          key={dialog.person?.id ?? "new-person"}
          person={dialog.person}
          onClose={closeDialog}
          onSave={savePerson}
        />
      )}

      {removeTarget && (
        <RemovePersonDialog
          person={removeTarget}
          onClose={closeRemoveDialog}
          onConfirm={deletePerson}
        />
      )}

      <div
        className={notice ? "app-toast app-toast-visible" : "app-toast"}
        aria-live="polite"
        aria-atomic="true"
      >
        {notice}
      </div>
    </>
  );
}
