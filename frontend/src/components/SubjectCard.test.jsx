import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import SubjectCard from "./SubjectCard.jsx";

const SUBJECT = {
  id: 1,
  name: "Sistemas Distribuídos",
  professor: "Chris",
  total_classes: 80,
  absence_limit_percent: 25,
  absence_limit: 20,
  absences_used: 15,
  absences_remaining: 5,
  status: "at_risk",
};

function renderCard() {
  const handlers = { onOpen: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() };
  render(<SubjectCard subject={SUBJECT} {...handlers} />);
  return handlers;
}

it("mostra o resumo e a situação em português", () => {
  renderCard();

  expect(screen.getByText("Sistemas Distribuídos")).toBeInTheDocument();
  expect(screen.getByText("Em risco")).toBeInTheDocument();
  expect(screen.getByText("15 de 20 faltas")).toBeInTheDocument();
  expect(screen.getByText("Restam 5")).toBeInTheDocument();
});

it("chama onOpen com o id ao clicar em Ver faltas", async () => {
  const { onOpen } = renderCard();

  await userEvent.click(screen.getByRole("button", { name: "Ver faltas" }));

  expect(onOpen).toHaveBeenCalledWith(1);
});
