import { test, expect } from "@playwright/test";

test("help center filters guides and opens a workflow from an article", async ({ page }) => {
  await page.goto("/#Help");
  await expect(page.locator("h1")).toHaveText("Help center");
  await expect(page.locator(".help-topic")).toHaveCount(6);
  await page.getByLabel("Search help articles").fill("restock");
  await expect(page.locator(".help-article-row")).toHaveCount(1);
  await page.locator(".help-article-row").click();
  await expect(page.locator(".help-guide h2")).toHaveText("Restock a product");
  await expect(page.locator(".help-guide h2")).toBeFocused();
  await page.getByRole("button", { name: "Back to help center" }).click();
  await expect(page.getByLabel("Search help articles")).toHaveValue("restock");
  await page.getByLabel("Clear search").click();
  await page.locator(".help-topic").filter({ hasText: "Orders & shipping" }).click();
  await expect(page.locator(".help-article-row")).toHaveCount(2);
  await page.getByRole("button", { name: "Create your first order", exact: false }).click();
  await page.getByRole("button", { name: "Go to orders" }).click();
  await expect(page.locator("h1")).toHaveText("Orders");
});

test("help center recovers from empty search and fits small screens in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/#Help");
  await page.getByLabel("Search help articles").fill("no-such-guide");
  await expect(page.getByText("No guides found")).toBeVisible();
  await page.getByRole("button", { name: "Show all guides" }).click();
  await expect(page.locator(".help-article-row")).toHaveCount(9);
  for (const dark of [false, true]) {
    if (dark) await page.getByRole("button", { name: "Switch to dark theme" }).click();
    expect(await page.locator(".help-center").evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await page.getByRole("button", { name: "Read the guide", exact: true }).click();
    await expect(page.locator(".help-guide")).toContainText("No real payments");
    expect(await page.locator(".help-center").evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await page.getByRole("button", { name: "Back to help center" }).click();
  }
});
