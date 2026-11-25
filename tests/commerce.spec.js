import { test, expect } from "@playwright/test";
import { openPage, downloadText } from "./helpers.js";
test("command search opens ecommerce pages and matching orders", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const input = page.getByLabel("Search pages and orders");
  await input.fill("Products");
  await input.press("Enter");
  await expect(page.locator("h1")).toHaveText("Products");
  await page.keyboard.press("Control+k");
  await input.fill("ORD-1048");
  await input.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Order details" }),
  ).toContainText("Olivia Martin");
  await page.getByRole("button", { name: "Close order details" }).click();
  await page.getByRole("button", { name: "Store notifications" }).click();
  await page
    .getByRole("button", { name: "3 products running low", exact: false })
    .click();
  await expect(page.locator("h1")).toHaveText("Inventory");
});
test("finance totals and invoice downloads use the same order records", async ({
  page,
}) => {
  await page.goto("/#Payments");
  await expect(page.locator(".c-finance-metrics strong")).toHaveText([
    "$2,233.00",
    "$36.00",
    "$129.00",
  ]);
  await page.getByLabel("Filter payments").selectOption("Pending");
  await expect(page.locator(".c-table tbody tr")).toHaveCount(1);
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV", exact: true }).click();
  const text = await downloadText(await event);
  expect(text).toContain("Amount USD");
  expect(text).toContain("36.00");
  expect(text).toContain("ORD-1044");
  expect(text).not.toContain("ORD-1048");
  await openPage(page, "Invoices");
  const invoice = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download invoice ORD-1048", exact: true })
    .click();
  expect(await downloadText(await invoice)).toContain("Total (USD): $120.00");
});

test("mobile checkout and order details work in dark mode without overflowing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/#Orders");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page
    .locator(".heading-actions")
    .getByRole("button", { name: "Create order", exact: true })
    .click();
  const editor = page.getByRole("dialog", { name: "Create order" });
  await editor.getByLabel("Customer", { exact: true }).selectOption("c1");
  await editor.getByLabel("Qty", { exact: true }).fill("2");
  await editor.getByLabel("Discount code", { exact: true }).fill("WELCOME10");
  expect(await editor.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(
    true,
  );
  await editor
    .getByRole("button", { name: "Create order", exact: true })
    .click();
  const detail = page.getByRole("dialog", { name: "Order details" });
  await expect(detail).toContainText("$86.40");
  expect(await detail.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(
    true,
  );
  await detail
    .getByRole("button", { name: "Start packing", exact: true })
    .click();
  await expect(detail.locator(".c-detail-status")).toContainText("Processing");
});
