import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { UserForm } from "../../src/components/UserForm";

it("mostra erro e não chama onSubmit com nome vazio", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<UserForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.getByRole("alert")).toHaveTextContent("O nome é obrigatório.");
  expect(onSubmit).not.toHaveBeenCalled();
});

it("chama onSubmit e limpa o formulário com dados válidos", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn().mockResolvedValue(undefined);
  render(<UserForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Nome"), "Ana");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(onSubmit).toHaveBeenCalledWith({
    name: "Ana",
    email: "ana@example.com",
  });
  expect(screen.getByLabelText("Nome")).toHaveValue("");
  expect(screen.getByLabelText("E-mail")).toHaveValue("");
});

it("mostra o erro da API e mantém o que foi digitado", async () => {
  const user = userEvent.setup();
  const onSubmit = vi
    .fn()
    .mockRejectedValue(new Error("Já existe um usuário com esse e-mail."));
  render(<UserForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Nome"), "Ana");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Já existe um usuário com esse e-mail.",
  );
  expect(screen.getByLabelText("Nome")).toHaveValue("Ana");
  expect(screen.getByLabelText("E-mail")).toHaveValue("ana@example.com");
});

it("desabilita o botão enquanto salva", async () => {
  const user = userEvent.setup();
  let finish;
  const onSubmit = vi.fn(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  render(<UserForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Nome"), "Ana");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
  finish();
  expect(
    await screen.findByRole("button", { name: "Adicionar" }),
  ).toBeEnabled();
});
