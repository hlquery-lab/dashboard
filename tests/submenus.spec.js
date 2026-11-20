import { test, expect } from "@playwright/test";
import { openPage } from "./helpers.js";

test("nested navigation, board changes, activity, and browser history stay connected", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#Board");
  await expect(page.locator("h1")).toHaveText("Board");
  await expect(
    page.getByRole("button", { name: "Projects", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("link", { name: "Board view", exact: true }).first(),
  ).toHaveAttribute("aria-current", "page");
  const card = page
    .locator(".kanban-card")
    .filter({
      has: page.getByRole("button", { name: "Platform redesign", exact: true }),
    });
  await card
    .locator(".board-move-select")
    .getByRole("combobox")
    .first()
    .click();
  await page.getByRole("option", { name: "Completed", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Completed", exact: true })
      .getByRole("button", { name: "Platform redesign", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".kanban-card")).toHaveCount(5);
  await openPage(page, "Projects");
  await expect(
    page
      .getByRole("row")
      .filter({
        has: page.getByRole("button", {
          name: "Platform redesign",
          exact: true,
        }),
      }),
  ).toContainText("Completed");
  await page.reload();
  await expect(
    page
      .getByRole("row")
      .filter({
        has: page.getByRole("button", {
          name: "Platform redesign",
          exact: true,
        }),
      }),
  ).toContainText("Completed");
  await openPage(page, "Activity");
  await expect(
    page.getByRole("heading", {
      name: "Platform redesign moved to Completed",
      exact: true,
    }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("Projects");
  expect(errors).toEqual([]);
});

test("dragging a card changes its stage without losing projects", async ({
  page,
}) => {
  await page.goto("/#Board");
  const card = page
    .locator(".kanban-card")
    .filter({
      has: page.getByRole("button", { name: "Company website", exact: true }),
    });
  const target = page
    .getByRole("region", { name: "In review", exact: true })
    .locator(".kanban-dropzone");
  await card
    .locator(".drag-handle")
    .dragTo(target, { targetPosition: { x: 80, y: 20 } });
  await expect(
    page
      .getByRole("region", { name: "In review", exact: true })
      .getByRole("button", { name: "Company website", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".kanban-card")).toHaveCount(5);
  await page.reload();
  await expect(
    page
      .getByRole("region", { name: "In review", exact: true })
      .getByRole("button", { name: "Company website", exact: true }),
  ).toBeVisible();
});

test("appearance preferences persist and retain the blue brand", async ({
  page,
}) => {
  await page.goto("/#Appearance");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Compact tables", exact: true })
    .check();
  await page
    .getByRole("checkbox", { name: "Compact navigation", exact: true })
    .check();
  await expect(page.locator(".workspace")).toHaveClass(/compact/);
  await expect(page.locator(".workspace")).toHaveClass(/dense/);
  await page.reload();
  await expect(page.locator(".workspace")).toHaveClass(/dark/);
  await expect(page.locator(".workspace")).toHaveClass(/dense/);
  expect(
    await page
      .locator(".workspace")
      .evaluate((e) =>
        getComputedStyle(e).getPropertyValue("--primary").trim(),
      ),
  ).toBe("#1976d3");
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await expect(page.locator(".workspace")).not.toHaveClass(/compact/);
  await expect(
    page.getByRole("link", { name: "Board view", exact: true }).first(),
  ).toBeVisible();
});

test("command search opens pages and project details; payments export works", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await page.getByLabel("Search pages and projects").fill("Board");
  await page.getByLabel("Search pages and projects").press("Enter");
  await expect(page.locator("h1")).toHaveText("Board");
  await page
    .getByRole("button", { name: "Search workspace", exact: true })
    .first()
    .click();
  await page.getByLabel("Search pages and projects").fill("Acme");
  await page.getByLabel("Search pages and projects").press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator(".project-detail-dialog")).toBeVisible();
  await expect(page.locator(".project-detail-dialog")).toContainText(
    "Platform redesign",
  );
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await openPage(page, "Payments");
  await expect(page.locator(".payment-balance-card h2")).toHaveText(
    "CLP 2,150,000",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("hlquery-payments.csv");
  expect(errors).toEqual([]);
});
