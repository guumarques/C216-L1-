import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { todayISO } from "../utils/date.js";
import AbsenceForm from "./AbsenceForm.jsx";

it("registra falta justificada com a data de hoje por padrão", async () => {
  const onSubmit = vi.fn().mockResolvedValue();
  render(<AbsenceForm onSubmit={onSubmit} onCancel={vi.fn()} />);

  await userEvent.click(screen.getByLabelText(/falta justificada/i));
  await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

  expect(onSubmit).toHaveBeenCalledWith({
    date: todayISO(),
    justified: true,
    note: null,
  });
});
