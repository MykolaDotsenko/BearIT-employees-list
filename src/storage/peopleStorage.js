const PEOPLE_STORAGE_KEY = "people-lens:people:v1";
const REMOVED_STORAGE_KEY = "people-lens:removed:v1";

const allowedAvailability = new Set(["available", "focused", "away"]);
const allowedWorkModes = new Set(["Hybrid", "Remote", "On-site"]);

function cleanText(value, maxLength = 80) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function cleanSkills(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(
    value
      .map((skill) => cleanText(skill, 40))
      .filter(Boolean),
  )].slice(0, 12);
}

export function sanitizeManagedPerson(value) {
  if (!value || typeof value !== "object") return null;

  const id = cleanText(value.id, 120);
  const name = cleanText(value.name, 80);
  const role = cleanText(value.role, 100);
  const team = cleanText(value.team, 60);
  const location = cleanText(value.location, 80);
  const workMode = allowedWorkModes.has(value.workMode) ? value.workMode : "Hybrid";
  const availability = allowedAvailability.has(value.availability)
    ? value.availability
    : "available";
  const capacity = Math.max(0, Math.min(100, Number(value.capacity) || 0));
  const skills = cleanSkills(value.skills);

  if (!id || !name || !role || !team || !location || skills.length === 0) {
    return null;
  }

  return {
    id,
    name,
    role,
    team,
    location,
    workMode,
    availability,
    capacity: Math.round(capacity),
    skills,
    managed: true,
  };
}

export function mergeWorkspacePeople(seedPeople, managedPeople, removedIds = []) {
  const removed = new Set(removedIds);
  const merged = new Map(
    seedPeople
      .filter((person) => !removed.has(person.id))
      .map((person) => [person.id, person]),
  );

  for (const person of managedPeople) {
    if (!removed.has(person.id)) {
      merged.set(person.id, person);
    }
  }

  return [...merged.values()];
}

export function loadManagedPeople() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PEOPLE_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const people = parsed
      .map(sanitizeManagedPerson)
      .filter(Boolean);

    const byId = new Map(people.map((person) => [person.id, person]));
    return [...byId.values()];
  } catch {
    return [];
  }
}

export function saveManagedPeople(people) {
  if (typeof window === "undefined") return;

  try {
    const safe = Array.isArray(people)
      ? people.map(sanitizeManagedPerson).filter(Boolean)
      : [];
    window.localStorage.setItem(PEOPLE_STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // Local persistence is an enhancement; the directory remains usable without it.
  }
}

export function loadRemovedPersonIds() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(REMOVED_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return [...new Set(parsed.map((id) => cleanText(id, 120)).filter(Boolean))];
  } catch {
    return [];
  }
}

export function saveRemovedPersonIds(ids) {
  if (typeof window === "undefined") return;

  try {
    const safe = Array.isArray(ids)
      ? [...new Set(ids.map((id) => cleanText(id, 120)).filter(Boolean))]
      : [];
    window.localStorage.setItem(REMOVED_STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // Removal state is local-only and non-critical.
  }
}
