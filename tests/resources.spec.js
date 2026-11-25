import { test, expect } from "@playwright/test";
import { openPage, createOrder } from "./helpers.js";
test("catalog edits preserve historical order prices and inventory restocks persist", async ({
  page,
}) => {
  await page.goto("/#Products");
  await expect(page.locator(".c-product-card")).toHaveCount(8);
  await page
    .getByRole("button", { name: "Edit Everyday Canvas Tote", exact: true })
    .click();
  const editor = page.getByRole("dialog", { name: "Product editor" });
  await editor.getByLabel("Price (USD)", { exact: true }).fill("52.25");
  await editor.getByRole("button", { name: "Save product" }).click();
  await expect(
    page.locator(".c-product-card").filter({ hasText: "Everyday Canvas Tote" }),
  ).toContainText("$52.25");
  await openPage(page, "Orders");
  await page.getByRole("button", { name: "#1048", exact: true }).click();
  const detail = page.getByRole("dialog", { name: "Order details" });
  await expect(detail.locator(".c-total-row")).toContainText("$120.00");
  await detail.getByRole("button", { name: "Close order details" }).click();
  await openPage(page, "Inventory");
  await page
    .getByLabel("Stock level", { exact: true })
    .selectOption("Out of stock");
  await expect(page.locator(".c-table tbody tr")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Restock Daily Water Bottle", exact: true })
    .click();
  const stock = page.getByRole("dialog", { name: "Restock product" });
  await stock.getByLabel("Units to add").fill("15");
  await stock.getByRole("button", { name: "Add stock" }).click();
  await expect(page.locator(".c-table tbody tr")).toHaveCount(0);
  await page.reload();
  await page.getByLabel("Search products").fill("Daily Water Bottle");
  await expect(
    page.locator(".c-table tbody tr").locator("td").nth(3),
  ).toHaveText("15");
});
test("new product supports cents, unique SKU, publication, and list filters", async ({
  page,
}) => {
  await page.goto("/#Products");
  await page.getByRole("button", { name: "Add product", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Product editor" });
  await dialog
    .getByLabel("Product name", { exact: true })
    .fill("Travel Coffee Cup");
  await dialog.getByLabel("SKU", { exact: true }).fill("BAG-001");
  await dialog.getByLabel("Price (USD)").fill("28.95");
  await dialog.getByLabel("Cost (USD)").fill("8.5");
  await dialog.getByLabel("Stock quantity").fill("12");
  await dialog.getByRole("button", { name: "Save product" }).click();
  await expect(dialog.getByRole("alert")).toContainText("SKU already exists");
  await dialog.getByLabel("SKU", { exact: true }).fill("CUP-009");
  await dialog.getByLabel("Publication status").selectOption("Active");
  await dialog.getByLabel("Product illustration").selectOption("mug");
  await dialog.getByRole("button", { name: "Save product" }).click();
  await page.getByLabel("Search products").fill("Travel Coffee");
  await expect(page.locator(".c-product-card")).toHaveCount(1);
  await expect(page.locator(".c-product-card")).toContainText("$28.95");
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await expect(page.locator(".c-table tbody tr")).toHaveCount(1);
  await page.reload();
  await page.getByLabel("Search products").fill("CUP-009");
  await expect(page.locator(".c-product-card")).toHaveCount(1);
});
