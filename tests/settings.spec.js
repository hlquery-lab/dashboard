import { test, expect } from "@playwright/test";
import { openPage } from "./helpers.js";
test("store identity and appearance preferences persist with USD commerce data", async ({
  page,
}) => {
  await page.goto("/#Settings");
  await page.getByLabel("Store name", { exact: true }).fill("North & Oak");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.locator(".workspace-switch")).toContainText("North & Oak");
  const width = page.getByRole("slider", {
    name: "Content width",
    exact: true,
  });
  await width.focus();
  await width.press("Home");
  await width.press("ArrowRight");
  const radius = page.getByRole("slider", {
    name: "Card corners",
    exact: true,
  });
  await radius.focus();
  await radius.press("End");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Compact tables", exact: true })
    .check();
  await page.reload();
  await expect(page.getByLabel("Store name", { exact: true })).toHaveValue(
    "North & Oak",
  );
  await expect(width).toHaveValue("1110");
  await expect(radius).toHaveValue("28");
  await expect(page.locator(".workspace")).toHaveClass(/dark/);
  await expect(page.locator(".workspace")).toHaveClass(/dense/);
  await expect(
    page.getByRole("progressbar", { name: "Orders delivered" }),
  ).toHaveAttribute("value", "63");
  await openPage(page, "Overview");
  await expect(page.locator(".c-metric > strong").first()).toHaveText(
    "$1,559.00",
  );
  await expect(page.locator(".c-metric").first()).toHaveCSS(
    "border-radius",
    "28px",
  );
});
