import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test("initial directory statistics and result count are correct", async ({ page }) => {
  await expect(page.getByRole("status")).toContainText("12 matches");

  const stats = page.locator(".stats-grid article");
  await expect(stats.nth(0)).toContainText("12");
  await expect(stats.nth(1)).toContainText("7");
  await expect(stats.nth(2)).toContainText("48%");
  await expect(stats.nth(3)).toContainText("0");
});

test("search matches across role, skill, city, and work mode fields", async ({ page }) => {
  const search = page.getByRole("searchbox", { name: "Search" });

  await search.fill("django");
  await expect(page.getByRole("status")).toContainText("1 match");
  await expect(page.getByRole("heading", { name: "Leo Niemi" })).toBeVisible();

  await search.fill("turku");
  await expect(page.getByRole("status")).toContainText("4 matches");

  await search.fill("remote");
  await expect(page.getByRole("status")).toContainText("4 matches");

  await search.fill("product designer");
  await expect(page.getByRole("status")).toContainText("1 match");
  await expect(page.getByRole("heading", { name: "Mina Koskinen" })).toBeVisible();
});

test("team and availability filters work independently and together", async ({ page }) => {
  await page.getByLabel("Team", { exact: true }).selectOption({ label: "Engineering" });
  await expect(page.getByRole("status")).toContainText("5 matches");

  await page.getByLabel("Status", { exact: true }).selectOption("available");
  await expect(page.getByRole("status")).toContainText("2 matches");
  await expect(page.getByRole("heading", { name: "Ava Lind" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Oliver Salo" })).toBeVisible();

  await page.getByLabel("Team", { exact: true }).selectOption({ label: "Design" });
  await expect(page.getByRole("status")).toContainText("2 matches");
  await expect(page.getByRole("heading", { name: "Mina Koskinen" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mikael Holm" })).toBeVisible();
});

test("capacity sorting orders the highest-capacity people first", async ({ page }) => {
  await page.getByLabel("Sort", { exact: true }).selectOption("capacity");

  const names = await page.locator(".person-card h3").allTextContents();
  expect(names.slice(0, 4)).toEqual([
    "Oliver Salo",
    "Mikael Holm",
    "Ava Lind",
    "Lina Mäkelä",
  ]);
});

test("team sorting is deterministic and alphabetic by team then name", async ({ page }) => {
  await page.getByLabel("Sort", { exact: true }).selectOption("team");

  const names = await page.locator(".person-card h3").allTextContents();
  expect(names.slice(0, 5)).toEqual([
    "Lina Mäkelä",
    "Noah Virtanen",
    "Mikael Holm",
    "Mina Koskinen",
    "Sara Lehto",
  ]);
});

test("shortlist supports add, persistence, sort-first, and removal", async ({ page }) => {
  await page.getByRole("button", { name: /add ava lind to shortlist/i }).click();
  await page.getByRole("button", { name: /add sara lehto to shortlist/i }).click();

  await expect(page.locator(".stats-grid article").nth(3)).toContainText("2");

  await page.getByLabel("Sort", { exact: true }).selectOption("pinned");
  let names = await page.locator(".person-card h3").allTextContents();
  expect(names.slice(0, 2)).toEqual(["Ava Lind", "Sara Lehto"]);

  await page.reload();
  await expect(page.locator(".stats-grid article").nth(3)).toContainText("2");
  await expect(
    page.getByRole("button", { name: /remove ava lind from shortlist/i }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /remove ava lind from shortlist/i }).click();
  await expect(page.locator(".stats-grid article").nth(3)).toContainText("1");
});

test("persisted shortlist sanitizes duplicates and unknown ids", async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem(
      "people-lens:pinned:v1",
      JSON.stringify(["ava-lind", "ava-lind", "not-real"]),
    );
  });

  await page.reload();

  await expect(page.locator(".stats-grid article").nth(3)).toContainText("1");
  await expect(
    page.getByRole("button", { name: /remove ava lind from shortlist/i }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("corrupted persisted shortlist does not break the directory", async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem("people-lens:pinned:v1", "{broken-json");
  });

  await page.reload();

  await expect(page.getByRole("status")).toContainText("12 matches");
  await expect(page.locator(".stats-grid article").nth(3)).toContainText("0");
});

test("reset clears all active discovery controls and restores full directory", async ({ page }) => {
  await page.getByRole("searchbox", { name: "Search" }).fill("python");
  await page.getByLabel("Team", { exact: true }).selectOption({ label: "Data" });
  await page.getByLabel("Status", { exact: true }).selectOption("available");
  await page.getByLabel("Sort", { exact: true }).selectOption("capacity");

  await page.getByRole("button", { name: "Reset filters" }).click();

  await expect(page.getByRole("searchbox", { name: "Search" })).toHaveValue("");
  await expect(page.getByLabel("Team", { exact: true })).toHaveValue("all");
  await expect(page.getByLabel("Status", { exact: true })).toHaveValue("all");
  await expect(page.getByLabel("Sort", { exact: true })).toHaveValue("name");
  await expect(page.getByRole("status")).toContainText("12 matches");
});

test("empty state recovers through both reset affordances", async ({ page }) => {
  await page.getByRole("searchbox", { name: "Search" }).fill("definitely-no-match");

  await expect(page.getByRole("heading", { name: "No matching people" })).toBeVisible();
  await page
    .getByRole("region", { name: "No matching people" })
    .getByRole("button", { name: "Reset filters" })
    .click();

  await expect(page.getByRole("status")).toContainText("12 matches");

  await page.getByRole("searchbox", { name: "Search" }).fill("definitely-no-match");
  await page
    .getByRole("region", { name: "Find the right teammate" })
    .getByRole("button", { name: "Reset filters" })
    .click();
  await expect(page.getByRole("status")).toContainText("12 matches");
});

test("interactive controls remain keyboard reachable", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to people" })).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "PeopleLens home" })).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("searchbox", { name: "Search" })).toBeFocused();
});

test("3D card interaction does not block shortlist actions", async ({ page, isMobile }) => {
  const card = page.locator(".person-card").filter({ hasText: "Ava Lind" });

  if (!isMobile) {
    await card.hover({ position: { x: 220, y: 80 } });
  }

  await card.getByRole("button", { name: /add ava lind to shortlist/i }).click();
  await expect(
    card.getByRole("button", { name: /remove ava lind from shortlist/i }),
  ).toHaveAttribute("aria-pressed", "true");
});
