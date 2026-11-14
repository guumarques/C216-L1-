import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import App from "../../src/App";
import { API_URL } from "../../src/services/users";
import { emptyResponse, jsonResponse } from "../helpers";

const ana = { id: 1, name: "Ana", email: "ana@example.com" };

afterEach(() => {
  vi.unstubAllGlobals();
});

it("mostra 'Carregando' até a API responder", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));
  render(<App />);

  expect(screen.getByText("Carregando usuários...")).toBeInTheDocument();
  expect(
    await screen.findByText("Nenhum usuário cadastrado."),
  ).toBeInTheDocument();
  expect(screen.queryByText("Carregando usuários...")).not.toBeInTheDocument();
});

it("exibe os usuários vindos da API", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([ana])));
  render(<App />);

  expect(await screen.findByText("Ana")).toBeInTheDocument();
  expect(screen.getByText("ana@example.com")).toBeInTheDocument();
});

it("mostra erro quando não consegue conectar à API", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fail")));
  render(<App />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Não foi possível conectar à API.",
  );
});

it("envia o POST e adiciona o usuário criado na lista", async () => {
  const user = userEvent.setup();
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([]))
    .mockResolvedValueOnce(jsonResponse(ana, 201));
  vi.stubGlobal("fetch", fetchMock);
  render(<App />);
  await screen.findByText("Nenhum usuário cadastrado.");

  await user.type(screen.getByLabelText("Nome"), "Ana");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(await screen.findByRole("listitem")).toHaveTextContent("Ana");
  const [url, options] = fetchMock.mock.calls[1];
  expect(url).toBe(`${API_URL}/users/`);
  expect(options.method).toBe("POST");
  expect(JSON.parse(options.body)).toEqual({
    name: "Ana",
    email: "ana@example.com",
  });
});

it("mostra o erro 409 e mantém os dados digitados", async () => {
  const user = userEvent.setup();
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([ana]))
      .mockResolvedValueOnce(
        jsonResponse({ detail: "Já existe um usuário com esse e-mail." }, 409),
      ),
  );
  render(<App />);
  await screen.findByText("Ana");

  await user.type(screen.getByLabelText("Nome"), "Outra Ana");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Já existe um usuário com esse e-mail.",
  );
  expect(screen.getByLabelText("Nome")).toHaveValue("Outra Ana");
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
});

it("edita um usuário via PUT e atualiza a lista", async () => {
  const user = userEvent.setup();
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([ana]))
    .mockResolvedValueOnce(jsonResponse({ ...ana, name: "Ana Paula" }));
  vi.stubGlobal("fetch", fetchMock);
  render(<App />);
  const item = await screen.findByRole("listitem");

  await user.click(within(item).getByRole("button", { name: "Editar" }));
  const editForm = screen
    .getByRole("button", { name: "Salvar" })
    .closest("form");
  const nameInput = within(editForm).getByLabelText("Nome");
  await user.clear(nameInput);
  await user.type(nameInput, "Ana Paula");
  await user.click(within(editForm).getByRole("button", { name: "Salvar" }));

  expect(await screen.findByText("Ana Paula")).toBeInTheDocument();
  const [url, options] = fetchMock.mock.calls[1];
  expect(url).toBe(`${API_URL}/users/1`);
  expect(options.method).toBe("PUT");
});

it("remove um usuário via DELETE", async () => {
  const user = userEvent.setup();
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse([ana]))
    .mockResolvedValueOnce(emptyResponse(204));
  vi.stubGlobal("fetch", fetchMock);
  render(<App />);
  await screen.findByText("Ana");

  await user.click(screen.getByRole("button", { name: "Remover" }));

  expect(
    await screen.findByText("Nenhum usuário cadastrado."),
  ).toBeInTheDocument();
  expect(fetchMock.mock.calls[1][1].method).toBe("DELETE");
});
