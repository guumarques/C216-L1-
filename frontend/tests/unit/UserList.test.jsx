import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { UserList } from "../../src/components/UserList";

const ana = { id: 1, name: "Ana", email: "ana@example.com" };

it("mostra o estado vazio quando não há usuários", () => {
  render(<UserList users={[]} onSave={vi.fn()} onDelete={vi.fn()} />);

  expect(screen.getByText("Nenhum usuário cadastrado.")).toBeInTheDocument();
});

it("lista nome e e-mail de cada usuário", () => {
  render(<UserList users={[ana]} onSave={vi.fn()} onDelete={vi.fn()} />);

  expect(screen.getByRole("listitem")).toHaveTextContent("Ana");
  expect(screen.getByRole("listitem")).toHaveTextContent("ana@example.com");
});

it("chama onDelete com o id ao clicar em Remover", async () => {
  const user = userEvent.setup();
  const onDelete = vi.fn().mockResolvedValue(undefined);
  render(<UserList users={[ana]} onSave={vi.fn()} onDelete={onDelete} />);

  await user.click(screen.getByRole("button", { name: "Remover" }));

  expect(onDelete).toHaveBeenCalledWith(1);
});

it("mostra o erro quando a remoção falha", async () => {
  const user = userEvent.setup();
  const onDelete = vi
    .fn()
    .mockRejectedValue(new Error("Usuário não encontrado."));
  render(<UserList users={[ana]} onSave={vi.fn()} onDelete={onDelete} />);

  await user.click(screen.getByRole("button", { name: "Remover" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Usuário não encontrado.",
  );
});

it("edita o usuário e chama onSave com o id e os novos valores", async () => {
  const user = userEvent.setup();
  const onSave = vi.fn().mockResolvedValue(undefined);
  render(<UserList users={[ana]} onSave={onSave} onDelete={vi.fn()} />);

  await user.click(screen.getByRole("button", { name: "Editar" }));
  const nameInput = screen.getByLabelText("Nome");
  expect(nameInput).toHaveValue("Ana");

  await user.clear(nameInput);
  await user.type(nameInput, "Ana Paula");
  await user.click(screen.getByRole("button", { name: "Salvar" }));

  expect(onSave).toHaveBeenCalledWith(1, {
    name: "Ana Paula",
    email: "ana@example.com",
  });
  expect(
    await screen.findByRole("button", { name: "Editar" }),
  ).toBeInTheDocument();
});
