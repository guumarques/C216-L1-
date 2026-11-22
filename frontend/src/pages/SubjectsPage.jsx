import { useCallback, useEffect, useState } from "react";
import SubjectCard from "../components/SubjectCard.jsx";
import SubjectForm from "../components/SubjectForm.jsx";
import {
  createSubject,
  deleteSubject,
  listSubjects,
  updateSubject,
} from "../services/subjects.js";

export default function SubjectsPage({ onOpenSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSubjects(await listSubjects());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  function openForm(subject = null) {
    setSelected(subject);
    setFormOpen(true);
  }

  function closeForm() {
    setSelected(null);
    setFormOpen(false);
  }

  async function handleSubmit(data) {
    if (selected) {
      await updateSubject(selected.id, data);
    } else {
      await createSubject(data);
    }
    closeForm();
    await loadSubjects();
  }

  async function handleDelete(subject) {
    if (!window.confirm(`Excluir "${subject.name}" e todas as suas faltas?`)) {
      return;
    }
    try {
      await deleteSubject(subject.id);
      await loadSubjects();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Controle de Faltas</h1>
        {!isFormOpen && (
          <button
            type="button"
            onClick={() => openForm()}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nova disciplina
          </button>
        )}
      </header>

      {isFormOpen && (
        <SubjectForm
          key={selected?.id ?? "new"}
          subject={selected}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button type="button" onClick={loadSubjects} className="underline">
            Tentar novamente
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Carregando disciplinas...</p>
      ) : subjects.length === 0 ? (
        !error && (
          <p className="text-slate-500">Nenhuma disciplina cadastrada ainda.</p>
        )
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onOpen={onOpenSubject}
              onEdit={openForm}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
    </main>
  );
}
