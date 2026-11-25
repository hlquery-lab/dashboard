import { test, expect } from "@playwright/test";
import { createOrder, openPage, downloadText } from "./helpers.js";
test("discounted order reserves stock, updates sales, and cancellation restores both", async ({
  page,
}) => {
  await page.goto("/");
  await createOrder(page, { discount: "WELCOME10" });
  const detail = page.getByRole("dialog", { name: "Order details" });
  await expect(detail).toContainText("$86.40");
  await expect(detail).toContainText("WELCOME10");
  await expect(detail).toContainText("#1049");
  await detail.getByRole("button", { name: "Close order details" }).click();
  await expect(page.locator(".c-metric > strong").first()).toHaveText(
    "$1,645.40",
  );
  await openPage(page, "Inventory");
  let row = page
    .getByRole("row")
    .filter({
      has: page.getByRole("button", {
        name: "Everyday Canvas Tote",
        exact: false,
      }),
    });
  await expect(row.locator("td").nth(3)).toHaveText("40");
  await page.reload();
  await expect(row.locator("td").nth(3)).toHaveText("40");
  await openPage(page, "Orders");
  await page.getByRole("button", { name: "#1049", exact: true }).click();
  await detail
    .getByRole("button", { name: "Cancel order", exact: true })
    .click();
  await detail
    .getByRole("button", { name: "Confirm cancellation", exact: true })
    .click();
  await expect(detail).toContainText("Cancelled");
  await expect(detail).toContainText("Refunded");
  await detail.getByRole("button", { name: "Done", exact: true }).click();
  await openPage(page, "Inventory");
  await expect(row.locator("td").nth(3)).toHaveText("42");
  await openPage(page, "Overview");
  await expect(page.locator(".c-metric > strong").first()).toHaveText(
    "$1,559.00",
  );
});
test("pending order must be paid before packing, shipping, and delivery", async ({
  page,
}) => {
  await page.goto("/#Orders");
  await createOrder(page, { quantity: "1", payment: "Pending" });
  const detail = page.getByRole("dialog", { name: "Order details" });
  await expect(
    detail.getByRole("button", { name: "Start packing" }),
  ).toHaveCount(0);
  for (const name of [
    "Mark as paid",
    "Start packing",
    "Mark as shipped",
    "Mark as delivered",
  ])
    await detail.getByRole("button", { name, exact: true }).click();
  await expect(detail.locator(".c-detail-status")).toContainText("Delivered");
  const event = page.waitForEvent("download");
  await detail.getByRole("button", { name: "Invoice", exact: true }).click();
  const text = await downloadText(await event);
  expect(text).toContain("Total (USD): $48.00");
  expect(text).toContain("Fulfillment: Delivered");
  await detail.getByRole("button", { name: "Done", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "#1049", exact: true }).click();
  await expect(detail.locator(".c-detail-status")).toContainText("Delivered");
  await detail.getByRole("button", { name: "Done", exact: true }).click();
  await openPage(page, "Activity");
  await expect(page.locator(".c-activity")).toContainText(
    "ORD-1049 · Delivered · Paid",
  );
});
test("order search, payment filter, pagination, and CSV export agree", async ({
  page,
}) => {
  await page.goto("/#Orders");
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.locator(".c-pagination")).toContainText("9–16 of 16");
  await page.getByLabel("Search orders").fill("Olivia");
  await expect(page.locator(".c-table tbody tr")).toHaveCount(2);
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export filtered" }).click();
  const csv = await downloadText(await event);
  expect(csv).toContain("Total USD");
  expect(csv).toContain("Olivia Martin");
  expect(csv).not.toContain("Sophia Chen");
  await page.getByLabel("Search orders").fill("");
  await page
    .getByLabel("Payment status", { exact: true })
    .selectOption("Pending");
  await expect(page.locator(".c-table tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "#1044", exact: true }).click();
  const detail = page.getByRole("dialog", { name: "Order details" });
  await detail
    .getByRole("button", { name: "Cancel order", exact: true })
    .click();
  await detail.getByRole("button", { name: "Confirm cancellation" }).click();
  await expect(detail.locator(".c-detail-status")).toContainText("Voided");
});
test("unavailable discount codes and insufficient stock cannot create an order", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Create order", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog", { name: "Create order" });
  await dialog.getByLabel("Customer", { exact: true }).selectOption("c1");
  await dialog.getByLabel("Discount code", { exact: true }).fill("WEEKEND15");
  await dialog
    .getByRole("button", { name: "Create order", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toHaveText(
    "This discount code is unavailable.",
  );
  await dialog.getByLabel("Discount code", { exact: true }).fill("");
  await dialog.getByLabel("Qty", { exact: true }).fill("100");
  await dialog
    .getByRole("button", { name: "Create order", exact: true })
    .click();
  await expect(dialog).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("hlquery-commerce-v1"))?.orders
          .length || 16,
    ),
  ).toBe(16);
});
