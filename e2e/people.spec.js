import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test("core discovery flow stays focused and deterministic", async ({ page }) => {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /see capacity, skills, and availability/i,
    }),
  ).toBeVisible();

  await page.getByRole("searchbox", { name: "Search" }).fill("accessibility");
  await expect(page.getByRole("status")).toContainText("1 match");
  await expect(page.getByRole("heading", { name: "Ava Lind" })).toBeVisible();

  await page.getByRole("button", { name: /add ava lind to shortlist/i }).click();
  await expect(
    page.getByRole("button", { name: /remove ava lind from shortlist/i }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.reload();
  await expect(
    page.getByRole("button", { name: /remove ava lind from shortlist/i }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("filters recover cleanly from an empty result", async ({ page }) => {
  await page.getByRole("searchbox", { name: "Search" }).fill("no-such-person");
  await expect(page.getByRole("heading", { name: "No matching people" })).toBeVisible();

  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("status")).toContainText("12 matches");
});

test("main states have no serious WCAG A/AA axe violations", async ({ page }) => {
  const initial = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(initial.violations).toEqual([]);

  await page.getByRole("searchbox", { name: "Search" }).fill("design");
  const filtered = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(filtered.violations).toEqual([]);
});

test("layout does not overflow the viewport", async ({ page }) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(1);
});
