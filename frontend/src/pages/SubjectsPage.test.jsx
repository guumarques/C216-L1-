import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { listSubjects } from "../services/subjects.js";
import SubjectsPage from "./SubjectsPage.jsx";

vi.mock("../services/subjects.js", () => ({
  listSubjects: vi.fn(),
  createSubject: vi.fn(),
  updateSubject: vi.fn(),
  deleteSubject: vi.fn(),
}));

const SUBJECT = {
  id: 1,
  name: "Sistemas Distribuídos",
  professor: null,
  total_classes: 80,
  absence_limit_percent: 25,
  absence_limit: 20,
  absences_used: 0,
  absences_remaining: 20,
  status: "ok",
};

it("mostra carregando e depois a lista de disciplinas", async () => {
  listSubjects.mockResolvedValue([SUBJECT]);
  render(<SubjectsPage onOpenSubject={vi.fn()} />);

  expect(screen.getByText("Carregando disciplinas...")).toBeInTheDocument();
  expect(await screen.findByText("Sistemas Distribuídos")).toBeInTheDocument();
});

it("mostra mensagem quando não há disciplinas", async () => {
  listSubjects.mockResolvedValue([]);
  render(<SubjectsPage onOpenSubject={vi.fn()} />);

  expect(
    await screen.findByText("Nenhuma disciplina cadastrada ainda."),
  ).toBeInTheDocument();
});

it("mostra o erro quando a API está fora do ar", async () => {
  listSubjects.mockRejectedValue(
    new Error("Não foi possível conectar ao servidor."),
  );
  render(<SubjectsPage onOpenSubject={vi.fn()} />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Não foi possível conectar ao servidor.",
  );
});
