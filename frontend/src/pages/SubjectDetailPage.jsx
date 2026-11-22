import { useCallback, useEffect, useState } from "react";
import AbsenceForm from "../components/AbsenceForm.jsx";
import AbsenceList from "../components/AbsenceList.jsx";
import AttendanceSummary, {
  StatusBadge,
} from "../components/AttendanceSummary.jsx";
import {
  createAbsence,
  deleteAbsence,
  listAbsences,
  updateAbsence,
} from "../services/absences.js";
import { getSubject } from "../services/subjects.js";
import { formatDate } from "../utils/date.js";

export default function SubjectDetailPage({ subjectId, onBack }) {
  const [subject, setSubject] = useState(null);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Recarrega a disciplina junto com as faltas para o resumo ficar atualizado
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [subjectData, absencesData] = await Promise.all([
        getSubject(subjectId),
        listAbsences(subjectId),
      ]);
      setSubject(subjectData);
      setAbsences(absencesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openForm(absence = null) {
    setSelected(absence);
    setFormOpen(true);
  }

  function closeForm() {
    setSelected(null);
    setFormOpen(false);
  }

  async function handleSubmit(data) {
    if (selected) {
      await updateAbsence(selected.id, data);
    } else {
      await createAbsence(subjectId, data);
    }
    closeForm();
    await loadData();
  }

  async function handleDelete(absence) {
    if (!window.confirm(`Excluir a falta de ${formatDate(absence.date)}?`)) {
      return;
    }
    try {
      await deleteAbsence(absence.id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-blue-700 hover:underline"
      >
        ← Voltar para disciplinas
      </button>

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button type="button" onClick={loadData} className="underline">
            Tentar novamente
          </button>
        </div>
      )}

      {loading && !subject && (
        <p className="text-slate-500">Carregando disciplina...</p>
      )}

      {subject && (
        <>
          <section className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
            <header className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold">{subject.name}</h1>
                <p className="text-sm text-slate-500">
                  {subject.professor ? `${subject.professor} · ` : ""}
                  {subject.total_classes} aulas · limite de{" "}
                  {subject.absence_limit_percent}%
                </p>
              </div>
              <StatusBadge status={subject.status} />
            </header>
            <AttendanceSummary subject={subject} />
          </section>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Faltas</h2>
            {!isFormOpen && (
              <button
                type="button"
                onClick={() => openForm()}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Registrar falta
              </button>
            )}
          </div>

          {isFormOpen && (
            <AbsenceForm
              key={selected?.id ?? "new"}
              absence={selected}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          )}

          <AbsenceList
            absences={absences}
            onEdit={openForm}
            onDelete={handleDelete}
          />
        </>
      )}
    </main>
  );
}
