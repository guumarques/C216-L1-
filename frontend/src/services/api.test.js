import { afterEach, describe, expect, it, vi } from "vitest";
import { request } from "./api.js";

function mockFetch(status, body) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("request", () => {
  it("devolve o JSON quando a resposta é de sucesso", async () => {
    mockFetch(200, [{ id: 1 }]);

    await expect(request("/subjects/")).resolves.toEqual([{ id: 1 }]);
  });

  it("envia o corpo como JSON", async () => {
    const fetchMock = mockFetch(201, { id: 1 });

    await request("/subjects/", { method: "POST", body: { name: "POO" } });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({ "Content-Type": "application/json" });
    expect(options.body).toBe(JSON.stringify({ name: "POO" }));
  });

  it("devolve null no 204", async () => {
    mockFetch(204, null);

    await expect(
      request("/subjects/1", { method: "DELETE" }),
    ).resolves.toBeNull();
  });

  it("usa a mensagem do detail quando a API devolve erro", async () => {
    mockFetch(409, { detail: "Já existe uma disciplina com esse nome." });

    await expect(request("/subjects/")).rejects.toMatchObject({
      status: 409,
      message: "Já existe uma disciplina com esse nome.",
    });
  });

  it("junta as mensagens de validação sem o prefixo do Pydantic", async () => {
    mockFetch(422, {
      detail: [{ msg: "Value error, A data da falta não pode ser no futuro." }],
    });

    await expect(request("/subjects/1/absences")).rejects.toThrow(
      "A data da falta não pode ser no futuro.",
    );
  });

  it("avisa quando não consegue conectar ao servidor", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError()));

    await expect(request("/subjects/")).rejects.toMatchObject({
      status: 0,
      message: "Não foi possível conectar ao servidor.",
    });
  });
});
