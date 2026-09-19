const normalize = (value) => String(value ?? "").trim().toLocaleLowerCase("en");

export function selectPeople(people, filters = {}, pinnedIds = []) {
  const query = normalize(filters.query);
  const team = filters.team ?? "all";
  const availability = filters.availability ?? "all";
  const sortBy = filters.sortBy ?? "name";
  const pinned = new Set(pinnedIds);

  const filtered = people.filter((person) => {
    const haystack = normalize(
      [
        person.name,
        person.role,
        person.team,
        person.location,
        person.workMode,
        ...person.skills,
      ].join(" "),
    );

    return (
      (!query || haystack.includes(query)) &&
      (team === "all" || person.team === team) &&
      (availability === "all" || person.availability === availability)
    );
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === "capacity") {
      return b.capacity - a.capacity || a.name.localeCompare(b.name);
    }

    if (sortBy === "team") {
      return a.team.localeCompare(b.team) || a.name.localeCompare(b.name);
    }

    if (sortBy === "pinned") {
      const pinDelta = Number(pinned.has(b.id)) - Number(pinned.has(a.id));
      return pinDelta || a.name.localeCompare(b.name);
    }

    return a.name.localeCompare(b.name);
  });
}

export function getPeopleStats(people) {
  const totalCapacity = people.reduce((sum, person) => sum + person.capacity, 0);

  return {
    total: people.length,
    available: people.filter((person) => person.availability === "available").length,
    teams: new Set(people.map((person) => person.team)).size,
    averageCapacity: people.length ? Math.round(totalCapacity / people.length) : 0,
  };
}

export function getTeams(people) {
  return [...new Set(people.map((person) => person.team))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function availabilityLabel(value) {
  return (
    {
      available: "Available",
      focused: "Focused",
      away: "Away",
    }[value] ?? "Unknown"
  );
}
