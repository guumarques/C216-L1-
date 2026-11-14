import { useEffect, useState } from "react";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "./services/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  // Estas funções lançam erro se a API falhar; o formulário/lista mostra a mensagem.
  async function addUser(values) {
    const created = await createUser(values);
    setUsers((current) => [...current, created]);
  }

  async function saveUser(id, values) {
    const updated = await updateUser(id, values);
    setUsers((current) =>
      current.map((user) => (user.id === id ? updated : user)),
    );
  }

  async function removeUser(id) {
    await deleteUser(id);
    setUsers((current) => current.filter((user) => user.id !== id));
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold">Gerenciador de Usuários</h1>
      <UserForm onSubmit={addUser} />
      <section aria-labelledby="users-heading" className="space-y-3">
        <h2 id="users-heading" className="text-xl font-semibold">
          Usuários cadastrados
        </h2>
        {loading && <p>Carregando usuários...</p>}
        {!loading && loadError && (
          <p role="alert" className="rounded bg-red-50 p-2 text-red-700">
            {loadError}
          </p>
        )}
        {!loading && !loadError && (
          <UserList users={users} onSave={saveUser} onDelete={removeUser} />
        )}
      </section>
    </main>
  );
}
