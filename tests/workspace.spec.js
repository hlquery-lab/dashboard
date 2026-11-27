import { test, expect } from "@playwright/test";
import { openPage } from "./helpers.js";
test("ecommerce overview and reporting periods use paid order data", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Dashboard");
  await expect(page).toHaveTitle("Open Source Dashboard · HLQuery");
  await expect(page.locator(".brand")).not.toContainText("SHOP");
  await expect(page.locator(".c-metric > strong")).toHaveText([
    "$1,559.00",
    "11",
    "$155.90",
    "27",
  ]);
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator(".sidebar")).not.toContainText("Projects");
  await page.getByLabel("Reporting period").selectOption("30");
  await expect(page.locator(".c-metric > strong").first()).toHaveText(
    "$2,233.00",
  );
  await page
    .getByRole("button", { name: "Sales analytics", exact: false })
    .click();
  await expect(page.locator("h1")).toHaveText("Analytics");
  await expect(page.locator(".c-category-row")).toHaveCount(4);
  await openPage(page, "Products");
  await expect(page.locator(".c-product-card")).toHaveCount(8);
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("Analytics");
  expect(errors).toEqual([]);
});
test("all store pages fit desktop, tablet, mobile, and compact navigation", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const pages = [
    "Overview",
    "Orders",
    "Fulfillment",
    "Products",
    "Inventory",
    "Customers",
    "Analytics",
    "Discounts",
    "Invoices",
    "Payments",
    "Activity",
    "Settings",
    "Appearance",
    "Help",
  ];
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const name of pages) {
      await page.goto("/#" + name);
      await expect(page.locator("h1")).toHaveText(
        name === "Overview" ? "Dashboard" : name,
      );
      await expect
        .poll(
          () =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          { message: name + " at " + width },
        )
        .toBe(true);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto("/#Orders");
  await page
    .getByRole("button", { name: "Toggle compact navigation", exact: true })
    .click();
  await expect(page.locator(".workspace")).toHaveClass(/compact/);
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Catalog", exact: true })
    .click();
  await expect(page.locator(".workspace")).not.toHaveClass(/compact/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await openPage(page, "Products");
  await expect(page.locator("h1")).toHaveText("Products");
  await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  expect(errors).toEqual([]);
});
test("old project links open their ecommerce destination", async ({ page }) => {
  await page.goto("/#Projects");
  await expect(page.locator("h1")).toHaveText("Orders");
  await expect(page).toHaveURL(/#Orders$/);
  await page.goto("/#Clients");
  await expect(page.locator("h1")).toHaveText("Customers");
});
