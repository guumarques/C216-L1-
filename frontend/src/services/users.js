export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const USERS_URL = `${API_URL}/users/`;
const JSON_HEADERS = { "Content-Type": "application/json" };

function userUrl(id) {
  return `${USERS_URL}${id}`;
}

async function readErrorDetail(response) {
  try {
    const body = await response.json();
    return typeof body.detail === "string" ? body.detail : null;
  } catch {
    return null;
  }
}

async function request(url, options, fallbackMessage) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Não foi possível conectar à API.");
  }

  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(detail ?? fallbackMessage);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function listUsers() {
  return request(USERS_URL, undefined, "Erro ao carregar os usuários.");
}

export function getUser(id) {
  return request(userUrl(id), undefined, "Erro ao buscar o usuário.");
}

export function createUser({ name, email }) {
  return request(
    USERS_URL,
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ name, email }),
    },
    "Erro ao cadastrar o usuário.",
  );
}

export function updateUser(id, { name, email }) {
  return request(
    userUrl(id),
    {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({ name, email }),
    },
    "Erro ao atualizar o usuário.",
  );
}

export function patchUser(id, changes) {
  return request(
    userUrl(id),
    { method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify(changes) },
    "Erro ao atualizar o usuário.",
  );
}

export function deleteUser(id) {
  return request(
    userUrl(id),
    { method: "DELETE" },
    "Erro ao remover o usuário.",
  );
}
