import { describe, expect, it } from "vitest";
import { NAME_MAX_LENGTH, validateUser } from "../../src/validation";

describe("validateUser", () => {
  it("rejeita nome vazio ou só com espaços", () => {
    const { errors } = validateUser({ name: "   ", email: "ana@example.com" });
    expect(errors.name).toBe("O nome é obrigatório.");
  });

  it("rejeita nome maior que o limite permitido", () => {
    const { errors } = validateUser({
      name: "a".repeat(NAME_MAX_LENGTH + 1),
      email: "ana@example.com",
    });
    expect(errors.name).toBeDefined();
  });

  it("exige e-mail", () => {
    const { errors } = validateUser({ name: "Ana", email: "" });
    expect(errors.email).toBe("O e-mail é obrigatório.");
  });

  it("rejeita e-mail sem formato válido", () => {
    const { errors } = validateUser({ name: "Ana", email: "ana.example.com" });
    expect(errors.email).toBe("Informe um e-mail válido.");
  });

  it("aceita dados válidos e remove espaços nas pontas", () => {
    const { errors, values } = validateUser({
      name: "  Ana  ",
      email: "  ana@example.com ",
    });
    expect(errors).toEqual({});
    expect(values).toEqual({ name: "Ana", email: "ana@example.com" });
  });
});
