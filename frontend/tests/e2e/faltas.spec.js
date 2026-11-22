import { expect, test } from "@playwright/test";

// Roda contra a stack real (React -> FastAPI -> PostgreSQL).
// Nomes únicos evitam conflito com dados de execuções anteriores.
function unique(prefix) {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function createSubject(page, name, totalClasses = 80) {
  await page.getByRole("button", { name: "Nova disciplina" }).click();
  await page.getByLabel("Nome").fill(name);
  await page.getByLabel("Total de aulas").fill(String(totalClasses));
  await page.getByRole("button", { name: "Salvar" }).click();
}

async function registerAbsence(page, date) {
  await page.getByRole("button", { name: "Registrar falta" }).click();
  await page.getByLabel("Data").fill(date);
  await page.getByRole("button", { name: "Salvar" }).click();
}

function subjectCard(page, name) {
  return page.getByRole("article").filter({ hasText: name });
}

test("carrega a interface", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Controle de Faltas" }),
  ).toBeVisible();
  await expect(page.getByText("Carregando disciplinas...")).toBeHidden();
});

test("cadastra uma disciplina e ela persiste após recarregar", async ({
  page,
}) => {
  const name = unique("Redes");
  await page.goto("/");
  await createSubject(page, name);

  const card = subjectCard(page, name);
  await expect(card).toBeVisible();
  await expect(card.getByText("0 de 20 faltas")).toBeVisible();
  await expect(card.getByText("Regular")).toBeVisible();

  await page.reload();
  await expect(card).toBeVisible(); // veio do PostgreSQL
});

test("mostra erro ao cadastrar disciplina com nome repetido", async ({
  page,
}) => {
  const name = unique("Compiladores");
  await page.goto("/");
  await createSubject(page, name);
  await expect(subjectCard(page, name)).toBeVisible();

  await createSubject(page, name);

  await expect(page.getByRole("alert")).toHaveText(
    "Já existe uma disciplina com esse nome.",
  );
});

test("registra faltas e a situação muda até reprovado", async ({ page }) => {
  // 8 aulas com 25% -> limite de 2 faltas; cada dia faltado vale 2
  const name = unique("Cálculo");
  await page.goto("/");
  await createSubject(page, name, 8);
  await subjectCard(page, name)
    .getByRole("button", { name: "Ver faltas" })
    .click();

  await expect(page.getByRole("heading", { name })).toBeVisible();
  await expect(page.getByText("Nenhuma falta registrada.")).toBeVisible();

  await registerAbsence(page, "2025-03-10");
  await expect(page.getByText("2 de 2 faltas")).toBeVisible();
  await expect(page.getByText("Em risco")).toBeVisible();
  await expect(page.getByText("10/03/2025 — 2 faltas")).toBeVisible();

  await registerAbsence(page, "2025-03-10");
  await expect(page.getByRole("alert")).toHaveText(
    "Já existe uma falta registrada nessa data para essa disciplina.",
  );
  await page.getByRole("button", { name: "Cancelar" }).click();

  await registerAbsence(page, "2025-03-11");
  await expect(page.getByText("4 de 2 faltas")).toBeVisible();
  await expect(page.getByText("Reprovado")).toBeVisible();

  await page.getByRole("button", { name: "Voltar para disciplinas" }).click();
  await expect(subjectCard(page, name).getByText("Reprovado")).toBeVisible();
});

test("falta justificada não conta no limite", async ({ page }) => {
  const name = unique("Física");
  await page.goto("/");
  await createSubject(page, name);
  await subjectCard(page, name)
    .getByRole("button", { name: "Ver faltas" })
    .click();

  await page.getByRole("button", { name: "Registrar falta" }).click();
  await page.getByLabel("Data").fill("2025-04-01");
  await page.getByLabel("Falta justificada").check();
  await page.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText("Justificada")).toBeVisible();
  await expect(page.getByText("0 de 20 faltas")).toBeVisible();
});

test("exclui uma disciplina", async ({ page }) => {
  const name = unique("Química");
  await page.goto("/");
  await createSubject(page, name);
  const card = subjectCard(page, name);
  await expect(card).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await card.getByRole("button", { name: "Excluir" }).click();

  await expect(card).toBeHidden();
  await page.reload();
  await expect(card).toBeHidden();
});
