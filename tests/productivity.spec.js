import { test, expect } from "@playwright/test";
import { openPage } from "./helpers.js";
test("customers share order history and store new profiles", async ({
  page,
}) => {
  await page.goto("/#Customers");
  await page.getByLabel("Search customers").fill("Olivia");
  await expect(page.locator(".c-table tbody tr")).toHaveCount(1);
  await expect(page.locator(".c-table tbody tr")).toContainText("$264.00");
  await page
    .getByRole("button", { name: "View customer Olivia Martin" })
    .click();
  const detail = page.getByRole("dialog", { name: "Customer details" });
  await expect(detail.locator(".c-table tbody tr")).toHaveCount(2);
  await detail.getByRole("button", { name: "#1048", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Order details" }),
  ).toContainText("$120.00");
  await page.getByRole("button", { name: "Close order details" }).click();
  await page.getByRole("button", { name: "Add customer", exact: true }).click();
  const editor = page.getByRole("dialog", { name: "Customer editor" });
  await editor.getByLabel("Customer name").fill("Isabella Walker");
  await editor
    .getByLabel("Email", { exact: true })
    .fill("isabella@example.com");
  await editor.getByLabel("City", { exact: true }).fill("Phoenix");
  await editor.getByRole("button", { name: "Save customer" }).click();
  await expect(
    page.getByRole("dialog", { name: "Customer details" }),
  ).toContainText("Isabella Walker");
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.reload();
  await page.getByLabel("Search customers").fill("Isabella");
  await expect(page.locator(".c-table tbody tr")).toContainText("No orders");
});
test("discounts can be created, applied, and paused", async ({ page }) => {
  await page.goto("/#Discounts");
  await page
    .getByRole("button", { name: "Create discount", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Create discount" });
  await dialog.getByLabel("Discount code", { exact: true }).fill("HELLO20");
  await dialog.getByLabel("Percentage off").fill("20");
  await dialog.getByLabel("Minimum order (USD)").fill("25");
  await dialog
    .getByRole("button", { name: "Create discount", exact: true })
    .click();
  await openPage(page, "Orders");
  await page
    .getByRole("button", { name: "Create order", exact: true })
    .first()
    .click();
  const editor = page.getByRole("dialog", { name: "Create order" });
  await editor.getByLabel("Customer", { exact: true }).selectOption("c1");
  await editor.getByLabel("Discount code", { exact: true }).fill("HELLO20");
  await editor
    .getByRole("button", { name: "Create order", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Order details" }),
  ).toContainText("$38.40");
  await page.getByRole("button", { name: "Close order details" }).click();
  await openPage(page, "Discounts");
  const row = page.getByRole("row").filter({ hasText: "HELLO20" });
  await expect(row).toContainText("1 orders");
  await page
    .getByRole("button", { name: "Pause HELLO20", exact: true })
    .click();
  await expect(row).toContainText("Paused");
  await page.reload();
  await expect(row).toContainText("Paused");
});
