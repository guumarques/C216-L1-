import { describe, expect, it } from "vitest";
import { usagePercent } from "./status.js";

describe("usagePercent", () => {
  it("calcula a porcentagem de faltas usadas", () => {
    expect(usagePercent(5, 20)).toBe(25);
  });

  it("não passa de 100%", () => {
    expect(usagePercent(30, 20)).toBe(100);
  });

  it("com limite zero, fica 0% sem faltas e 100% com faltas", () => {
    expect(usagePercent(0, 0)).toBe(0);
    expect(usagePercent(1, 0)).toBe(100);
  });
});
