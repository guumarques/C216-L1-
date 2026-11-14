import { useState } from "react";
import { UserForm } from "./UserForm";

function UserRow({ user, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleSave(values) {
    await onSave(user.id, values);
    setEditing(false);
  }

  async function handleDelete() {
    setDeleteError("");
    setRemoving(true);
    try {
      await onDelete(user.id);
    } catch (error) {
      setDeleteError(error.message);
      setRemoving(false);
    }
  }

  if (editing) {
    return (
      <li>
        <UserForm
          idPrefix={`edit-${user.id}`}
          initialValues={{ name: user.name, email: user.email }}
          submitLabel="Salvar"
          onSubmit={handleSave}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-slate-600">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={removing}
            className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Remover
          </button>
        </div>
      </div>
      {deleteError && (
        <p role="alert" className="text-sm text-red-700">
          {deleteError}
        </p>
      )}
    </li>
  );
}

export function UserList({ users, onSave, onDelete }) {
  if (users.length === 0) {
    return <p>Nenhum usuário cadastrado.</p>;
  }

  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
