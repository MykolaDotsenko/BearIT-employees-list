import test from "node:test";
import assert from "node:assert/strict";

import {
  availabilityLabel,
  getInitials,
  getPeopleStats,
  getTeams,
  selectPeople,
} from "../src/domain/people.js";
import { sanitizePinnedIds } from "../src/storage/pinnedStorage.js";

const people = [
  {
    id: "a",
    name: "Ada North",
    role: "Frontend Engineer",
    team: "Engineering",
    location: "Turku",
    workMode: "Hybrid",
    availability: "available",
    capacity: 80,
    skills: ["React", "Accessibility"],
  },
  {
    id: "b",
    name: "Ben West",
    role: "Designer",
    team: "Design",
    location: "Helsinki",
    workMode: "Remote",
    availability: "focused",
    capacity: 20,
    skills: ["Research"],
  },
];

test("search matches across useful employee fields", () => {
  assert.deepEqual(
    selectPeople(people, { query: "accessibility" }).map((person) => person.id),
    ["a"],
  );
  assert.deepEqual(
    selectPeople(people, { query: "helsinki" }).map((person) => person.id),
    ["b"],
  );
});

test("team and status filters compose", () => {
  assert.deepEqual(
    selectPeople(people, { team: "Engineering", availability: "available" }).map(
      (person) => person.id,
    ),
    ["a"],
  );
});

test("sorting never mutates canonical input", () => {
  const original = people.map((person) => person.id);
  const sorted = selectPeople(people, { sortBy: "capacity" });

  assert.deepEqual(sorted.map((person) => person.id), ["a", "b"]);
  assert.deepEqual(people.map((person) => person.id), original);
});

test("shortlist sorting puts pinned people first", () => {
  assert.deepEqual(
    selectPeople(people, { sortBy: "pinned" }, ["b"]).map((person) => person.id),
    ["b", "a"],
  );
});

test("stats and filter options are deterministic", () => {
  assert.deepEqual(getPeopleStats(people), {
    total: 2,
    available: 1,
    teams: 2,
    averageCapacity: 50,
  });
  assert.deepEqual(getTeams(people), ["Design", "Engineering"]);
});

test("helpers handle presentation-safe values", () => {
  assert.equal(getInitials("Ada North"), "AN");
  assert.equal(availabilityLabel("available"), "Available");
  assert.equal(availabilityLabel("other"), "Unknown");
});

test("persisted shortlist data is deduplicated and allow-listed", () => {
  assert.deepEqual(sanitizePinnedIds(["a", "a", "x", 42, "b"], ["a", "b"]), ["a", "b"]);
  assert.deepEqual(sanitizePinnedIds(null, ["a"]), []);
});
