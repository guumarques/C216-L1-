import { expect, it } from "vitest";
import { formatDate } from "./date.js";

it("formata a data no padrão brasileiro", () => {
  expect(formatDate("2026-11-20")).toBe("20/11/2026");
});
