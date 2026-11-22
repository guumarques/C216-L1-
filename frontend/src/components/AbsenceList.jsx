import { formatDate } from "../utils/date.js";

export default function AbsenceList({ absences, onEdit, onDelete }) {
  if (absences.length === 0) {
    return <p className="text-slate-500">Nenhuma falta registrada.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {absences.map((absence) => (
        <li
          key={absence.id}
          className="flex items-center justify-between gap-4 rounded-lg bg-white p-3 shadow-sm"
        >
          <div>
            <p className="font-medium">
              {formatDate(absence.date)} —{" "}
              {absence.quantity === 1 ? "1 aula" : `${absence.quantity} aulas`}
              {absence.justified && (
                <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                  Justificada
                </span>
              )}
            </p>
            {absence.note && (
              <p className="text-sm text-slate-500">{absence.note}</p>
            )}
          </div>

          <div className="flex shrink-0 gap-2 text-sm">
            <button
              type="button"
              onClick={() => onEdit(absence)}
              className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(absence)}
              className="rounded-md border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50"
            >
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
