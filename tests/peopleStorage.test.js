import test from "node:test";
import assert from "node:assert/strict";

import { mergeWorkspacePeople, sanitizeManagedPerson } from "../src/storage/peopleStorage.js";

test("managed people are normalized and constrained before persistence", () => {
  assert.deepEqual(
    sanitizeManagedPerson({
      id: " local-1 ",
      name: "  Ada Example  ",
      role: " Staff Engineer ",
      team: " Platform ",
      location: " Turku ",
      workMode: "Remote",
      availability: "available",
      capacity: 140,
      skills: [" React ", "React", "", "Architecture"],
    }),
    {
      id: "local-1",
      name: "Ada Example",
      role: "Staff Engineer",
      team: "Platform",
      location: "Turku",
      workMode: "Remote",
      availability: "available",
      capacity: 100,
      skills: ["React", "Architecture"],
      managed: true,
    },
  );
});

test("managed people reject incomplete data and fall back to safe enums", () => {
  assert.equal(
    sanitizeManagedPerson({
      id: "local-2",
      name: "",
      role: "Engineer",
      team: "Engineering",
      location: "Turku",
      skills: ["React"],
    }),
    null,
  );

  assert.deepEqual(
    sanitizeManagedPerson({
      id: "local-3",
      name: "Casey",
      role: "Engineer",
      team: "Engineering",
      location: "Turku",
      workMode: "Teleport",
      availability: "unknown",
      capacity: -20,
      skills: ["React"],
    }),
    {
      id: "local-3",
      name: "Casey",
      role: "Engineer",
      team: "Engineering",
      location: "Turku",
      workMode: "Hybrid",
      availability: "available",
      capacity: 0,
      skills: ["React"],
      managed: true,
    },
  );
});


test("workspace merge supports seed overrides, additions, and persistent removals", () => {
  const seed = [
    { id: "seed-a", name: "Seed A" },
    { id: "seed-b", name: "Seed B" },
  ];
  const managed = [
    { id: "seed-a", name: "Edited A", managed: true },
    { id: "local-c", name: "Local C", managed: true },
  ];

  assert.deepEqual(
    mergeWorkspacePeople(seed, managed, ["seed-b"]),
    [
      { id: "seed-a", name: "Edited A", managed: true },
      { id: "local-c", name: "Local C", managed: true },
    ],
  );
});
