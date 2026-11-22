import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import SubjectForm from "./SubjectForm.jsx";

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText(/nome/i), "Redes");
  await userEvent.type(screen.getByLabelText(/total de aulas/i), "80");
  await userEvent.click(screen.getByRole("button", { name: "Salvar" }));
}

it("envia os dados convertidos e professor vazio como null", async () => {
  const onSubmit = vi.fn().mockResolvedValue();
  render(<SubjectForm onSubmit={onSubmit} onCancel={vi.fn()} />);

  await fillAndSubmit();

  expect(onSubmit).toHaveBeenCalledWith({
    name: "Redes",
    professor: null,
    total_classes: 80,
    absence_limit_percent: 25,
  });
});

it("mostra o erro devolvido pela API", async () => {
  const onSubmit = vi
    .fn()
    .mockRejectedValue(new Error("Já existe uma disciplina com esse nome."));
  render(<SubjectForm onSubmit={onSubmit} onCancel={vi.fn()} />);

  await fillAndSubmit();

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Já existe uma disciplina com esse nome.",
  );
});
