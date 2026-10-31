import { describe, expect, it } from "vitest";
import { NAME_MAX_LENGTH, validateItem } from "../../src/validation";

describe("validateItem", () => {
  it("rejeita nome vazio ou só com espaços", () => {
    const { errors } = validateItem({ name: "   ", description: "" });
    expect(errors.name).toBeDefined();
  });

  it("rejeita nome maior que o limite permitido", () => {
    const { errors } = validateItem({
      name: "a".repeat(NAME_MAX_LENGTH + 1),
      description: "",
    });
    expect(errors.name).toBeDefined();
  });

  it("aceita nome válido e remove espaços nas pontas", () => {
    const { errors, values } = validateItem({
      name: "  Notebook  ",
      description: "  14 polegadas  ",
    });
    expect(errors.name).toBeUndefined();
    expect(values).toEqual({ name: "Notebook", description: "14 polegadas" });
  });
});
