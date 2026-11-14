import { expect, test } from "@playwright/test";

// Roda contra a stack real (React -> FastAPI -> PostgreSQL).
// Nomes e e-mails únicos evitam conflito com dados de execuções anteriores.
function unique(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function addUser(page, name, email) {
  const form = page.locator("form").first();
  await form.getByLabel("Nome").fill(name);
  await form.getByLabel("E-mail").fill(email);
  await form.getByRole("button", { name: "Adicionar" }).click();
}

test("carrega a interface", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Gerenciador de Usuários" }),
  ).toBeVisible();
  await expect(page.getByText("Carregando usuários...")).toBeHidden();
});

test("cadastra um usuário e ele persiste após recarregar a página", async ({
  page,
}) => {
  const name = unique("Ana");
  await page.goto("/");
  await addUser(page, name, `${name}@example.com`);

  const item = page.getByRole("listitem").filter({ hasText: name });
  await expect(item).toBeVisible();

  await page.reload();
  await expect(item).toBeVisible(); // veio do PostgreSQL
});

test("mostra erro ao cadastrar um e-mail repetido", async ({ page }) => {
  const name = unique("Bia");
  const email = `${name}@example.com`;
  await page.goto("/");
  await addUser(page, name, email);
  await expect(
    page.getByRole("listitem").filter({ hasText: name }),
  ).toBeVisible();

  await addUser(page, `${name} 2`, email);

  await expect(page.getByRole("alert")).toHaveText(
    "Já existe um usuário com esse e-mail.",
  );
  await expect(page.getByLabel("Nome").first()).toHaveValue(`${name} 2`);
});

test("edita e remove um usuário", async ({ page }) => {
  const name = unique("Caio");
  const newName = `${name} Silva`;
  await page.goto("/");
  await addUser(page, name, `${name}@example.com`);

  const item = page.getByRole("listitem").filter({ hasText: name });
  await item.getByRole("button", { name: "Editar" }).click();

  // Em modo de edição o nome fica no value do input, então o formulário
  // é localizado pelo botão "Salvar".
  const editForm = page.locator("li").filter({
    has: page.getByRole("button", { name: "Salvar" }),
  });
  await editForm.getByLabel("Nome").fill(newName);
  await editForm.getByRole("button", { name: "Salvar" }).click();

  const edited = page.getByRole("listitem").filter({ hasText: newName });
  await expect(edited).toBeVisible();
  await page.reload();
  await expect(edited).toBeVisible();

  await edited.getByRole("button", { name: "Remover" }).click();
  await expect(edited).toBeHidden();
  await page.reload();
  await expect(edited).toBeHidden();
});

test("valida nome vazio sem chamar a API", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Adicionar" }).click();

  await expect(page.getByText("O nome é obrigatório.")).toBeVisible();
});
