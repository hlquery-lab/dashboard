import { test, expect } from "@playwright/test";

test("sidebar destinations, client projects, and personal goals stay connected", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await nav.getByRole("link", { name: "My tasks", exact: true }).click();
  await page
    .getByLabel("New task", { exact: true })
    .fill("Prepare the customer review");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Prepare the customer review", exact: true })
    .check();
  await page.reload();
  await expect(
    page.getByRole("checkbox", {
      name: "Prepare the customer review",
      exact: true,
    }),
  ).toBeChecked();
  await nav.getByRole("link", { name: "Goals & targets", exact: true }).click();
  await expect(
    page.locator(".goal-card").filter({ hasText: "Clear your checklist" }),
  ).toContainText("2 / 5");
  await nav.getByRole("link", { name: "Clients", exact: true }).click();
  await page.getByLabel("Search clients").fill("Acme");
  await expect(page.locator(".client-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Platform redesign", exact: true })
    .click();
  await expect(page.locator(".project-detail-dialog")).toBeVisible();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await nav
    .getByRole("button", { name: "Search navigation", exact: true })
    .click();
  await page.getByLabel("Search pages and projects").fill("Goals");
  await page.getByLabel("Search pages and projects").press("Enter");
  await expect(page.locator("h1")).toHaveText("Goals");
  expect(errors).toEqual([]);
});

test("new navigation works in compact mode and on mobile", async ({ page }) => {
  await page.goto("/#Clients");
  await page
    .getByRole("button", { name: "Toggle compact navigation", exact: true })
    .click();
  await page.getByRole("link", { name: "My tasks", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Tasks");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .getByRole("link", { name: "Goals & targets", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Goals");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
