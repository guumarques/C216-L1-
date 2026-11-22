import AttendanceSummary, { StatusBadge } from "./AttendanceSummary.jsx";

export default function SubjectCard({ subject, onOpen, onEdit, onDelete }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">{subject.name}</h2>
          {subject.professor && (
            <p className="text-sm text-slate-500">{subject.professor}</p>
          )}
        </div>
        <StatusBadge status={subject.status} />
      </header>

      <AttendanceSummary subject={subject} />

      <footer className="flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => onOpen(subject.id)}
          className="rounded-md bg-blue-600 px-3 py-1 font-medium text-white hover:bg-blue-700"
        >
          Ver faltas
        </button>
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
