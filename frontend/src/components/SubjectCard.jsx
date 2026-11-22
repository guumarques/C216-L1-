import { STATUS, usagePercent } from "../utils/status.js";

export default function SubjectCard({ subject, onEdit, onDelete }) {
  const status = STATUS[subject.status];
  const percent = usagePercent(subject.absences_used, subject.absence_limit);

  return (
    <article className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">{subject.name}</h2>
          {subject.professor && (
            <p className="text-sm text-slate-500">{subject.professor}</p>
          )}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.badge}`}
        >
          {status.label}
        </span>
      </header>

      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>
            {subject.absences_used} de {subject.absence_limit} faltas
          </span>
          <span className="text-slate-500">
            Restam {subject.absences_remaining}
          </span>
        </div>
        <div
          aria-hidden="true"
          className="h-2 overflow-hidden rounded-full bg-slate-200"
        >
          <div
            className={`h-full ${status.bar}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <footer className="flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => onEdit(subject)}
          className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(subject)}
          className="rounded-md border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50"
        >
          Excluir
        </button>
      </footer>
    </article>
  );
}
