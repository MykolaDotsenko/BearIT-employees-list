import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

async function addPerson(page, overrides = {}) {
  await page.locator(".brand-add").click();

  const dialog = page.getByRole("dialog", { name: "Add person" });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel("Name").fill(overrides.name ?? "Nora Example");
  await dialog.getByLabel("Role").fill(overrides.role ?? "Platform Engineer");
  await dialog.getByLabel("Team").fill(overrides.team ?? "Platform");
  await dialog.getByLabel("Location").fill(overrides.location ?? "Turku");
  await dialog.getByLabel("Work mode").selectOption(overrides.workMode ?? "Hybrid");
  await dialog.getByLabel("Status").selectOption(overrides.availability ?? "available");
  await dialog.getByLabel("Near-term capacity").fill(String(overrides.capacity ?? 74));
  await dialog.getByLabel("Skills").fill(overrides.skills ?? "Kubernetes, AWS, Observability");
  await dialog.getByRole("button", { name: "Add to directory" }).click();
}

test("plus action creates a real directory profile and updates stats", async ({ page }) => {
  await addPerson(page);

  await expect(page.getByRole("heading", { name: "Nora Example" })).toBeVisible();
  await expect(page.locator(".stats-grid article").nth(0)).toContainText("13");
  await expect(page.locator(".stats-grid article").nth(1)).toContainText("8");
  await expect(page.getByText("Nora Example added to the directory")).toBeVisible();

  const card = page.locator(".person-card").filter({ hasText: "Nora Example" });
  await expect(card).toContainText("Platform Engineer");
  await expect(card).toContainText("Platform");
  await expect(card).toContainText("Turku");
  await expect(card).toContainText("Hybrid");
  await expect(card).toContainText("74%");
  await expect(card).toContainText("Kubernetes");
});

test("created profiles persist after reload and participate in search and team filters", async ({ page }) => {
  await addPerson(page, {
    name: "Mara Finance",
    role: "Finance Systems Analyst",
    team: "Finance",
    location: "Espoo",
    workMode: "Remote",
    availability: "focused",
    capacity: 42,
    skills: "SQL, Forecasting, Python",
  });

  await page.reload();

  await expect(page.getByRole("heading", { name: "Mara Finance" })).toBeVisible();
  await expect(page.locator(".stats-grid article").nth(0)).toContainText("13");

  await page.getByRole("searchbox", { name: "Search" }).fill("Forecasting");
  await expect(page.getByRole("status")).toContainText("1 match");
  await expect(page.getByRole("heading", { name: "Mara Finance" })).toBeVisible();

  await page.getByRole("searchbox", { name: "Search" }).fill("");
  await page.locator(".filter-grid select").nth(0).selectOption({ label: "Finance" });
  await expect(page.getByRole("status")).toContainText("1 match");
});

test("locally managed profiles can be edited and deleted", async ({ page }) => {
  await addPerson(page);

  let card = page.locator(".person-card").filter({ hasText: "Nora Example" });
  await card.getByRole("button", { name: "Edit Nora Example" }).click();

  const dialog = page.getByRole("dialog", { name: "Edit person" });
  await dialog.getByLabel("Role").fill("Principal Platform Engineer");
  await dialog.getByLabel("Near-term capacity").fill("88");
  await dialog.getByLabel("Skills").fill("Kubernetes, AWS, Reliability");
  await dialog.getByRole("button", { name: "Save changes" }).click();

  card = page.locator(".person-card").filter({ hasText: "Nora Example" });
  await expect(card).toContainText("Principal Platform Engineer");
  await expect(card).toContainText("88%");
  await expect(card).toContainText("Reliability");

  await card.getByRole("button", { name: "Edit Nora Example" }).click();
  const editDialog = page.getByRole("dialog", { name: "Edit person" });
  await editDialog.getByRole("button", { name: "Delete profile" }).click();
  await editDialog.getByRole("button", { name: "Confirm delete" }).click();

  await expect(page.getByRole("heading", { name: "Nora Example" })).toHaveCount(0);
  await expect(page.locator(".stats-grid article").nth(0)).toContainText("12");

  await page.reload();
  await expect(page.getByRole("heading", { name: "Nora Example" })).toHaveCount(0);
});

test("add-person form validates required fields and Escape closes the dialog", async ({ page }) => {
  await page.locator(".brand-add").click();

  const dialog = page.getByRole("dialog", { name: "Add person" });
  await dialog.getByRole("button", { name: "Add to directory" }).click();

  await expect(dialog.getByText("Name is required.")).toBeVisible();
  await expect(dialog.getByText("Role is required.")).toBeVisible();
  await expect(dialog.getByText("Location is required.")).toBeVisible();
  await expect(dialog.getByText("Add at least one skill.")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});

test("built-in profiles remain read-only while created profiles expose management", async ({ page }) => {
  const builtIn = page.locator(".person-card").filter({ hasText: "Ava Lind" });
  await expect(builtIn.getByRole("button", { name: /edit ava lind/i })).toHaveCount(0);

  await addPerson(page);
  const created = page.locator(".person-card").filter({ hasText: "Nora Example" });
  await expect(created.getByRole("button", { name: "Edit Nora Example" })).toBeVisible();
});
