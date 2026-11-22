import { test, expect } from "@playwright/test";
import { openPage } from "./helpers.js";

test("workspace navigation, analytics, calendar, billing, and project persistence", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Welcome back, James" }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(1);
  for (const name of [
    "Projects",
    "Team",
    "Reports",
    "Charts",
    "Calendar",
    "Billing",
    "Settings",
    "Help",
  ]) {
    await openPage(page, name);
    await expect(page.locator("h1")).toHaveText(name);
  }
  await openPage(page, "Charts");
  await expect(page.locator("canvas")).toHaveCount(4);
  await page.locator(".period-select").getByRole("combobox").first().click();
  await page.getByRole("option", { name: "This week", exact: true }).click();
  await expect(page.locator(".analytics-value strong")).toHaveText("$15.3M");
  await openPage(page, "Calendar");
  await expect(page.locator(".calendar-day")).toHaveCount(42);
  const month = await page.locator(".calendar-toolbar h2").textContent();
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  await expect(page.locator(".calendar-toolbar h2")).not.toHaveText(month);
  await page.getByRole("button", { name: "Today", exact: true }).click();
  await expect(page.locator(".calendar-toolbar h2")).toHaveText(month);
  await page.locator(".calendar-day").nth(12).click();
  await expect(page.locator(".calendar-day.chosen")).toHaveCount(1);
  await openPage(page, "Billing");
  await expect(
    page.getByRole("button", { name: "INV-2026-041", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "INV-2026-041", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download sample", exact: true })
    .click();
  expect((await download).suggestedFilename()).toBe("INV-2026-041-demo.txt");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByLabel("Search invoices", { exact: true }).fill("Nova");
  await expect(page.locator(".invoice-link")).toHaveCount(1);
  await openPage(page, "Projects");
  await page.getByRole("button", { name: "New project", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Project name", { exact: true })
    .fill("Browser test project");
  await page
    .getByRole("dialog")
    .getByLabel("Client", { exact: true })
    .fill("Test Studio");
  await page
    .getByRole("dialog")
    .getByLabel("Due date", { exact: true })
    .fill("2026-12-12");
  await page
    .getByRole("dialog")
    .getByLabel("Budget (CLP)", { exact: true })
    .fill("1000");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await expect(
    page.getByText("Browser test project", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Browser test project", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Switch to dark theme", exact: true })
    .click();
  await expect(page.locator(".workspace")).toHaveClass(/dark/);
  await openPage(page, "Charts");
  await expect(page.locator("canvas")).toHaveCount(4);
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("Projects");
  expect(errors).toEqual([]);
});

test("mobile navigation and layouts fit the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await openPage(page, "Charts");
  await expect(page.locator("h1")).toHaveText("Charts");
  await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  for (const name of [
    "Overview",
    "Board",
    "Calendar",
    "Billing",
    "Payments",
    "Team",
    "Activity",
    "Appearance",
    "Settings",
  ]) {
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await openPage(page, name);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    expect(overflow, `${name} overflows the mobile viewport`).toBe(false);
  }
});

test("overview and reports charts shrink when resizing from desktop to mobile", async ({
  page,
}) => {
  for (const name of ["Overview", "Reports"]) {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto(`/#${name}`);
    await expect(page.locator("canvas")).toHaveCount(1);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      )
      .toBe(true);
    await expect
      .poll(() =>
        page
          .locator(".revenue-card")
          .evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeLessThanOrEqual(360);
  }
});
