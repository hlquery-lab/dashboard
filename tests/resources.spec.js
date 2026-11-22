import { test, expect } from "@playwright/test";

test("library notes persist, project files download, and team assignments open projects", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/#Notes");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("button", { name: "Library", exact: true })).toHaveAttribute("aria-expanded", "true");
  await page.getByLabel("Capture an idea", { exact: true }).fill("Launch checklist");
  await page.getByLabel("Note content").fill("Review milestones with the team.");
  await page.getByRole("button", { name: "Save note", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Launch checklist", exact: true })).toBeVisible();
  await nav.getByRole("link", { name: "Project files", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Platform redesign summary", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("platform-redesign-summary.txt");
  await page.goto("/#Workload");
  await page.locator(".assignment-list").getByRole("button", { name: "Platform redesign", exact: true }).first().click();
  await expect(page.locator(".project-detail-dialog")).toBeVisible();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.goto("/#Milestones");
  await expect(page.getByRole("progressbar")).toHaveCount(5);
  await page.goto("/#Notes");
  await page.getByRole("button", { name: "Delete note: Launch checklist", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Room for your next idea", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("new submenu pages fit mobile and expand from compact navigation", async ({ page }) => {
  await page.goto("/#Notes");
  await page.getByRole("button", { name: "Toggle compact navigation", exact: true }).click();
  await page.getByRole("button", { name: "Library", exact: true }).click();
  await expect(page.locator(".workspace")).not.toHaveClass(/compact/);
  await expect(page.getByRole("link", { name: "Project files", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of ["Notes", "Files", "Milestones", "Workload"]) {
    await page.goto(`/#${name}`);
    await expect(page.locator("h1")).toHaveText(name);
    await expect(page.locator(".resource-toolbar")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});
