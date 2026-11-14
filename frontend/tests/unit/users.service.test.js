import { afterEach, describe, expect, it, vi } from "vitest";
import {
  API_URL,
  createUser,
  deleteUser,
  getUser,
  listUsers,
  patchUser,
  updateUser,
} from "../../src/services/users";
import { emptyResponse, jsonResponse } from "../helpers";

const ana = { id: 1, name: "Ana", email: "ana@example.com" };

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockFetch(response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("services/users", () => {
  it("listUsers faz GET em /users/ e devolve a lista", async () => {
    const fetchMock = mockFetch(jsonResponse([ana]));

    await expect(listUsers()).resolves.toEqual([ana]);
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/users/`, undefined);
  });

  it("getUser faz GET em /users/{id}", async () => {
    const fetchMock = mockFetch(jsonResponse(ana));

    await expect(getUser(1)).resolves.toEqual(ana);
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/users/1`, undefined);
  });

  it("createUser envia POST com o corpo em JSON", async () => {
    const fetchMock = mockFetch(jsonResponse(ana, 201));

    await expect(
      createUser({ name: "Ana", email: "ana@example.com" }),
    ).resolves.toEqual(ana);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_URL}/users/`);
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(options.body)).toEqual({
      name: "Ana",
      email: "ana@example.com",
    });
  });

  it("updateUser envia PUT com todos os campos", async () => {
    const fetchMock = mockFetch(jsonResponse({ ...ana, name: "Ana Paula" }));

    await updateUser(1, { name: "Ana Paula", email: "ana@example.com" });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_URL}/users/1`);
    expect(options.method).toBe("PUT");
    expect(JSON.parse(options.body)).toEqual({
      name: "Ana Paula",
      email: "ana@example.com",
    });
  });

  it("patchUser envia PATCH só com os campos alterados", async () => {
    const fetchMock = mockFetch(jsonResponse({ ...ana, name: "Ana P." }));

    await patchUser(1, { name: "Ana P." });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe("PATCH");
    expect(JSON.parse(options.body)).toEqual({ name: "Ana P." });
  });

  it("deleteUser envia DELETE e trata a resposta 204 sem corpo", async () => {
    const fetchMock = mockFetch(emptyResponse(204));

    await expect(deleteUser(1)).resolves.toBeNull();
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("lança erro amigável quando a API está inacessível", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fail")));

    await expect(listUsers()).rejects.toThrow(
      "Não foi possível conectar à API.",
    );
  });

  it("usa o detail da API quando a resposta não é ok", async () => {
    mockFetch(
      jsonResponse({ detail: "Já existe um usuário com esse e-mail." }, 409),
    );

    await expect(
      createUser({ name: "Ana", email: "ana@example.com" }),
    ).rejects.toThrow("Já existe um usuário com esse e-mail.");
  });

  it("usa a mensagem padrão quando o detail não é texto (ex.: 422)", async () => {
    mockFetch(jsonResponse({ detail: [{ msg: "invalid" }] }, 422));

    await expect(
      createUser({ name: "Ana", email: "ana@example.com" }),
    ).rejects.toThrow("Erro ao cadastrar o usuário.");
  });
});
