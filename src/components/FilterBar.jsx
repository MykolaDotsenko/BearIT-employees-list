export default function FilterBar({
  query,
  team,
  availability,
  sortBy,
  teams,
  onQueryChange,
  onTeamChange,
  onAvailabilityChange,
  onSortChange,
  onReset,
  hasActiveFilters,
}) {
  return (
    <section className="filter-panel" aria-labelledby="filter-heading">
      <div className="filter-heading-row">
        <div>
          <p className="eyebrow">Discover</p>
          <h2 id="filter-heading">Find the right teammate</h2>
        </div>
        {hasActiveFilters && (
          <button className="text-button" type="button" onClick={onReset}>
            Reset filters
          </button>
        )}
      </div>

      <div className="filter-grid">
        <label className="field field-search">
          <span>Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Name, role, skill, city…"
            autoComplete="off"
          />
        </label>

        <label className="field">
          <span>Team</span>
          <select value={team} onChange={(event) => onTeamChange(event.target.value)}>
            <option value="all">All teams</option>
            {teams.map((teamName) => (
              <option key={teamName} value={teamName}>
                {teamName}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Status</span>
          <select
            value={availability}
            onChange={(event) => onAvailabilityChange(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="focused">Focused</option>
            <option value="away">Away</option>
          </select>
        </label>

        <label className="field">
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
            <option value="name">Name</option>
            <option value="capacity">Capacity</option>
            <option value="team">Team</option>
            <option value="pinned">Shortlist first</option>
          </select>
        </label>
      </div>
    </section>
  );
}
