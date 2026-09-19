const STORAGE_KEY = "people-lens:pinned:v1";

export function sanitizePinnedIds(value, validIds) {
  const allowed = new Set(validIds);

  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((id) => typeof id === "string" && allowed.has(id)))];
}

export function loadPinnedIds(validIds) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizePinnedIds(JSON.parse(raw), validIds) : [];
  } catch {
    return [];
  }
}

export function savePinnedIds(ids) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Persistence is an enhancement; the directory remains fully usable without it.
  }
}
