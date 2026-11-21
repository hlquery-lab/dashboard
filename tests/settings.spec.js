import { test, expect } from "@playwright/test";

test("settings change the workspace and persist after reload", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#Settings");
  await page
    .getByLabel("Workspace name", { exact: true })
    .fill("Design studio");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.locator(".workspace-switch")).toContainText(
    "Design studio",
  );
  const width = page.getByRole("slider", {
    name: "Content width",
    exact: true,
  });
  await width.focus();
  await width.press("Home");
  await width.press("ArrowRight");
  await expect(width).toHaveValue("1110");
  const radius = page.getByRole("slider", {
    name: "Card corners",
    exact: true,
  });
  await radius.focus();
  await radius.press("End");
  await expect(page.locator(".preferences-panel").first()).toHaveCSS(
    "border-radius",
    "28px",
  );
  await expect(page.locator("#main")).toHaveCSS("max-width", "1110px");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Compact tables", exact: true })
    .check();
  await page.reload();
  await expect(page.getByLabel("Workspace name", { exact: true })).toHaveValue(
    "Design studio",
  );
  await expect(radius).toHaveValue("28");
  await expect(width).toHaveValue("1110");
  await expect(page.locator(".workspace")).toHaveClass(/dark/);
  await expect(page.locator(".workspace")).toHaveClass(/dense/);
  await expect(
    page.getByRole("progressbar", { name: "Projects completed" }),
  ).toHaveAttribute("value", "20");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "/tmp/hlquery-settings-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await page.screenshot({
    path: "/tmp/hlquery-settings-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Explore appearance" }).click();
  await expect(page.locator("h1")).toHaveText("Appearance");
  expect(errors).toEqual([]);
});
